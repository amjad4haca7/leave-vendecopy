
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface LeaveReasonSectionProps {
  reason: string;
  onReasonChange: (reason: string) => void;
}

export const LeaveReasonSection = ({ reason, onReasonChange }: LeaveReasonSectionProps) => {
  const reasonSuggestions = [
    "personal reason",
    "health issue",
    "family matter",
    "medical appointment",
    "emergency"
  ];

  return (
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
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
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
              onClick={() => onReasonChange(suggestion)}
              className="text-left justify-start h-auto p-3 bg-emerald-50 border-emerald-200 text-gray-700 hover:bg-emerald-100 hover:border-emerald-300 rounded-xl"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
