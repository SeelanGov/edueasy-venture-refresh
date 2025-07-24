import { supabase } from '@/integrations/supabase/client';

export interface MatchingRule {
  id: string;
  name: string;
  description: string;
  category: 'academic' | 'financial' | 'demographic' | 'preference' | 'custom';
  criteria: MatchingCriteria[];
  weight: number; // 0-100, determines importance in scoring
  is_active: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

export interface MatchingCriteria {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in' | 'between';
  value: any;
  value2?: any; // For 'between' operator
  weight: number; // 0-100, relative weight within the rule
}

export interface StudentProfile {
  id: string;
  user_id: string;
  academic_level: string;
  field_of_study: string;
  institution: string;
  gpa?: number;
  financial_need: 'low' | 'medium' | 'high' | 'critical';
  household_income?: number;
  location: string;
  ethnicity?: string;
  gender?: string;
  disability_status?: boolean;
  first_generation?: boolean;
  rural_background?: boolean;
  academic_achievements?: string[];
  extracurricular_activities?: string[];
  community_service?: boolean;
  leadership_experience?: boolean;
  created_at: string;
}

export interface SponsorProfile {
  id: string;
  sponsor_id: string;
  organization_type: 'individual' | 'company' | 'ngo' | 'government' | 'foundation';
  industry?: string;
  location: string;
  funding_capacity: 'low' | 'medium' | 'high' | 'unlimited';
  preferred_academic_levels: string[];
  preferred_fields: string[];
  preferred_locations: string[];
  preferred_demographics?: {
    ethnicity?: string[];
    gender?: string[];
    first_generation?: boolean;
    rural_background?: boolean;
    disability_status?: boolean;
  };
  minimum_gpa?: number;
  maximum_household_income?: number;
  funding_amount_range: {
    min: number;
    max: number;
  };
  funding_frequency: 'one_time' | 'monthly' | 'quarterly' | 'annually';
  application_deadline?: string;
  special_criteria?: string[];
  created_at: string;
}

export interface MatchingResult {
  student_id: string;
  sponsor_id: string;
  score: number; // 0-100
  matched_criteria: string[];
  unmatched_criteria: string[];
  funding_amount: number;
  confidence_level: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface MatchingRequest {
  student_id?: string;
  sponsor_id?: string;
  academic_level?: string;
  field_of_study?: string;
  location?: string;
  financial_need?: string;
  funding_amount?: number;
  limit?: number;
}

class MatchingRulesService {
  private defaultRules: MatchingRule[] = [
    // Academic Rules
    {
      id: 'academic-level-match',
      name: 'Academic Level Match',
      description: 'Match students with sponsors who prefer their academic level',
      category: 'academic',
      weight: 25,
      is_active: true,
      priority: 'high',
      criteria: [
        {
          field: 'academic_level',
          operator: 'equals',
          value: '{{student.academic_level}}',
          weight: 100
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'field-of-study-match',
      name: 'Field of Study Match',
      description: 'Match students with sponsors who prefer their field of study',
      category: 'academic',
      weight: 20,
      is_active: true,
      priority: 'high',
      criteria: [
        {
          field: 'preferred_fields',
          operator: 'contains',
          value: '{{student.field_of_study}}',
          weight: 100
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'gpa-requirement',
      name: 'GPA Requirement',
      description: 'Match students who meet sponsor GPA requirements',
      category: 'academic',
      weight: 15,
      is_active: true,
      priority: 'medium',
      criteria: [
        {
          field: 'gpa',
          operator: 'greater_than',
          value: '{{sponsor.minimum_gpa}}',
          weight: 100
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },

    // Financial Rules
    {
      id: 'financial-need-match',
      name: 'Financial Need Match',
      description: 'Match students with appropriate financial need levels',
      category: 'financial',
      weight: 20,
      is_active: true,
      priority: 'high',
      criteria: [
        {
          field: 'financial_need',
          operator: 'in',
          value: ['high', 'critical'],
          weight: 100
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'household-income-limit',
      name: 'Household Income Limit',
      description: 'Match students within sponsor income limits',
      category: 'financial',
      weight: 15,
      is_active: true,
      priority: 'medium',
      criteria: [
        {
          field: 'household_income',
          operator: 'less_than',
          value: '{{sponsor.maximum_household_income}}',
          weight: 100
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'funding-amount-match',
      name: 'Funding Amount Match',
      description: 'Match students with appropriate funding amounts',
      category: 'financial',
      weight: 15,
      is_active: true,
      priority: 'medium',
      criteria: [
        {
          field: 'funding_amount_range',
          operator: 'between',
          value: '{{sponsor.funding_amount_range.min}}',
          value2: '{{sponsor.funding_amount_range.max}}',
          weight: 100
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },

    // Demographic Rules
    {
      id: 'location-match',
      name: 'Location Match',
      description: 'Match students with sponsors who prefer their location',
      category: 'demographic',
      weight: 10,
      is_active: true,
      priority: 'medium',
      criteria: [
        {
          field: 'preferred_locations',
          operator: 'contains',
          value: '{{student.location}}',
          weight: 100
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'first-generation-preference',
      name: 'First Generation Preference',
      description: 'Match first-generation students with sponsors who prefer them',
      category: 'demographic',
      weight: 8,
      is_active: true,
      priority: 'low',
      criteria: [
        {
          field: 'first_generation',
          operator: 'equals',
          value: true,
          weight: 100
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'rural-background-preference',
      name: 'Rural Background Preference',
      description: 'Match rural background students with sponsors who prefer them',
      category: 'demographic',
      weight: 7,
      is_active: true,
      priority: 'low',
      criteria: [
        {
          field: 'rural_background',
          operator: 'equals',
          value: true,
          weight: 100
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  /**
   * Initialize matching rules in database
   */
  async initializeRules(): Promise<void> {
    try {
      // Check if rules already exist
      const { data: existingRules } = await supabase
        .from('sponsor_matching_rules')
        .select('id')
        .limit(1);

      if (existingRules && existingRules.length > 0) {
        console.log('Matching rules already initialized');
        return;
      }

      // Insert default rules
      const { error } = await supabase
        .from('sponsor_matching_rules')
        .insert(this.defaultRules);

      if (error) {
        throw error;
      }

      console.log('Matching rules initialized successfully');
    } catch (error) {
      console.error('Error initializing matching rules:', error);
      throw error;
    }
  }

  /**
   * Get all matching rules
   */
  async getMatchingRules(): Promise<MatchingRule[]> {
    try {
      const { data, error } = await supabase
        .from('sponsor_matching_rules')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching matching rules:', error);
      throw error;
    }
  }

  /**
   * Create or update a matching rule
   */
  async saveMatchingRule(rule: Omit<MatchingRule, 'id' | 'created_at' | 'updated_at'>): Promise<MatchingRule> {
    try {
      const ruleData = {
        ...rule,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('sponsor_matching_rules')
        .upsert(ruleData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving matching rule:', error);
      throw error;
    }
  }

  /**
   * Delete a matching rule
   */
  async deleteMatchingRule(ruleId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('sponsor_matching_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting matching rule:', error);
      throw error;
    }
  }

  /**
   * Find matches for a student or sponsor
   */
  async findMatches(request: MatchingRequest): Promise<MatchingResult[]> {
    try {
      const rules = await this.getMatchingRules();
      const activeRules = rules.filter(rule => rule.is_active);

      if (request.student_id) {
        return await this.findMatchesForStudent(request.student_id, activeRules, request.limit);
      } else if (request.sponsor_id) {
        return await this.findMatchesForSponsor(request.sponsor_id, activeRules, request.limit);
      } else {
        // Generic matching based on criteria
        return await this.findMatchesByCriteria(request, activeRules, request.limit);
      }
    } catch (error) {
      console.error('Error finding matches:', error);
      throw error;
    }
  }

  /**
   * Find matches for a specific student
   */
  private async findMatchesForStudent(
    studentId: string, 
    rules: MatchingRule[], 
    limit: number = 10
  ): Promise<MatchingResult[]> {
    try {
      // Get student profile
      const { data: studentProfile, error: studentError } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', studentId)
        .single();

      if (studentError || !studentProfile) {
        throw new Error('Student profile not found');
      }

      // Get all active sponsors
      const { data: sponsors, error: sponsorsError } = await supabase
        .from('sponsor_profiles')
        .select('*')
        .eq('is_active', true);

      if (sponsorsError) throw sponsorsError;

      const matches: MatchingResult[] = [];

      for (const sponsor of sponsors || []) {
        const matchResult = this.evaluateMatch(studentProfile, sponsor, rules);
        if (matchResult.score > 0) {
          matches.push(matchResult);
        }
      }

      // Sort by score and return top matches
      return matches
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    } catch (error) {
      console.error('Error finding matches for student:', error);
      throw error;
    }
  }

  /**
   * Find matches for a specific sponsor
   */
  private async findMatchesForSponsor(
    sponsorId: string, 
    rules: MatchingRule[], 
    limit: number = 10
  ): Promise<MatchingResult[]> {
    try {
      // Get sponsor profile
      const { data: sponsorProfile, error: sponsorError } = await supabase
        .from('sponsor_profiles')
        .select('*')
        .eq('sponsor_id', sponsorId)
        .single();

      if (sponsorError || !sponsorProfile) {
        throw new Error('Sponsor profile not found');
      }

      // Get all students with sponsorship applications
      const { data: students, error: studentsError } = await supabase
        .from('student_profiles')
        .select('*')
        .in('user_id', 
          supabase
            .from('sponsor_applications')
            .select('student_id')
            .eq('status', 'pending')
        );

      if (studentsError) throw studentsError;

      const matches: MatchingResult[] = [];

      for (const student of students || []) {
        const matchResult = this.evaluateMatch(student, sponsorProfile, rules);
        if (matchResult.score > 0) {
          matches.push(matchResult);
        }
      }

      // Sort by score and return top matches
      return matches
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    } catch (error) {
      console.error('Error finding matches for sponsor:', error);
      throw error;
    }
  }

  /**
   * Find matches based on generic criteria
   */
  private async findMatchesByCriteria(
    request: MatchingRequest, 
    rules: MatchingRule[], 
    limit: number = 10
  ): Promise<MatchingResult[]> {
    try {
      // Build query based on criteria
      let studentQuery = supabase
        .from('student_profiles')
        .select('*');

      if (request.academic_level) {
        studentQuery = studentQuery.eq('academic_level', request.academic_level);
      }
      if (request.field_of_study) {
        studentQuery = studentQuery.eq('field_of_study', request.field_of_study);
      }
      if (request.location) {
        studentQuery = studentQuery.eq('location', request.location);
      }
      if (request.financial_need) {
        studentQuery = studentQuery.eq('financial_need', request.financial_need);
      }

      const { data: students, error: studentsError } = await studentQuery;
      if (studentsError) throw studentsError;

      // Get all active sponsors
      const { data: sponsors, error: sponsorsError } = await supabase
        .from('sponsor_profiles')
        .select('*')
        .eq('is_active', true);

      if (sponsorsError) throw sponsorsError;

      const matches: MatchingResult[] = [];

      for (const student of students || []) {
        for (const sponsor of sponsors || []) {
          const matchResult = this.evaluateMatch(student, sponsor, rules);
          if (matchResult.score > 0) {
            matches.push(matchResult);
          }
        }
      }

      // Sort by score and return top matches
      return matches
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    } catch (error) {
      console.error('Error finding matches by criteria:', error);
      throw error;
    }
  }

  /**
   * Evaluate match between student and sponsor using rules
   */
  private evaluateMatch(
    student: StudentProfile, 
    sponsor: SponsorProfile, 
    rules: MatchingRule[]
  ): MatchingResult {
    let totalScore = 0;
    let totalWeight = 0;
    const matchedCriteria: string[] = [];
    const unmatchedCriteria: string[] = [];

    for (const rule of rules) {
      const ruleScore = this.evaluateRule(student, sponsor, rule);
      const weightedScore = (ruleScore * rule.weight) / 100;
      
      totalScore += weightedScore;
      totalWeight += rule.weight;

      if (ruleScore > 0) {
        matchedCriteria.push(rule.name);
      } else {
        unmatchedCriteria.push(rule.name);
      }
    }

    const finalScore = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;

    // Determine confidence level
    let confidenceLevel: 'low' | 'medium' | 'high' = 'low';
    if (finalScore >= 80) confidenceLevel = 'high';
    else if (finalScore >= 50) confidenceLevel = 'medium';

    // Calculate funding amount
    const fundingAmount = this.calculateFundingAmount(student, sponsor, finalScore);

    return {
      student_id: student.user_id,
      sponsor_id: sponsor.sponsor_id,
      score: Math.round(finalScore),
      matched_criteria: matchedCriteria,
      unmatched_criteria: unmatchedCriteria,
      funding_amount: fundingAmount,
      confidence_level: confidenceLevel,
      created_at: new Date().toISOString()
    };
  }

  /**
   * Evaluate a single rule
   */
  private evaluateRule(
    student: StudentProfile, 
    sponsor: SponsorProfile, 
    rule: MatchingRule
  ): number {
    let ruleScore = 0;
    let totalCriteriaWeight = 0;

    for (const criteria of rule.criteria) {
      const criteriaScore = this.evaluateCriteria(student, sponsor, criteria);
      const weightedScore = (criteriaScore * criteria.weight) / 100;
      
      ruleScore += weightedScore;
      totalCriteriaWeight += criteria.weight;
    }

    return totalCriteriaWeight > 0 ? (ruleScore / totalCriteriaWeight) * 100 : 0;
  }

  /**
   * Evaluate a single criteria
   */
  private evaluateCriteria(
    student: StudentProfile, 
    sponsor: SponsorProfile, 
    criteria: MatchingCriteria
  ): number {
    const studentValue = this.getStudentValue(student, criteria.field);
    const sponsorValue = this.getSponsorValue(sponsor, criteria.field);

    switch (criteria.operator) {
      case 'equals':
        return studentValue === criteria.value ? 100 : 0;
      
      case 'not_equals':
        return studentValue !== criteria.value ? 100 : 0;
      
      case 'greater_than':
        return studentValue > criteria.value ? 100 : 0;
      
      case 'less_than':
        return studentValue < criteria.value ? 100 : 0;
      
      case 'contains':
        if (Array.isArray(sponsorValue)) {
          return sponsorValue.includes(studentValue) ? 100 : 0;
        }
        return String(sponsorValue).includes(String(studentValue)) ? 100 : 0;
      
      case 'in':
        if (Array.isArray(criteria.value)) {
          return criteria.value.includes(studentValue) ? 100 : 0;
        }
        return 0;
      
      case 'not_in':
        if (Array.isArray(criteria.value)) {
          return !criteria.value.includes(studentValue) ? 100 : 0;
        }
        return 100;
      
      case 'between':
        return studentValue >= criteria.value && studentValue <= (criteria.value2 || criteria.value) ? 100 : 0;
      
      default:
        return 0;
    }
  }

  /**
   * Get student value for a field
   */
  private getStudentValue(student: StudentProfile, field: string): any {
    return (student as any)[field];
  }

  /**
   * Get sponsor value for a field
   */
  private getSponsorValue(sponsor: SponsorProfile, field: string): any {
    return (sponsor as any)[field];
  }

  /**
   * Calculate funding amount based on match score and sponsor capacity
   */
  private calculateFundingAmount(
    student: StudentProfile, 
    sponsor: SponsorProfile, 
    matchScore: number
  ): number {
    const baseAmount = sponsor.funding_amount_range.min;
    const maxAmount = sponsor.funding_amount_range.max;
    
    // Adjust amount based on match score
    const scoreMultiplier = matchScore / 100;
    const adjustedAmount = baseAmount + (maxAmount - baseAmount) * scoreMultiplier;
    
    // Consider financial need
    const needMultiplier = this.getFinancialNeedMultiplier(student.financial_need);
    
    return Math.round(adjustedAmount * needMultiplier);
  }

  /**
   * Get multiplier based on financial need
   */
  private getFinancialNeedMultiplier(financialNeed: string): number {
    switch (financialNeed) {
      case 'critical':
        return 1.2;
      case 'high':
        return 1.1;
      case 'medium':
        return 1.0;
      case 'low':
        return 0.9;
      default:
        return 1.0;
    }
  }

  /**
   * Save matching results to database
   */
  async saveMatchingResults(results: MatchingResult[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('sponsor_matching_results')
        .insert(results);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving matching results:', error);
      throw error;
    }
  }

  /**
   * Get matching statistics
   */
  async getMatchingStats(): Promise<{
    totalMatches: number;
    averageScore: number;
    highConfidenceMatches: number;
    mediumConfidenceMatches: number;
    lowConfidenceMatches: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('sponsor_matching_results')
        .select('score, confidence_level');

      if (error) throw error;

      const results = data || [];
      const totalMatches = results.length;
      const averageScore = totalMatches > 0 
        ? results.reduce((sum, r) => sum + r.score, 0) / totalMatches 
        : 0;

      const highConfidenceMatches = results.filter(r => r.confidence_level === 'high').length;
      const mediumConfidenceMatches = results.filter(r => r.confidence_level === 'medium').length;
      const lowConfidenceMatches = results.filter(r => r.confidence_level === 'low').length;

      return {
        totalMatches,
        averageScore: Math.round(averageScore),
        highConfidenceMatches,
        mediumConfidenceMatches,
        lowConfidenceMatches
      };
    } catch (error) {
      console.error('Error getting matching stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const matchingRulesService = new MatchingRulesService(); 