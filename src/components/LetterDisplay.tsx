
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download, ArrowLeft, FileText, Check, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LetterDisplayProps {
  letter: string;
  recipientEmail?: string;
  onBack: () => void;
}

export const LetterDisplay = ({ letter, recipientEmail, onBack }: LetterDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      toast({ title: "Copied!", description: "Letter copied to clipboard successfully" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Error", description: "Failed to copy to clipboard", variant: "destructive" });
    }
  };

  const downloadLetter = () => {
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leave-application.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded!", description: "Letter downloaded successfully" });
  };

  const openGmail = () => {
    const subject = encodeURIComponent("Leave Application Request");
    const body = encodeURIComponent(letter);
    const to = recipientEmail ? encodeURIComponent(recipientEmail) : '';
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
    toast({ 
      title: "Opening Gmail", 
      description: recipientEmail 
        ? `Gmail compose window opened with recipient: ${recipientEmail}` 
        : "Gmail compose window opened in new tab" 
    });
  };

  const printLetter = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Leave Application</title>
            <style>
              body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 40px; }
              pre { white-space: pre-wrap; font-family: 'Times New Roman', serif; }
            </style>
          </head>
          <body>
            <pre>${letter}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-green-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl font-bold truncate">Generated Leave Application</h2>
                <p className="text-green-100 text-sm sm:text-base">Professional format ready to submit</p>
              </div>
            </div>
            
            <Button
              onClick={onBack}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-white/10 backdrop-blur-sm rounded-xl ml-3 flex-shrink-0 text-xs sm:text-sm p-2 sm:px-4 sm:py-2"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back to Form</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
        </div>

        {/* Letter Content */}
        <div className="p-4 sm:p-8">
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-inner border border-gray-100">
            <pre className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed text-sm sm:text-base overflow-x-auto">
              {letter}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-green-50 border-t border-green-100">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 justify-center">
            <Button
              onClick={openGmail}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-[0_8px_24px_rgba(239,68,68,0.3)] hover:shadow-[0_12px_32px_rgba(239,68,68,0.4)] transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm col-span-2 sm:col-span-1"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{recipientEmail ? `Mail to ${recipientEmail}` : 'Mail Now (Gmail)'}</span>
              <span className="sm:hidden">Mail</span>
            </Button>

            <Button
              onClick={copyToClipboard}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-[0_8px_24px_rgba(34,197,94,0.3)] hover:shadow-[0_12px_32px_rgba(34,197,94,0.4)] transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
            >
              {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            
            <Button
              onClick={downloadLetter}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-[0_8px_24px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_32px_rgba(59,130,246,0.4)] transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Download
            </Button>
            
            <Button
              onClick={printLetter}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-[0_8px_24px_rgba(147,51,234,0.3)] hover:shadow-[0_12px_32px_rgba(147,51,234,0.4)] transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-100 shadow-lg">
        <h3 className="text-base sm:text-lg font-bold text-green-700 mb-2 sm:mb-3">📋 Submission Tips</h3>
        <ul className="text-gray-600 space-y-1 sm:space-y-2 text-xs sm:text-sm">
          <li>• Submit your application at least 2-3 days in advance</li>
          <li>• Keep a copy for your records</li>
          <li>• Follow up if you don't receive confirmation within 48 hours</li>
          <li>• Ensure all contact information is accurate</li>
        </ul>
      </div>
    </div>
  );
};
