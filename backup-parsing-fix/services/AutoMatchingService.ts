import logger from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import type { SponsorAllocation } from '@/types/SponsorTypes';
import { matchingRulesService, type MatchingResult } from './MatchingRulesService';

export interface AutoMatchingConfig {
  enabled: boolean;
  batchSize: number;
  minScoreThreshold: number;
  maxMatchesPerStudent: number;
  maxStudentsPerSponsor: number;
  autoAssignEnabled: boolean;
  conflictResolutionEnabled: boolean;
  notificationEnabled: boolean;
}

export interface BulkMatchingJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  totalStudents: number;
  totalSponsors: number;
  matchesFound: number;
  assignmentsMade: number;
  errors: string[];
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

class AutoMatchingService {
  private config: AutoMatchingConfig = {
    enabled: true,
    batchSize: 50,
    minScoreThreshold: 60,
    maxMatchesPerStudent: 5,
    maxStudentsPerSponsor: 10,
    autoAssignEnabled: true,
    conflictResolutionEnabled: true,
    notificationEnabled: true,
  };

  /**
   * Initialize the auto-matching service
   */
  async initialize(): Promise<void> {
    try {
      // Initialize matching rules
      await matchingRulesService.initializeRules();
      logger.info('Auto-matching service initialized successfully');
    } catch (error) {
      logger.error('Error initializing auto-matching service:', error);
      throw error;
    }
  }

