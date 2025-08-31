import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Car, LogIn, ArrowRight, Shield, Clock, Star, CheckCircle } from 'lucide-react';
import { signInWithGoogle } from '@/services/firebase';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: number;
}

const AuthPromptModal = ({ isOpen, onClose, vehicleId }: AuthPromptModalProps) => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      // Store the intended destination for after authentication
      if (vehicleId) {
        sessionStorage.setItem('redirectUrl', `/vehicle/${vehicleId}`);
      }

      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleNavigateToSignIn = () => {
    // Store the intended destination for after authentication
    if (vehicleId) {
      sessionStorage.setItem('redirectUrl', `/vehicle/${vehicleId}`);
    }
    onClose();
    navigate('/signin');
  };

  const benefits = [
    { icon: Shield, text: "Secure Platform" },
    { icon: Clock, text: "24/7 Support" },
    { icon: Star, text: "Premium Fleet" },
    { icon: CheckCircle, text: "Easy Booking" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 border-0 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-background via-secondary/30 to-accent/10 p-6 text-center">
          <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <Car className="w-6 h-6 text-primary-foreground" />
          </div>

          <DialogTitle className="text-xl font-bold mb-2">
            Create Account to Continue
          </DialogTitle>

          <DialogDescription className="text-muted-foreground">
            Sign in to view detailed vehicle information and book your perfect ride
          </DialogDescription>
        </div>

        {/* Content */}
        <div className="p-6 bg-white">
          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <benefit.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Special Offer */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-2 rounded-full text-sm font-medium">
              🎉 First booking gets 10% off!
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              size="lg"
              className="w-full h-12 text-base font-medium border-2 hover:bg-secondary/50 transition-all duration-200"
            >
              <LogIn className="w-5 h-5 mr-3" />
              Continue with Google
            </Button>

            <Button
              onClick={handleNavigateToSignIn}
              variant="outline"
              className="w-full h-12 text-base font-medium border-2 hover:bg-secondary/50 transition-all duration-200"
              size="lg"
            >
              Sign In / Create Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>Verified</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span>4.8★</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPromptModal;
