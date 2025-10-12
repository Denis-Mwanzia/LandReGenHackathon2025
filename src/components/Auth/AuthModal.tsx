import { useState } from 'react';
import { X, User } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import UserProfile from './UserProfile';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUserChange: (user: any) => void;
};

export default function AuthModal({
  isOpen,
  onClose,
  user,
  onUserChange,
}: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'profile'>(
    'login'
  );

  const handleAuthSuccess = () => {
    // Refresh user data
    onUserChange(null); // Will be updated by parent component
    setAuthMode('profile');
  };

  const handleLogout = () => {
    onUserChange(null);
    setAuthMode('login');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                <User className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">
                {user
                  ? 'Profile'
                  : authMode === 'login'
                  ? 'Sign In'
                  : 'Create Account'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Close modal"
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {user ? (
              <UserProfile onLogout={handleLogout} />
            ) : authMode === 'login' ? (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToSignup={() => setAuthMode('signup')}
              />
            ) : (
              <SignupForm
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={() => setAuthMode('login')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
