
import { Calendar, Mail, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StudentDetailsSectionProps {
  formData: {
    studentName: string;
    batch: string;
    managerName: string;
    recipientEmail: string;
    leaveDate: string;
  };
  onFormDataChange: (field: string, value: string) => void;
}

export const StudentDetailsSection = ({ formData, onFormDataChange }: StudentDetailsSectionProps) => {
  return (
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
            onChange={(e) => onFormDataChange('studentName', e.target.value)}
            className="bg-white border-2 border-emerald-100 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl shadow-sm"
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">Batch</Label>
          <Input
            value={formData.batch}
            onChange={(e) => onFormDataChange('batch', e.target.value)}
            className="bg-white border-2 border-emerald-100 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl shadow-sm"
            placeholder="Enter your batch"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">Manager/Coordinator Name</Label>
          <Input
            value={formData.managerName}
            onChange={(e) => onFormDataChange('managerName', e.target.value)}
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
            onChange={(e) => onFormDataChange('recipientEmail', e.target.value)}
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
            onChange={(e) => onFormDataChange('leaveDate', e.target.value)}
            className="bg-white border-2 border-emerald-100 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl shadow-sm"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
    </div>
  );
};
