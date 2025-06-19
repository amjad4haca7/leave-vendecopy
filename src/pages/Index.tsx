
import { useState } from 'react';
import { LeaveForm } from '@/components/LeaveForm';
import { LetterDisplay } from '@/components/LetterDisplay';

const Index = () => {
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [showLetter, setShowLetter] = useState(false);

  const handleLetterGenerated = (letter: string) => {
    setGeneratedLetter(letter);
    setShowLetter(true);
  };

  const handleBackToForm = () => {
    setShowLetter(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-green-300/20 to-emerald-300/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-emerald-200/40 to-green-200/40 rounded-full blur-xl"></div>
        
        {/* 3D Geometric Shapes */}
        <div className="absolute top-10 right-1/4 w-16 h-16 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rotate-45 rounded-lg blur-sm"></div>
        <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-gradient-to-br from-emerald-300/10 to-green-300/10 rotate-12 rounded-2xl blur-sm"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 text-center py-12">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent mb-4">
          Leave Generator 3D
        </h1>
        <p className="text-xl text-gray-600 mb-8 font-medium">
          AI-Powered Professional Leave Application System
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pb-12">
        {!showLetter ? (
          <LeaveForm onLetterGenerated={handleLetterGenerated} />
        ) : (
          <LetterDisplay 
            letter={generatedLetter} 
            onBack={handleBackToForm}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
