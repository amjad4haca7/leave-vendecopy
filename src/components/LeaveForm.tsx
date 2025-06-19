
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Building, Mail, Phone, FileText, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LeaveFormProps {
  onLetterGenerated: (letter: string) => void;
}

export const LeaveForm = ({ onLetterGenerated }: LeaveFormProps) => {
  const [formData, setFormData] = useState({
    companyName: '',
    userName: '',
    designation: '',
    email: '',
    phone: '',
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

  const reasonSuggestions = [
    "Personal medical appointment requiring immediate attention",
    "Family emergency requiring urgent travel and presence",
    "Mild fever requiring medical rest and recovery",
    "Personal matters requiring immediate resolution",
    "Medical consultation with specialist physician",
    "Family celebration and cultural obligations"
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

  const generateLetter = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearInterval(progressInterval);
    setProgress(100);

    const dateText = formData.isSingleDay 
      ? `on ${new Date(formData.leaveDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
      : `from ${new Date(formData.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} to ${new Date(formData.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;

    const recipientTitle = formData.recipient === 'hr' ? 'Human Resources Department' : 'Manager';

    const letter = `Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

To: ${recipientTitle}
${formData.companyName}

Subject: Application for Leave of Absence

Dear Sir/Madam,

I am writing to formally request a leave of absence ${dateText}. I am currently employed as ${formData.designation} in your esteemed organization.

The reason for my leave application is ${formData.reason}. I understand the importance of my role and responsibilities, and I have ensured that all urgent matters will be addressed before my departure.

I kindly request you to grant me leave for the mentioned period. I assure you that I will resume my duties promptly upon my return and will make up for any work that may be pending.

I would be grateful if you could approve my leave application at your earliest convenience. Please feel free to contact me at ${formData.email} or ${formData.phone} if you need any additional information.

Thank you for your consideration and understanding.

Yours sincerely,

${formData.userName}
${formData.designation}
Contact: ${formData.email}
Phone: ${formData.phone}`;

    onLetterGenerated(letter);
    setIsGenerating(false);
    toast({ title: "Success!", description: "Leave application generated successfully!" });
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
      {/* Progress Bar */}
      <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-full p-2 border border-cyan-500/30">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Form Progress</span>
          <span>{calculateProgress()}%</span>
        </div>
        <div className="bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-gray-900/40 backdrop-blur-lg rounded-3xl p-8 border border-cyan-500/30 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Company Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
              <Building className="w-6 h-6" />
              Organization Details
            </h3>
            
            <div className="space-y-2">
              <Label className="text-gray-300">Company/Institution Name</Label>
              <Input
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Your Name</Label>
              <Input
                value={formData.userName}
                onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Role/Designation</Label>
              <Input
                value={formData.designation}
                onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                placeholder="Enter your job title"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                  placeholder="your.email@company.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Leave Details */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Leave Information
            </h3>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="singleDay"
                checked={formData.isSingleDay}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSingleDay: !!checked }))}
              />
              <Label htmlFor="singleDay" className="text-gray-300">
                Single-day leave
              </Label>
            </div>

            {formData.isSingleDay ? (
              <div className="space-y-2">
                <Label className="text-gray-300">Leave Date</Label>
                <Input
                  type="date"
                  value={formData.leaveDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, leaveDate: e.target.value }))}
                  className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">End Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Template</Label>
                <Select value={formData.template} onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="semi-formal">Semi-formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Recipient</Label>
                <Select value={formData.recipient} onValueChange={(value) => setFormData(prev => ({ ...prev, recipient: value }))}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
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
          <h3 className="text-2xl font-semibold text-pink-400 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Reason for Leave
          </h3>
          
          <div className="space-y-2">
            <Label className="text-gray-300">Reason (AI will enhance this)</Label>
            <Textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400 min-h-[100px]"
              placeholder="Brief reason for leave (e.g., fever, family emergency, personal matter)"
            />
            <div className="text-sm text-gray-400">{formData.reason.length}/500</div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Quick Suggestions</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {reasonSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleReasonSuggestion(suggestion)}
                  className="text-left justify-start h-auto p-3 bg-gray-800/30 border-gray-600 text-gray-300 hover:bg-cyan-500/20 hover:border-cyan-400"
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
              <div className="text-cyan-400 mb-2">Generating your letter... {progress}%</div>
              <div className="bg-gray-700 rounded-full h-2 max-w-md mx-auto">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <Button
            onClick={generateLetter}
            disabled={isGenerating}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Leave Application'}
          </Button>
        </div>
      </div>
    </div>
  );
};
