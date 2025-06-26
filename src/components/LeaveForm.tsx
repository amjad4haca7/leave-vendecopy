import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Building, Mail, Phone, FileText, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUserProfiles } from '@/hooks/useUserProfiles';

interface LeaveFormProps {
  onLetterGenerated: (letter: string, recipientEmail?: string) => void;
}

export const LeaveForm = ({ onLetterGenerated }: LeaveFormProps) => {
  const { generalProfile } = useUserProfiles();
  const [formData, setFormData] = useState({
    companyName: '',
    userName: '',
    designation: '',
    email: '',
    phone: '',
    recipientEmail: '',
    isSingleDay: false,
    leaveDate: '',
    startDate: '',
    endDate: '',
    reason: '',
    template: 'formal',
    recipient: 'hr'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-fill form when generalProfile is loaded
  useEffect(() => {
    if (generalProfile) {
      setFormData(prev => ({
        ...prev,
        companyName: generalProfile.company_name || '',
        userName: generalProfile.user_name || '',
        designation: generalProfile.designation || '',
        email: generalProfile.email || '',
        phone: generalProfile.phone || '',
        recipientEmail: generalProfile.recipient_email || ''
      }));
    }
  }, [generalProfile]);

  const reasonSuggestions = [
    "Personal medical appointment",
    "Family emergency",
    "Mild fever and rest",
    "Personal matters",
    "Medical consultation",
    "Family celebration"
  ];

  const handleReasonSuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, reason: suggestion }));
  };

  const validateForm = () => {
    const required = ['companyName', 'userName', 'designation', 'email', 'reason'];
    
    if (formData.isSingleDay && !formData.leaveDate) {
      toast({ title: "Error", description: "Please select a leave date", variant: "destructive" });
      return false;
    }
    
    if (!formData.isSingleDay && (!formData.startDate || !formData.endDate)) {
      toast({ title: "Error", description: "Please select start and end dates", variant: "destructive" });
      return false;
    }

    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast({ title: "Error", description: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, variant: "destructive" });
        return false;
      }
    }

    return true;
  };

  const generateDynamicLetter = () => {
    const templates = {
      formal: {
        greeting: "Dear Sir/Madam,",
        intro: "I am writing to formally request a leave of absence",
        closing: "I would be grateful if you could approve my leave application at your earliest convenience.",
        signature: "Yours sincerely,"
      },
      'semi-formal': {
        greeting: "Dear Team,",
        intro: "I would like to request a leave",
        closing: "I hope for your understanding and approval of this request.",
        signature: "Best regards,"
      }
    };

    const currentTemplate = templates[formData.template as keyof typeof templates];
    
    const dateText = formData.isSingleDay 
      ? `on ${new Date(formData.leaveDate).toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`
      : `from ${new Date(formData.startDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })} to ${new Date(formData.endDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`;

    const dayCount = formData.isSingleDay 
      ? 1 
      : Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 3600 * 24)) + 1;

    const recipientTitle = formData.recipient === 'hr' ? 'Human Resources Department' : 'Manager';
    
    const reasonExpansions = {
      'Personal medical appointment': 'a scheduled medical appointment that requires my immediate attention',
      'Family emergency': 'an urgent family emergency that requires my immediate presence and support',
      'Mild fever and rest': 'mild fever symptoms and need adequate rest for a quick recovery',
      'Personal matters': 'important personal matters that require my urgent attention',
      'Medical consultation': 'a medical consultation with a specialist physician',
      'Family celebration': 'an important family celebration and cultural obligations'
    };

    const expandedReason = reasonExpansions[formData.reason as keyof typeof reasonExpansions] || formData.reason.toLowerCase();

    return `Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

To: ${recipientTitle}
${formData.companyName}

Subject: Application for Leave of Absence - ${formData.userName}

${currentTemplate.greeting}

${currentTemplate.intro} ${dateText}. I am currently employed as ${formData.designation} in your esteemed organization.

The reason for my ${dayCount === 1 ? 'single-day' : `${dayCount}-day`} leave application is ${expandedReason}. I understand my responsibilities and have ensured that all urgent matters will be addressed before my departure.

${dayCount > 1 ? `During my ${dayCount}-day absence, I will ensure a smooth handover of my current projects and responsibilities.` : 'I will ensure all pending work is completed upon my return.'}

${currentTemplate.closing} Please feel free to contact me at ${formData.email} or ${formData.phone} if you need any additional information.

Thank you for your consideration and understanding.

${currentTemplate.signature}

${formData.userName}
${formData.designation}
Email: ${formData.email}
Phone: ${formData.phone}`;
  };

  const generateLetter = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 15, 90));
    }, 150);

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    clearInterval(progressInterval);
    setProgress(100);

    const letter = generateDynamicLetter();
    onLetterGenerated(letter, formData.recipientEmail);
    setIsGenerating(false);
    toast({ title: "Success!", description: "Dynamic leave application generated!" });
  };

  const calculateProgress = () => {
    const fields = ['companyName', 'userName', 'designation', 'email', 'reason'];
    const dateFields = formData.isSingleDay ? ['leaveDate'] : ['startDate', 'endDate'];
    const allFields = [...fields, ...dateFields];
    
    const filledFields = allFields.filter(field => formData[field as keyof typeof formData]);
    return Math.round((filledFields.length / allFields.length) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 3D Progress Bar */}
      <div className="mb-8 relative">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-green-100">
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span className="font-medium">Form Progress</span>
            <span className="font-bold text-green-600">{calculateProgress()}%</span>
          </div>
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
              style={{ width: `${calculateProgress()}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-white/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-green-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Company Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building className="w-5 h-5 text-white" />
              </div>
              Organization Details
            </h3>
            
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Company/Institution Name</Label>
              <Input
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="bg-white border-2 border-green-100 focus:border-green-400 focus:ring-green-200 rounded-xl shadow-sm"
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Your Name</Label>
              <Input
                value={formData.userName}
                onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                className="bg-white border-2 border-green-100 focus:border-green-400 focus:ring-green-200 rounded-xl shadow-sm"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Role/Designation</Label>
              <Input
                value={formData.designation}
                onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                className="bg-white border-2 border-green-100 focus:border-green-400 focus:ring-green-200 rounded-xl shadow-sm"
                placeholder="Enter your job title"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-500" />
                  Your Email
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white border-2 border-green-100 focus:border-green-400 focus:ring-green-200 rounded-xl shadow-sm"
                  placeholder="your.email@company.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  Phone
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-white border-2 border-green-100 focus:border-green-400 focus:ring-green-200 rounded-xl shadow-sm"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Recipient Email (Optional)
                </Label>
                <Input
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                  className="bg-white border-2 border-green-100 focus:border-green-400 focus:ring-green-200 rounded-xl shadow-sm"
                  placeholder="manager@company.com"
                />
              </div>
            </div>
          </div>

          {/* Leave Details */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              Leave Information
            </h3>

            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-100">
              <Checkbox
                id="singleDay"
                checked={formData.isSingleDay}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSingleDay: !!checked }))}
                className="border-green-300 data-[state=checked]:bg-green-500"
              />
              <Label htmlFor="singleDay" className="text-gray-700 font-medium">
                Single-day leave
              </Label>
            </div>

            {formData.isSingleDay ? (
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Leave Date</Label>
                <Input
                  type="date"
                  value={formData.leaveDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, leaveDate: e.target.value }))}
                  className="bg-white border-2 border-green-100 focus:border-green-400 focus:ring-green-200 rounded-xl shadow-sm"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="bg-white border-2 border-green-100 focus:border-green-400 focus:ring-green-200 rounded-xl shadow-sm"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">End Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="bg-white border-2 border-green-100 focus:border-green-400 focus:ring-green-200 rounded-xl shadow-sm"
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Template</Label>
                <Select value={formData.template} onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}>
                  <SelectTrigger className="bg-white border-2 border-green-100 focus:border-green-400 rounded-xl shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="semi-formal">Semi-formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Recipient</Label>
                <Select value={formData.recipient} onValueChange={(value) => setFormData(prev => ({ ...prev, recipient: value }))}>
                  <SelectTrigger className="bg-white border-2 border-green-100 focus:border-green-400 rounded-xl shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">HR Department</SelectItem>
                    <SelectItem value="manager">Direct Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Reason Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Reason for Leave
          </h3>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Reason (AI will enhance this)</Label>
            <Textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              className="bg-white border-2 border-green-100 focus:border-green-400 focus:ring-green-200 rounded-xl shadow-sm min-h-[100px]"
              placeholder="Brief reason for leave"
            />
            <div className="text-sm text-gray-500">{formData.reason.length}/500</div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Quick Suggestions</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {reasonSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleReasonSuggestion(suggestion)}
                  className="text-left justify-start h-auto p-3 bg-green-50 border-green-200 text-gray-700 hover:bg-green-100 hover:border-green-300 rounded-xl"
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
              <div className="text-green-600 mb-2 font-medium">Generating your personalized letter... {progress}%</div>
              <div className="bg-gray-100 rounded-full h-3 max-w-md mx-auto shadow-inner">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <Button
            onClick={generateLetter}
            disabled={isGenerating}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg rounded-2xl shadow-[0_8px_32px_rgba(34,197,94,0.3)] hover:shadow-[0_12px_40px_rgba(34,197,94,0.4)] transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Dynamic Letter'}
          </Button>
        </div>
      </div>
    </div>
  );
};
