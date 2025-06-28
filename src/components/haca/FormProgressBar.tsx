
interface FormProgressBarProps {
  progress: number;
}

export const FormProgressBar = ({ progress }: FormProgressBarProps) => {
  return (
    <div className="mb-8 relative">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-green-100">
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span className="font-medium">Form Progress</span>
          <span className="font-bold text-emerald-600">{progress}%</span>
        </div>
        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-white/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
