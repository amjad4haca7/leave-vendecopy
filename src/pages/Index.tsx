
import { useState } from 'react';
import { LeaveForm } from '@/components/LeaveForm';
import { LetterDisplay } from '@/components/LetterDisplay';
import { ParticleBackground } from '@/components/ParticleBackground';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Header */}
      <div className="relative z-10 text-center py-12">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
          Leave Generator 3D
        </h1>
        <p className="text-xl text-gray-300 mb-8 font-light">
          AI-Powered Professional Leave Application System
        </p>
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

      {/* Floating Orbs */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="fixed bottom-20 right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="fixed top-1/2 left-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
    </div>
  );
};

export default Index;
