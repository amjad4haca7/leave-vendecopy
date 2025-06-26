import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Calendar, FileText, Sparkles, Mail, Settings, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfiles } from '@/hooks/useUserProfiles';
import { ProfileModal } from './ProfileModal';

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

  const reasonSuggestions = [
    "personal reason",
    "health issue",
    "family matter",
    "medical appointment",
    "emergency"
  ];

  const handleReasonSuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, reason: suggestion }));
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
    refetchProfiles(); // Refresh profiles when modal closes
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile Status Banner */}
      {user && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hacaProfile ? (
                <>
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-emerald-800 font-medium">Profile loaded! Form auto-filled with your saved details.</p>
                    <p className="text-emerald-600 text-sm">You can edit any field below or update your profile settings.</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                  <div>
                    <p className="text-amber-800 font-medium">No HACA profile found</p>
                    <p className="text-amber-600 text-sm">Set up your profile to auto-fill forms in the future.</p>
                  </div>
                </>
              )}
            </div>
            <Button
              onClick={() => setShowProfileModal(true)}
              variant="outline"
              size="sm"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Profile
            </Button>
          </div>
        </div>
      )}

      {/* 3D Progress Bar */}
      <div className="mb-8 relative">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-green-100">
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span className="font-medium">Form Progress</span>
            <span className="font-bold text-emerald-600">{calculateProgress()}%</span>
          </div>
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              style={{ width: `${calculateProgress()}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-white/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-emerald-50">
        
        {/* Student Information */}
        <div className="space-y-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            Student Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Student Name</Label>
              <Input
                value={formData.studentName}
                onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                className="bg-white border-2 border-emerald-100 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl shadow-sm"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Batch</Label>
              <Input
                value={formData.batch}
                onChange={(e) => setFormData(prev => ({ ...prev, batch: e.target.value }))}
                className="bg-white border-2 border-emerald-100 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl shadow-sm"
                placeholder="Enter your batch"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Manager/Coordinator Name</Label>
              <Input
                value={formData.managerName}
                onChange={(e) => setFormData(prev => ({ ...prev, managerName: e.target.value }))}
                className="bg-white border-2 border-emerald-100 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl shadow-sm"
                placeholder="Enter manager's name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500" />
                Recipient Email (Optional)
              </Label>
              <Input
                type="email"
                value={formData.recipientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                className="bg-white border-2 border-emerald-100 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl shadow-sm"
                placeholder="manager@haca.edu"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-gray-700 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Leave Date
              </Label>
              <Input
                type="date"
                value={formData.leaveDate}
                onChange={(e) => setFormData(prev => ({ ...prev, leaveDate: e.target.value }))}
                className="bg-white border-2 border-emerald-100 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl shadow-sm"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        {/* Reason Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Reason for Leave
          </h3>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Brief Reason</Label>
            <Textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              className="bg-white border-2 border-emerald-100 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl shadow-sm min-h-[80px]"
              placeholder="Brief reason for leave"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Quick Suggestions</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {reasonSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleReasonSuggestion(suggestion)}
                  className="text-left justify-start h-auto p-3 bg-emerald-50 border-emerald-200 text-gray-700 hover:bg-emerald-100 hover:border-emerald-300 rounded-xl"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-8 text-center">
          {isGenerating && (
            <div className="mb-4">
              <div className="text-emerald-600 mb-2 font-medium">Generating HACA leave application... {progress}%</div>
              <div className="bg-gray-100 rounded-full h-3 max-w-md mx-auto shadow-inner">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <Button
            onClick={generateLetter}
            disabled={isGenerating}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 text-lg rounded-2xl shadow-[0_8px_32px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate HACA Letter'}
          </Button>
        </div>
      </div>

      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={handleProfileModalClose} 
      />
    </div>
  );
};
