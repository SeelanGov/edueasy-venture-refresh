
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface Institution {
  id: string;
  name: string;
  short_name: string;
  province: string;
  type: string;
}

export interface Program {
  id: string;
  name: string;
  code: string;
  qualification_type: string;
  study_mode: string;
  faculty: string;
  institution_id: string;
}

export const useInstitutionsAndPrograms = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  // Fetch all institutions
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setError(false);
        setLoading(true);
        
        const { data, error } = await supabase
          .from("institutions")
          .select("*")
          .eq("active", true)
          .order("name");

        if (error) throw error;
        setInstitutions(data || []);
      } catch (error: unknown) {
        console.error("Error fetching institutions:", error);
        setError(true);
        toast({
          title: "Error",
          description: "Failed to load institutions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, [toast]);

  // Fetch all programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        if (!selectedInstitutionId) {
          // Fetch all programs initially to have them ready
          const { data, error } = await supabase
            .from("programs")
            .select("*")
            .eq("active", true);

          if (error) throw error;
          setPrograms(data || []);
        } else {
          // Fetch only programs for the selected institution for better performance
          setLoading(true);
          const { data, error } = await supabase
            .from("programs")
            .select("*")
            .eq("active", true)
            .eq("institution_id", selectedInstitutionId);

          if (error) throw error;
          setFilteredPrograms(data || []);
        }
      } catch (error: unknown) {
        console.error("Error fetching programs:", error);
        setError(true);
        toast({
          title: "Error",
          description: "Failed to load programs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [selectedInstitutionId, toast]);

  // Filter programs based on selected institution
  useEffect(() => {
    if (selectedInstitutionId) {
      setFilteredPrograms(
        programs.filter(program => program.institution_id === selectedInstitutionId)
      );
    } else {
      setFilteredPrograms([]);
    }
  }, [selectedInstitutionId, programs]);

  return {
    institutions,
    programs,
    loading,
    error,
    selectedInstitutionId,
    setSelectedInstitutionId,
    filteredPrograms
  };
};
