
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LeaveForm } from '@/components/LeaveForm';
import { HacaLeaveForm } from '@/components/HacaLeaveForm';
import { LetterDisplay } from '@/components/LetterDisplay';
import { Building, GraduationCap, ArrowLeft } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'general' | 'haca'>('landing');
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [showLetter, setShowLetter] = useState(false);

  const handleLetterGenerated = (letter: string, email?: string) => {
    setGeneratedLetter(letter);
    setRecipientEmail(email || '');
    setShowLetter(true);
  };

  const handleBackToForm = () => {
    setShowLetter(false);
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setShowLetter(false);
  };

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-green-300/20 to-emerald-300/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-emerald-200/40 to-green-200/40 rounded-full blur-xl"></div>
        </div>
        
        {/* Header */}
        <div className="relative z-10 text-center py-8 md:py-12">
          <div className="mb-4 md:mb-8">
            <img 
              src="/lovable-uploads/33e7c33e-7549-4d7f-bd51-44417ade4d3f.png" 
              alt="Leave Application Generator Logo" 
              className="w-56 h-40 md:w-64 md:h-48 mx-auto mb-4 md:mb-6 object-contain"
            />
          </div>
          <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 font-medium px-4">
            Leave Application Generator
          </p>
        </div>

        {/* Button Options */}
        <div className="relative z-10 container mx-auto px-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <Button
              onClick={() => setCurrentView('general')}
              className="h-32 md:h-40 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-3xl shadow-[0_20px_60px_rgba(34,197,94,0.3)] hover:shadow-[0_25px_70px_rgba(34,197,94,0.4)] transition-all duration-500 transform hover:scale-105 flex flex-col items-center justify-center gap-3 md:gap-4 group"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                <Building className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">General Use</div>
                <div className="text-green-100 text-xs md:text-sm">For all organizations</div>
              </div>
            </Button>

            <Button
              onClick={() => setCurrentView('haca')}
              className="h-32 md:h-40 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-3xl shadow-[0_20px_60px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_70px_rgba(16,185,129,0.4)] transition-all duration-500 transform hover:scale-105 flex flex-col items-center justify-center gap-3 md:gap-4 group"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                <GraduationCap className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">HACA</div>
                <div className="text-emerald-100 text-xs md:text-sm">Harris and Co Academy</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-green-300/20 to-emerald-300/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-emerald-200/40 to-green-200/40 rounded-full blur-xl"></div>
      </div>
      
      {/* Header with Back Button */}
      <div className="relative z-10 text-center py-6 md:py-8">
        <div className="flex items-center justify-between max-w-6xl mx-auto px-4 mb-4 md:mb-6">
          <Button
            onClick={handleBackToLanding}
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-50 rounded-xl text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent">
            {currentView === 'haca' ? 'HACA Leave Application' : 'General Leave Application'}
          </h1>
          <div></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pb-12">
        {!showLetter ? (
          currentView === 'haca' ? (
            <HacaLeaveForm onLetterGenerated={handleLetterGenerated} />
          ) : (
            <LeaveForm onLetterGenerated={handleLetterGenerated} />
          )
        ) : (
          <LetterDisplay 
            letter={generatedLetter} 
            recipientEmail={recipientEmail}
            onBack={handleBackToForm}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
