import logger from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';

export interface MatchingRule {
  id: string;
  name: string;
  description: string;
  category: string;
  criteria: unknown; // JSON criteria
  weight: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MatchingResult {
  student_id: string;
  sponsor_id: string;
  score: number;
  funding_amount: number;
  match_criteria: string[];
  confidence_level: 'high' | 'medium' | 'low';
  calculated_at: string;
}

class MatchingRulesService {
  private rules: MatchingRule[] = [];

  /**
   * Initialize matching rules
   */
  async initializeRules(): Promise<void> {
    try {
      // Create default rules
      this.createDefaultRules();
      logger.info(`Loaded ${this.rules.length} matching rules`);
    } catch (error) {
      logger.error('Error initializing matching rules:', error);
      this.rules = [];
    }
  }

  /**
   * Create default matching rules
   */
  private createDefaultRules() {
    this.rules = [
      {
        id: 'academic-level-match',
        name: 'Academic Level Match',
        description: 'Match students with sponsors based on academic level preferences',
        category: 'academic',
        criteria: {
          field: 'academic_level',
          weight: 30,
          exact_match: true,
        },
        weight: 30,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'field-of-study-match',
        name: 'Field of Study Match',
        description: 'Match students with sponsors based on field of study',
        category: 'academic',
        criteria: {
          field: 'field_of_study',
          weight: 25,
          partial_match: true,
        },
        weight: 25,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'location-match',
        name: 'Geographic Location',
        description: 'Prefer sponsors and students in the same geographic area',
        category: 'location',
        criteria: {
          field: 'location',
          weight: 15,
          radius_km: 100,
        },
        weight: 15,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'financial-need',
        name: 'Financial Need Score',
        description: 'Prioritize students with higher financial need',
        category: 'financial',
        criteria: {
          field: 'financial_need_score',
          weight: 20,
          higher_is_better: true,
        },
        weight: 20,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'gpa-threshold',
        name: 'GPA Threshold',
        description: 'Match students meeting minimum GPA requirements',
        category: 'academic',
        criteria: {
          field: 'gpa',
          weight: 10,
          minimum_threshold: 3.0,
        },
        weight: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  /**
   * Find matches for a student
   */
  async findMatches(params: { student_id: string; limit?: number }): Promise<MatchingResult[]> {
    try {
      // Get student profile
      const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', params.student_id)
        .maybeSingle();

      if (!studentProfile) {
        return [];
      }

      // Get available sponsors
      const { data: sponsors } = await supabase
        .from('sponsors')
        .select('id')
        .eq('verified_status', 'verified');

      if (!sponsors || sponsors.length === 0) {
        return [];
      }

      const matches: MatchingResult[] = [];

      // For each sponsor, calculate match score
      for (const sponsor of sponsors) {
        const { data: sponsorProfile } = await supabase
          .from('sponsor_profiles')
          .select('*')
          .eq('sponsor_id', sponsor.id)
          .maybeSingle();

        if (!sponsorProfile) {
          continue;
        }

        const score = this.calculateMatchScore(studentProfile, sponsorProfile);

        if (score > 0) {
          matches.push({
            student_id: params.student_id,
            sponsor_id: sponsor.id,
            score,
            funding_amount: this.calculateFundingAmount(sponsorProfile),
            match_criteria: this.getMatchCriteria(studentProfile, sponsorProfile),
            confidence_level: this.getConfidenceLevel(score),
            calculated_at: new Date().toISOString(),
          });
        }
      }

      // Sort by score and limit results
      matches.sort((a, b) => b.score - a.score);
      return matches.slice(0, params.limit || 10);
    } catch (error) {
      logger.error('Error finding matches:', error);
      return [];
    }
  }

  /**
   * Calculate match score between student and sponsor
   */
  private calculateMatchScore(studentProfile: unknown, sponsorProfile: unknown): number {
    let totalScore = 0;
    let totalWeight = 0;

    for (const rule of this.rules) {
      if (!rule.is_active) continue;

      const ruleScore = this.applyRule(rule, studentProfile, sponsorProfile);
      totalScore += ruleScore * rule.weight;
      totalWeight += rule.weight;
    }

    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) / 100 : 0;
  }

  /**
   * Apply a single matching rule
   */
  private applyRule(rule: MatchingRule, studentProfile: unknown, sponsorProfile: unknown): number {
    try {
      const criteria = rule.criteria;
      const field = criteria.field;

      switch (field) {
        case 'academic_level':
          return this.matchAcademicLevel(studentProfile, sponsorProfile);
        case 'field_of_study':
          return this.matchFieldOfStudy(studentProfile, sponsorProfile);
        case 'location':
          return this.matchLocation(studentProfile, sponsorProfile);
        case 'financial_need_score':
          return this.scoreFinancialNeed(studentProfile);
        case 'gpa':
          return this.scoreGPA(studentProfile, criteria);
        default:
          return 0;
      }
    } catch (error) {
      logger.error(`Error applying rule ${rule.name}:`, error);
      return 0;
    }
  }

  /**
   * Match academic level
   */
  private matchAcademicLevel(studentProfile: unknown, sponsorProfile: unknown): number {
    const studentLevel = studentProfile.academic_level;
    const preferredLevels = sponsorProfile.preferred_academic_levels || [];

    return preferredLevels.includes(studentLevel) ? 1 : 0;
  }

  /**
   * Match field of study
   */
  private matchFieldOfStudy(studentProfile: unknown, sponsorProfile: unknown): number {
    const studentField = studentProfile.field_of_study;
    const preferredFields = sponsorProfile.preferred_fields || [];

    return preferredFields.includes(studentField) ? 1 : 0.5;
  }

  /**
   * Match location
   */
  private matchLocation(studentProfile: unknown, sponsorProfile: unknown): number {
    const studentLocation = studentProfile.location;
    const sponsorLocation = sponsorProfile.location;

    return studentLocation === sponsorLocation ? 1 : 0.3;
  }

  /**
   * Score financial need
   */
  private scoreFinancialNeed(studentProfile: unknown): number {
    const needScore = studentProfile.financial_need_score || 0;
    return Math.min(needScore / 100, 1);
  }

  /**
   * Score GPA
   */
  private scoreGPA(studentProfile: unknown, criteria: unknown): number {
    const gpa = studentProfile.gpa || 0;
    const threshold = criteria.minimum_threshold || 3.0;

    return gpa >= threshold ? Math.min(gpa / 4.0, 1) : 0;
  }

  /**
   * Calculate funding amount
   */
  private calculateFundingAmount(sponsorProfile: unknown): number {
    const range = sponsorProfile.funding_amount_range || { min: 1000, max: 5000 };
    return (range.min + range.max) / 2;
  }

  /**
   * Get match criteria
   */
  private getMatchCriteria(studentProfile: unknown, sponsorProfile: unknown): string[] {
    const criteria: string[] = [];

    if (sponsorProfile.preferred_academic_levels?.includes(studentProfile.academic_level)) {
      criteria.push('Academic Level Match');
    }

    if (sponsorProfile.preferred_fields?.includes(studentProfile.field_of_study)) {
      criteria.push('Field of Study Match');
    }

    if (studentProfile.location === sponsorProfile.location) {
      criteria.push('Location Match');
    }

    return criteria;
  }

  /**
   * Get confidence level
   */
  private getConfidenceLevel(score: number): 'high' | 'medium' | 'low' {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  }

  /**
   * Save matching results
   */
  async saveMatchingResults(results: MatchingResult[]): Promise<void> {
    try {
      if (results.length === 0) return;

      // Save to sponsor_matching_results table
      const matchingData = results.map((result) => ({
        sponsor_id: result.sponsor_id,
        student_id: result.student_id,
        match_score: result.score,
        status: 'pending',
      }));

      const { error } = await supabase.from('sponsor_matching_results').upsert(matchingData);

      if (error) {
        logger.error('Error saving matching results:', error);
      }
    } catch (error) {
      logger.error('Error saving matching results:', error);
    }
  }

  /**
   * Get matching rules
   */
  async getMatchingRules(): Promise<MatchingRule[]> {
    return this.rules;
  }
}

// Export singleton instance

/**
 * matchingRulesService
 * @description Function
 */
export const matchingRulesService = new MatchingRulesService();
