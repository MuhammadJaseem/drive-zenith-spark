import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface YearPickerDialogProps {
  selectedMinYear?: number;
  selectedMaxYear?: number;
  onApply: (minYear: number, maxYear: number) => void;
  children: React.ReactNode;
}

export default function YearPickerDialog({ selectedMinYear, selectedMaxYear, onApply, children }: YearPickerDialogProps) {
  const [open, setOpen] = useState(false);
  const [minYear, setMinYear] = useState(selectedMinYear || 2000);
  const [maxYear, setMaxYear] = useState(selectedMaxYear || new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i);
  
  const filteredYears = years.filter(year => 
    year.toString().includes(searchTerm)
  );

  const handleYearClick = (year: number, type: 'min' | 'max') => {
    if (type === 'min') {
      setMinYear(year);
      if (year > maxYear) setMaxYear(year);
    } else {
      setMaxYear(year);
      if (year < minYear) setMinYear(year);
    }
  };

  const handleApply = () => {
    onApply(minYear, maxYear);
    setOpen(false);
  };

  const handleReset = () => {
    setMinYear(2000);
    setMaxYear(currentYear);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Select Year Range
          </DialogTitle>
        </DialogHeader>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Range Display */}
          <motion.div 
            className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center flex-1">
              <p className="text-sm text-muted-foreground">Min Year</p>
              <p className="text-xl font-semibold">{minYear}</p>
            </div>
            <div className="px-4 text-muted-foreground">-</div>
            <div className="text-center flex-1">
              <p className="text-sm text-muted-foreground">Max Year</p>
              <p className="text-xl font-semibold">{maxYear}</p>
            </div>
          </motion.div>

          {/* Year Grid */}
          <div className="max-h-80 overflow-y-auto">
            <div className="grid grid-cols-4 gap-2 p-2">
              {filteredYears.map((year) => (
                <motion.div
                  key={year}
                  className="flex flex-col gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={year === minYear ? "accent" : "outline"}
                    size="sm"
                    onClick={() => handleYearClick(year, 'min')}
                    className="h-8 text-xs"
                  >
                    {year}
                  </Button>
                  <div className="text-xs text-center text-muted-foreground">
                    {year >= minYear && year <= maxYear ? '✓' : ''}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={handleReset} 
              className="flex-1"
            >
              Reset
            </Button>
            <Button 
              onClick={handleApply} 
              className="flex-1"
              variant="accent"
            >
              Apply
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}