import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '@/services/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, ArrowLeft, LogIn } from 'lucide-react';

export default function SignIn() {
  const { isAuthenticated, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const redirectUrl = localStorage.getItem('redirectUrl');
      if (redirectUrl) {
        localStorage.removeItem('redirectUrl');
        navigate(redirectUrl, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // Redirect happens automatically via useEffect
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cars
        </Button>

        {/* Sign In Card */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Car className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">Welcome to DriveEase</CardTitle>
              <p className="text-muted-foreground">
                Sign in to access premium car rentals and exclusive deals
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Sign-In Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="w-full h-12 text-base font-medium border-2 hover:bg-secondary/50 transition-all duration-200"
            >
              <LogIn className="w-5 h-5 mr-3" />
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Alternative Options */}
            <div className="space-y-3">
              <Button variant="outline" size="lg" className="w-full" disabled>
                <span className="text-muted-foreground">Email Sign-In (Coming Soon)</span>
              </Button>
              
              <Button variant="outline" size="lg" className="w-full" disabled>
                <span className="text-muted-foreground">Phone Sign-In (Coming Soon)</span>
              </Button>
            </div>

            {/* Terms */}
            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              By continuing, you agree to our{' '}
              <a href="#" className="text-accent hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-accent hover:underline">
                Privacy Policy
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm font-medium text-foreground">Why choose DriveEase?</p>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <span>✓ No Hidden Fees</span>
            <span>✓ 24/7 Support</span>
            <span>✓ Premium Fleet</span>
          </div>
        </div>
      </div>
    </div>
  );
}