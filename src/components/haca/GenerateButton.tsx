
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GenerateButtonProps {
  isGenerating: boolean;
  progress: number;
  onGenerate: () => void;
}

export const GenerateButton = ({ isGenerating, progress, onGenerate }: GenerateButtonProps) => {
  return (
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
        onClick={onGenerate}
        disabled={isGenerating}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 text-lg rounded-2xl shadow-[0_8px_32px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:scale-105"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        {isGenerating ? 'Generating...' : 'Generate HACA Letter'}
      </Button>
    </div>
  );
};
