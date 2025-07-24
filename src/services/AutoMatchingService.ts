import { supabase } from '@/integrations/supabase/client';
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

export interface AssignmentWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  step: number;
  name: string;
  action: string;
  conditions: string[];
  required: boolean;
  status: 'pending' | 'completed' | 'failed' | 'skipped';
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

export interface SponsorAllocation {
  id: string;
  sponsor_id: string;
  student_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  match_score: number;
  assignment_date: string;
  expiry_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
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
    notificationEnabled: true
  };

  /**
   * Initialize the auto-matching service
   */
  async initialize(): Promise<void> {
    try {
      // Initialize matching rules
      await matchingRulesService.initializeRules();
      
      // Create default workflows
      await this.createDefaultWorkflows();
      
      console.log('Auto-matching service initialized successfully');
    } catch (error) {
      console.error('Error initializing auto-matching service:', error);
      throw error;
    }
  }

  /**
   * Create default assignment workflows
   */
  private async createDefaultWorkflows(): Promise<void> {
    const defaultWorkflows: Omit<AssignmentWorkflow, 'id' | 'created_at' | 'updated_at'>[] = [
      {
        name: 'Standard Assignment',
        description: 'Standard workflow for sponsor-student assignments',
        steps: [
          {
            step: 1,
            name: 'Profile Validation',
            action: 'validate_student_profile',
            conditions: ['profile_complete', 'documents_verified'],
            required: true,
            status: 'pending'
          },
          {
            step: 2,
            name: 'Match Generation',
            action: 'generate_matches',
            conditions: ['active_sponsors_available'],
            required: true,
            status: 'pending'
          },
          {
            step: 3,
            name: 'Score Calculation',
            action: 'calculate_match_scores',
            conditions: ['matches_generated'],
            required: true,
            status: 'pending'
          },
          {
            step: 4,
            name: 'Conflict Resolution',
            action: 'resolve_conflicts',
            conditions: ['scores_calculated'],
            required: false,
            status: 'pending'
          },
          {
            step: 5,
            name: 'Assignment Creation',
            action: 'create_assignments',
            conditions: ['conflicts_resolved'],
            required: true,
            status: 'pending'
          },
          {
            step: 6,
            name: 'Notification',
            action: 'send_notifications',
            conditions: ['assignments_created'],
            required: false,
            status: 'pending'
          }
        ],
        is_active: true
      },
      {
        name: 'Express Assignment',
        description: 'Fast-track workflow for urgent assignments',
        steps: [
          {
            step: 1,
            name: 'Quick Match',
            action: 'quick_match',
            conditions: ['basic_profile_complete'],
            required: true,
            status: 'pending'
          },
          {
            step: 2,
            name: 'Direct Assignment',
            action: 'direct_assignment',
            conditions: ['match_found'],
            required: true,
            status: 'pending'
          }
        ],
        is_active: true
      }
    ];

    for (const workflow of defaultWorkflows) {
      await this.saveWorkflow(workflow);
    }
  }

  /**
   * Run bulk matching for all eligible students
   */
  async runBulkMatching(): Promise<BulkMatchingJob> {
    try {
      // Create job record
      const job: Omit<BulkMatchingJob, 'id' | 'created_at'> = {
        status: 'pending',
        totalStudents: 0,
        totalSponsors: 0,
        matchesFound: 0,
        assignmentsMade: 0,
        errors: []
      };

      const { data: jobRecord, error: jobError } = await supabase
        .from('bulk_matching_jobs')
        .insert(job)
        .select()
        .single();

      if (jobError) throw jobError;

      // Update job status to running
      await this.updateJobStatus(jobRecord.id, 'running');

      // Get eligible students
      const { data: students, error: studentsError } = await supabase
        .from('users')
        .select('id')
        .eq('user_type', 'student')
        .eq('profile_complete', true)
        .eq('documents_verified', true);

      if (studentsError) throw studentsError;

      // Get active sponsors
      const { data: sponsors, error: sponsorsError } = await supabase
        .from('sponsors')
        .select('id')
        .eq('verified_status', 'verified')
        .eq('is_active', true);

      if (sponsorsError) throw sponsorsError;

      // Update job with counts
      await this.updateJobCounts(jobRecord.id, {
        totalStudents: students?.length || 0,
        totalSponsors: sponsors?.length || 0
      });

      let totalMatches = 0;
      let totalAssignments = 0;
      const errors: string[] = [];

      // Process students in batches
      const studentBatches = this.chunkArray(students || [], this.config.batchSize);

      for (const batch of studentBatches) {
        for (const student of batch) {
          try {
            const matches = await matchingRulesService.findMatches({
              student_id: student.id,
              limit: this.config.maxMatchesPerStudent
            });

            // Filter matches by threshold
            const validMatches = matches.filter(match => match.score >= this.config.minScoreThreshold);
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
            console.error(errorMessage);
          }
        }
      }

      // Update job with results
      await this.updateJobResults(jobRecord.id, {
        matchesFound: totalMatches,
        assignmentsMade: totalAssignments,
        errors
      });

      // Mark job as completed
      await this.updateJobStatus(jobRecord.id, 'completed');

      return {
        ...jobRecord,
        matchesFound: totalMatches,
        assignmentsMade: totalAssignments,
        errors
      };

    } catch (error) {
      console.error('Error in bulk matching:', error);
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
        .single();

      if (existingAssignment) {
        return null; // Assignment already exists
      }

      // Check sponsor capacity
      const { data: currentAllocations } = await supabase
        .from('sponsor_allocations')
        .select('id')
        .eq('sponsor_id', match.sponsor_id)
        .eq('status', 'pending');

      if (currentAllocations && currentAllocations.length >= this.config.maxStudentsPerSponsor) {
        return null; // Sponsor at capacity
      }

      // Create assignment
      const assignment: Omit<SponsorAllocation, 'id' | 'created_at' | 'updated_at'> = {
        sponsor_id: match.sponsor_id,
        student_id: match.student_id,
        amount: match.funding_amount,
        status: 'pending',
        match_score: match.score,
        assignment_date: new Date().toISOString(),
        expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        notes: `Auto-assigned with ${match.score}% match score`
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
      console.error('Error creating assignment:', error);
      return null;
    }
  }

  /**
   * Resolve conflicts in assignments
   */
  async resolveConflicts(): Promise<void> {
    try {
      // Find overlapping assignments
      const { data: conflicts } = await supabase
        .from('sponsor_allocations')
        .select('*')
        .eq('status', 'pending')
        .order('match_score', { ascending: false });

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
          // Accept assignment
          await this.updateAssignmentStatus(assignment.id, 'approved');
          currentAssignments.push(studentId);
          sponsorAssignments.set(sponsorId, currentAssignments);
          resolvedAssignments.add(`${sponsorId}-${studentId}`);
        } else {
          // Reject assignment due to capacity
          await this.updateAssignmentStatus(assignment.id, 'rejected');
        }
      }

    } catch (error) {
      console.error('Error resolving conflicts:', error);
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
        updated_at: new Date().toISOString()
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
          student_name: 'Student', // Will be replaced with actual name
          amount: assignment.amount.toString(),
          sponsor_name: 'Sponsor' // Will be replaced with actual name
        }
      });

      // Send notification to sponsor
      await notificationService.sendNotification({
        userId: assignment.sponsor_id,
        templateId: 'sponsorship-payment-received',
        variables: {
          sponsor_name: 'Sponsor', // Will be replaced with actual name
          amount: assignment.amount.toString(),
          student_name: 'Student' // Will be replaced with actual name
        }
      });

    } catch (error) {
      console.error('Error sending assignment notifications:', error);
    }
  }

  /**
   * Get assignment workflows
   */
  async getWorkflows(): Promise<AssignmentWorkflow[]> {
    try {
      const { data, error } = await supabase
        .from('assignment_workflows')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching workflows:', error);
      throw error;
    }
  }

  /**
   * Save workflow
   */
  async saveWorkflow(workflow: Omit<AssignmentWorkflow, 'id' | 'created_at' | 'updated_at'>): Promise<AssignmentWorkflow> {
    try {
      const workflowData = {
        ...workflow,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('assignment_workflows')
        .upsert(workflowData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving workflow:', error);
      throw error;
    }
  }

  /**
   * Get bulk matching jobs
   */
  async getBulkMatchingJobs(limit: number = 10): Promise<BulkMatchingJob[]> {
    try {
      const { data, error } = await supabase
        .from('bulk_matching_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bulk matching jobs:', error);
      throw error;
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
      console.error('Error fetching sponsor allocations:', error);
      throw error;
    }
  }

  /**
   * Update job status
   */
  private async updateJobStatus(jobId: string, status: string): Promise<void> {
    const updateData: any = { status };
    if (status === 'running') {
      updateData.started_at = new Date().toISOString();
    } else if (status === 'completed' || status === 'failed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('bulk_matching_jobs')
      .update(updateData)
      .eq('id', jobId);

    if (error) throw error;
  }

  /**
   * Update job counts
   */
  private async updateJobCounts(jobId: string, counts: {
    totalStudents: number;
    totalSponsors: number;
  }): Promise<void> {
    const { error } = await supabase
      .from('bulk_matching_jobs')
      .update(counts)
      .eq('id', jobId);

    if (error) throw error;
  }

  /**
   * Update job results
   */
  private async updateJobResults(jobId: string, results: {
    matchesFound: number;
    assignmentsMade: number;
    errors: string[];
  }): Promise<void> {
    const { error } = await supabase
      .from('bulk_matching_jobs')
      .update(results)
      .eq('id', jobId);

    if (error) throw error;
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
  updateConfig(newConfig: Partial<AutoMatchingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get assignment statistics
   */
  async getAssignmentStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    expired: number;
    totalAmount: number;
    averageScore: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('sponsor_allocations')
        .select('status, amount, match_score');

      if (error) throw error;

      const allocations = data || [];
      const total = allocations.length;
      const pending = allocations.filter(a => a.status === 'pending').length;
      const approved = allocations.filter(a => a.status === 'approved').length;
      const rejected = allocations.filter(a => a.status === 'rejected').length;
      const expired = allocations.filter(a => a.status === 'expired').length;
      const totalAmount = allocations.reduce((sum, a) => sum + (a.amount || 0), 0);
      const averageScore = total > 0 
        ? allocations.reduce((sum, a) => sum + (a.match_score || 0), 0) / total 
        : 0;

      return {
        total,
        pending,
        approved,
        rejected,
        expired,
        totalAmount,
        averageScore: Math.round(averageScore)
      };
    } catch (error) {
      console.error('Error getting assignment stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const autoMatchingService = new AutoMatchingService(); 