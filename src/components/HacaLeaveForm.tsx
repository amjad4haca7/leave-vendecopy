
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfiles } from '@/hooks/useUserProfiles';
import { ProfileModal } from './ProfileModal';
import { ProfileStatusBanner } from './haca/ProfileStatusBanner';
import { FormProgressBar } from './haca/FormProgressBar';
import { StudentDetailsSection } from './haca/StudentDetailsSection';
import { LeaveReasonSection } from './haca/LeaveReasonSection';
import { GenerateButton } from './haca/GenerateButton';

interface HacaLeaveFormProps {
  onLetterGenerated: (letter: string, recipientEmail?: string) => void;
}

export const HacaLeaveForm = ({ onLetterGenerated }: HacaLeaveFormProps) => {
  const { user } = useAuth();
  const { hacaProfile, refetchProfiles } = useUserProfiles();
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const [formData, setFormData] = useState({
    studentName: '',
    batch: '',
    managerName: '',
    recipientEmail: '',
    leaveDate: '',
    reason: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-fill form when profile is loaded
  useEffect(() => {
    if (hacaProfile && user) {
      setFormData(prev => ({
        ...prev,
        studentName: hacaProfile.student_name || prev.studentName,
        batch: hacaProfile.batch || prev.batch,
        managerName: hacaProfile.manager_name || prev.managerName,
        recipientEmail: hacaProfile.recipient_email || prev.recipientEmail
      }));
    }
  }, [hacaProfile, user]);

  const handleFormDataChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['studentName', 'batch', 'managerName', 'leaveDate', 'reason'];
    
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast({ title: "Error", description: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, variant: "destructive" });
        return false;
      }
    }

    return true;
  };

  const generateHacaLetter = () => {
    const formattedDate = new Date(formData.leaveDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `Subject: Leave Request for ${formData.reason} on ${formattedDate}

Dear ${formData.managerName},

I hope this message finds you well. I would like to request leave on ${formattedDate} due to ${formData.reason}.

I will ensure that all my responsibilities are managed and, if needed, I'm happy to assist in planning or handing over any urgent tasks beforehand.

Thank you for your understanding and support.

Best regards,
${formData.studentName}
${formData.batch}`;
  };

  const generateLetter = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 20, 90));
    }, 150);

    await new Promise(resolve => setTimeout(resolve, 1200));
    
    clearInterval(progressInterval);
    setProgress(100);

    const letter = generateHacaLetter();
    onLetterGenerated(letter, formData.recipientEmail);
    setIsGenerating(false);
    toast({ title: "Success!", description: "HACA leave application generated!" });
  };

  const calculateProgress = () => {
    const fields = ['studentName', 'batch', 'managerName', 'leaveDate', 'reason'];
    const filledFields = fields.filter(field => formData[field as keyof typeof formData]);
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const handleProfileModalClose = () => {
    setShowProfileModal(false);
    refetchProfiles();
  };

  return (
    <div className="max-w-3xl mx-auto">
      {user && (
        <ProfileStatusBanner 
          hasProfile={!!hacaProfile}
          onManageProfile={() => setShowProfileModal(true)}
        />
      )}

      <FormProgressBar progress={calculateProgress()} />

      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-emerald-50">
        <StudentDetailsSection 
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />

        <LeaveReasonSection 
          reason={formData.reason}
          onReasonChange={(reason) => handleFormDataChange('reason', reason)}
        />

        <GenerateButton 
          isGenerating={isGenerating}
          progress={progress}
          onGenerate={generateLetter}
        />
      </div>

      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={handleProfileModalClose} 
      />
    </div>
  );
};
