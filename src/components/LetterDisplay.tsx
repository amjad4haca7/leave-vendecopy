
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download, ArrowLeft, FileText, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LetterDisplayProps {
  letter: string;
  onBack: () => void;
}

export const LetterDisplay = ({ letter, onBack }: LetterDisplayProps) => {
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
      <div className="bg-gray-900/40 backdrop-blur-lg rounded-3xl border border-cyan-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-6 border-b border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-cyan-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Generated Leave Application</h2>
                <p className="text-gray-300">Professional format ready to submit</p>
              </div>
            </div>
            
            <Button
              onClick={onBack}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Form
            </Button>
          </div>
        </div>

        {/* Letter Content */}
        <div className="p-8">
          <div className="bg-white rounded-lg p-8 shadow-inner">
            <pre className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed text-base">
              {letter}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-cyan-500/30">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={copyToClipboard}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
            
            <Button
              onClick={downloadLetter}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Download className="w-5 h-5 mr-2" />
              Download as Text
            </Button>
            
            <Button
              onClick={printLetter}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <FileText className="w-5 h-5 mr-2" />
              Print Letter
            </Button>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">📋 Submission Tips</h3>
        <ul className="text-gray-300 space-y-2 text-sm">
          <li>• Submit your application at least 2-3 days in advance</li>
          <li>• Keep a copy for your records</li>
          <li>• Follow up if you don't receive confirmation within 48 hours</li>
          <li>• Ensure all contact information is accurate</li>
        </ul>
      </div>
    </div>
  );
};
