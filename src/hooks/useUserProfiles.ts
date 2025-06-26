
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface HacaProfile {
  student_name: string;
  batch: string;
  manager_name: string;
  recipient_email: string;
}

interface GeneralProfile {
  user_name: string;
  company_name: string;
  designation: string;
  email: string;
  phone: string;
  recipient_email: string;
}

export const useUserProfiles = () => {
  const { user } = useAuth();
  const [hacaProfile, setHacaProfile] = useState<HacaProfile | null>(null);
  const [generalProfile, setGeneralProfile] = useState<GeneralProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfiles = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch HACA profile
      const { data: hacaData } = await supabase
        .from('haca_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (hacaData) {
        setHacaProfile({
          student_name: hacaData.student_name || '',
          batch: hacaData.batch || '',
          manager_name: hacaData.manager_name || '',
          recipient_email: hacaData.recipient_email || ''
        });
      }

      // Fetch General profile
      const { data: generalData } = await supabase
        .from('general_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (generalData) {
        setGeneralProfile({
          user_name: generalData.user_name || '',
          company_name: generalData.company_name || '',
          designation: generalData.designation || '',
          email: generalData.email || user.email || '',
          phone: generalData.phone || '',
          recipient_email: generalData.recipient_email || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  return {
    hacaProfile,
    generalProfile,
    loading,
    refetchProfiles: fetchProfiles
  };
};
