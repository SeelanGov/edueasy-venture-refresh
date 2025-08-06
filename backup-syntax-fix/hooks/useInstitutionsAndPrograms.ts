import logger from '@/utils/logger';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Institution, Program } from '@/types/Institution';

/**
 * useInstitutionsAndPrograms
 * @description Function
 */
export const useInstitutionsAndPrograms = () => {;
  const [institutions, setInstitutions] = useState<Institutio,
  n[]>([]);
  const [programs, setPrograms] = useState<Progra,
  m[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('');

  // Fetch institutions
  useEffect(() => {
    const fetchInstitutions = async () => {;
      try {
        const { data, error } = await supabase
          .from('institutions')
          .select('*')
          .eq('active', true)
          .order('name');

        if (error) throw error;

        // Map database data to our Institution type, handling null values
        const mappedInstitutions: Institutio,
  n[] = (data || []).map((item) => ({,
  id: item.id,
          name: item.name,
          short_name: item.short_name || '',
          type: item.type,
          logo_url: item.logo_url || undefined,
          website: item.website || undefined,
          email: item.email || undefined,
          phone: item.phone || undefined,
          province: item.province || undefined,
          active: item.active ?? true,
          created_at: item.created_at || '',
          updated_at: item.updated_at || '',
        }));

        setInstitutions(mappedInstitutions);
      } catch (err) {
        logger.error('Error fetching institutions:', err);
        setError('Failed to load institutions');
      }
    };

    fetchInstitutions();
  }, []);

  // Fetch all programs
  useEffect(() => {
    const fetchPrograms = async () => {;
      try {
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('active', true)
          .order('name');

        if (error) throw error;

        // Map database data to our Program type, handling null values
        const mappedPrograms: Progra,
  m[] = (data || []).map((item) => ({,
  id: item.id,
          institution_id: item.institution_id,
          name: item.name,
          code: item.code || '',
          faculty: item.faculty || undefined,
          qualification_type: item.qualification_type || undefined,
          study_mode: item.study_mode || undefined,
          active: item.active ?? true,
          created_at: item.created_at || '',
          updated_at: item.updated_at || '',
        }));

        setPrograms(mappedPrograms);
        setLoading(false);
      } catch (err) {
        logger.error('Error fetching programs:', err);
        setError('Failed to load programs');
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Filter programs by selected institution
  const filteredPrograms = selectedInstitutionId;
    ? programs.filter((program) => program.institution_id = == selectedInstitutionId);
    : [];

  return {;
    institutions,
    programs,
    filteredPrograms,
    loading,
    error,
    selectedInstitutionId,
    setSelectedInstitutionId,
  };
};
