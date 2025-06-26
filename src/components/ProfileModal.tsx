
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Building, GraduationCap, Save } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hacaProfile, setHacaProfile] = useState<HacaProfile>({
    student_name: '',
    batch: '',
    manager_name: '',
    recipient_email: ''
  });
  const [generalProfile, setGeneralProfile] = useState<GeneralProfile>({
    user_name: '',
    company_name: '',
    designation: '',
    email: user?.email || '',
    phone: '',
    recipient_email: ''
  });

  useEffect(() => {
    if (user && isOpen) {
      fetchProfiles();
    }
  }, [user, isOpen]);

  const fetchProfiles = async () => {
    try {
      // Fetch HACA profile
      const { data: hacaData } = await supabase
        .from('haca_profiles')
        .select('*')
        .eq('user_id', user?.id)
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
        .eq('user_id', user?.id)
        .maybeSingle();

      if (generalData) {
        setGeneralProfile({
          user_name: generalData.user_name || '',
          company_name: generalData.company_name || '',
          designation: generalData.designation || '',
          email: generalData.email || user?.email || '',
          phone: generalData.phone || '',
          recipient_email: generalData.recipient_email || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const saveHacaProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('haca_profiles')
        .upsert({
          user_id: user?.id,
          ...hacaProfile
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "HACA profile saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save HACA profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveGeneralProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('general_profiles')
        .upsert({
          user_id: user?.id,
          ...generalProfile
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "General profile saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save general profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Your Profiles</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="haca" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="haca" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              HACA Profile
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              General Profile
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="haca" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student_name">Student Name</Label>
                <Input
                  id="student_name"
                  value={hacaProfile.student_name}
                  onChange={(e) => setHacaProfile(prev => ({ ...prev, student_name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <Input
                  id="batch"
                  value={hacaProfile.batch}
                  onChange={(e) => setHacaProfile(prev => ({ ...prev, batch: e.target.value }))}
                  placeholder="Enter your batch"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manager_name">Manager/Coordinator Name</Label>
                <Input
                  id="manager_name"
                  value={hacaProfile.manager_name}
                  onChange={(e) => setHacaProfile(prev => ({ ...prev, manager_name: e.target.value }))}
                  placeholder="Enter manager's name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="haca_recipient_email">Recipient Email</Label>
                <Input
                  id="haca_recipient_email"
                  type="email"
                  value={hacaProfile.recipient_email}
                  onChange={(e) => setHacaProfile(prev => ({ ...prev, recipient_email: e.target.value }))}
                  placeholder="manager@haca.edu"
                />
              </div>
            </div>
            
            <Button 
              onClick={saveHacaProfile}
              disabled={loading}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save HACA Profile'}
            </Button>
          </TabsContent>
          
          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user_name">Your Name</Label>
                <Input
                  id="user_name"
                  value={generalProfile.user_name}
                  onChange={(e) => setGeneralProfile(prev => ({ ...prev, user_name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company_name">Company/Institution</Label>
                <Input
                  id="company_name"
                  value={generalProfile.company_name}
                  onChange={(e) => setGeneralProfile(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="Enter company name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation">Role/Designation</Label>
                <Input
                  id="designation"
                  value={generalProfile.designation}
                  onChange={(e) => setGeneralProfile(prev => ({ ...prev, designation: e.target.value }))}
                  placeholder="Enter your job title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={generalProfile.email}
                  onChange={(e) => setGeneralProfile(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@company.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={generalProfile.phone}
                  onChange={(e) => setGeneralProfile(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="general_recipient_email">Recipient Email</Label>
                <Input
                  id="general_recipient_email"
                  type="email"
                  value={generalProfile.recipient_email}
                  onChange={(e) => setGeneralProfile(prev => ({ ...prev, recipient_email: e.target.value }))}
                  placeholder="manager@company.com"
                />
              </div>
            </div>
            
            <Button 
              onClick={saveGeneralProfile}
              disabled={loading}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save General Profile'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
