
import { AlertCircle, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileStatusBannerProps {
  hasProfile: boolean;
  onManageProfile: () => void;
}

export const ProfileStatusBanner = ({ hasProfile, onManageProfile }: ProfileStatusBannerProps) => {
  return (
    <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {hasProfile ? (
            <>
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-emerald-800 font-medium">Profile loaded! Form auto-filled with your saved details.</p>
                <p className="text-emerald-600 text-sm">You can edit any field below or update your profile settings.</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-8 h-8 text-amber-500" />
              <div>
                <p className="text-amber-800 font-medium">No HACA profile found</p>
                <p className="text-amber-600 text-sm">Set up your profile to auto-fill forms in the future.</p>
              </div>
            </>
          )}
        </div>
        <Button
          onClick={onManageProfile}
          variant="outline"
          size="sm"
          className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
        >
          <Settings className="w-4 h-4 mr-2" />
          Manage Profile
        </Button>
      </div>
    </div>
  );
};
