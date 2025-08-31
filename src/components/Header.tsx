import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">DriveEase</h1>
              <p className="text-xs text-muted-foreground">Premium Car Rentals</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Browse Cars
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
              About
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
              Contact
            </a>
          </nav>

          {/* Sign In Button */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate('/signin')}
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </Button>
        </div>
      </div>
    </header>
  );
}