  /**
   * Run bulk matching for all eligible students
   */
  async runBulkMatching(): Promise<BulkMatchingJob> {
    try {
      let totalMatches = 0;
      let totalAssignments = 0;
      const errors: string[] = [];

      // Get eligible students
      const { data: students, error: studentsError } = await supabase
        .from('users')
        .select('id')
        .eq('user_type', 'student');

      if (studentsError) throw studentsError;

      // Get active sponsors
      const { data: sponsors, error: sponsorsError } = await supabase
        .from('sponsors')
        .select('id')
        .eq('verified_status', 'verified');

      if (sponsorsError) throw sponsorsError;

      // Process students in batches
      const studentBatches = this.chunkArray(students || [], this.config.batchSize);

      for (const batch of studentBatches) {
        for (const student of batch) {
          try {
            const matches = await matchingRulesService.findMatches({
              student_id: student.id,
              limit: this.config.maxMatchesPerStudent,
            });

            // Filter matches by threshold
            const validMatches = matches.filter(
              (match) => match.score >= this.config.minScoreThreshold,
            );
            totalMatches += validMatches.length;

            // Create assignments if auto-assign is enabled
            if (this.config.autoAssignEnabled && validMatches.length > 0) {
              const assignment = await this.createAssignment(validMatches[0]);
              if (assignment) {
                totalAssignments++;
              }
            }

            // Save matches to database
            await matchingRulesService.saveMatchingResults(validMatches);
          } catch (error) {
            const errorMessage = `Error processing student ${student.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
            errors.push(errorMessage);
            logger.error(errorMessage);
          }
        }
      }

      return {
        id: 'job-' + Date.now(),
        status: 'completed',
        totalStudents: students?.length || 0,
        totalSponsors: sponsors?.length || 0,
        matchesFound: totalMatches,
        assignmentsMade: totalAssignments,
        errors,
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Error in bulk matching:', error);
      throw error;
    }
  }

  /**
   * Create a sponsor allocation assignment
   */
  async createAssignment(match: MatchingResult): Promise<SponsorAllocation | null> {
    try {
      // Check if assignment already exists
      const { data: existingAssignment } = await supabase
        .from('sponsor_allocations')
        .select('id')
        .eq('student_id', match.student_id)
        .eq('sponsor_id', match.sponsor_id)
        .maybeSingle();

      if (existingAssignment) {
        return null; // Assignment already exists
      }

      // Check sponsor capacity
      const { data: currentAllocations } = await supabase
        .from('sponsor_allocations')
        .select('id')
        .eq('sponsor_id', match.sponsor_id)
        .eq('status', 'active');

      if (currentAllocations && currentAllocations.length >= this.config.maxStudentsPerSponsor) {
        return null; // Sponsor at capacity
      }

      // Create assignment
      const assignment = {
        sponsor_id: match.sponsor_id,
        student_id: match.student_id,
        allocated_on: new Date().toISOString(),
        expires_on: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        status: 'active',
        plan: 'standard',
        notes: `Auto-assigned with ${match.score}% match score`,
      };

      const { data: newAssignment, error } = await supabase
        .from('sponsor_allocations')
        .insert(assignment)
        .select()
        .single();

      if (error) throw error;

      // Send notifications if enabled
      if (this.config.notificationEnabled) {
        await this.sendAssignmentNotifications(newAssignment);
      }

      return newAssignment;
    } catch (error) {
      logger.error('Error creating assignment:', error);
      return null;
    }
  }

  /**
   * Resolve conflicts in assignments
   */
  async resolveConflicts(): Promise<void> {
    try {
      // Find overlapping assignments - use status 'active' instead of 'pending'
      const { data: conflicts } = await supabase
        .from('sponsor_allocations')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!conflicts) return;

      const resolvedAssignments = new Set<string>();
      const sponsorAssignments = new Map<string, string[]>();

      for (const assignment of conflicts) {
        const sponsorId = assignment.sponsor_id;
        const studentId = assignment.student_id;

        // Skip if already resolved
        if (resolvedAssignments.has(`${sponsorId}-${studentId}`)) {
          continue;
        }

        // Get current assignments for this sponsor
        const currentAssignments = sponsorAssignments.get(sponsorId) || [];

        // Check if sponsor has capacity
        if (currentAssignments.length < this.config.maxStudentsPerSponsor) {
          // Keep assignment
          currentAssignments.push(studentId);
          sponsorAssignments.set(sponsorId, currentAssignments);
          resolvedAssignments.add(`${sponsorId}-${studentId}`);
        } else {
          // Deactivate assignment due to capacity
          await this.updateAssignmentStatus(assignment.id, 'inactive');
        }
      }
    } catch (error) {
      logger.error('Error resolving conflicts:', error);
      throw error;
    }
  }

  /**
   * Update assignment status
   */
  private async updateAssignmentStatus(assignmentId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('sponsor_allocations')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', assignmentId);

    if (error) {
      throw error;
    }
  }

  /**
   * Send assignment notifications
   */
  private async sendAssignmentNotifications(assignment: SponsorAllocation): Promise<void> {
    try {
      // Import notification service dynamically to avoid circular dependencies
      const { notificationService } = await import('./NotificationService');

      // Send notification to student
      await notificationService.sendNotification({
        userId: assignment.student_id,
        templateId: 'sponsorship-allocated',
        variables: {
          student_name: 'Student',
          plan: assignment.plan || 'standard',
          sponsor_name: 'Sponsor',
        },
      });

      // Send notification to sponsor
      await notificationService.sendNotification({
        userId: assignment.sponsor_id,
        templateId: 'sponsorship-payment-received',
        variables: {
          sponsor_name: 'Sponsor',
          plan: assignment.plan || 'standard',
          student_name: 'Student',
        },
      });
    } catch (error) {
      logger.error('Error sending assignment notifications:', error);
    }
  }

  /**
   * Get sponsor allocations
   */
  async getSponsorAllocations(filters?: {
    sponsor_id?: string;
    student_id?: string;
    status?: string;
  }): Promise<SponsorAllocation[]> {
    try {
      let query = supabase
        .from('sponsor_allocations')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.sponsor_id) {
        query = query.eq('sponsor_id', filters.sponsor_id);
      }
      if (filters?.student_id) {
        query = query.eq('student_id', filters.student_id);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching sponsor allocations:', error);
      throw error;
    }
  }

  /**
   * Get bulk matching jobs (simplified - returns recent job records from matching results)
   */
  async getBulkMatchingJobs(_limit: number = 10): Promise<BulkMatchingJob[]> {
    try {
      // Since we don't have a bulk_matching_jobs table, return mock data
      // In a real implementation, this would track actual job execution
      return [];
    } catch (error) {
      logger.error('Error fetching bulk matching jobs:', error);
      return [];
    }
  }

  /**
   * Utility function to chunk array
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Get service configuration
   */
  getConfig(): AutoMatchingConfig {
    return { ...this.config };
  }

  /**
   * Update service configuration
   */
  updateConfig(newConfig: Partial<AutoMatchingConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get assignment statistics
   */
  async getAssignmentStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    expired: number;
  }> {
    try {
      const { data, error } = await supabase.from('sponsor_allocations').select('status');

      if (error) throw error;

      const allocations = data || [];
      const total = allocations.length;
      const active = allocations.filter((a) => a.status === 'active').length;
      const inactive = allocations.filter((a) => a.status === 'inactive').length;
      const expired = allocations.filter((a) => a.status === 'expired').length;

      return {
        total,
        active,
        inactive,
        expired,
      };
    } catch (error) {
      logger.error('Error getting assignment stats:', error);
      throw error;
    }
  }
}

// Export singleton instance

/**
 * autoMatchingService
 * @description Function
 */
export const autoMatchingService = new AutoMatchingService();
