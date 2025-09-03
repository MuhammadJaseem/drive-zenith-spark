import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { DollarSign, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';

interface PriceRangeDialogProps {
  minPrice?: number;
  maxPrice?: number;
  currencyCode?: string;
  onApply: (min: number, max: number) => void;
  children: React.ReactNode;
}

export default function PriceRangeDialog({ minPrice = 0, maxPrice = 1000, currencyCode = 'USD', onApply, children }: PriceRangeDialogProps) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([minPrice, maxPrice]);
  const [minInput, setMinInput] = useState(minPrice.toString());
  const [maxInput, setMaxInput] = useState(maxPrice.toString());

  const handleSliderChange = (value: number[]) => {
    setRange(value);
    setMinInput(value[0].toString());
    setMaxInput(value[1].toString());
  };

  const handleInputChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    if (type === 'min') {
      setMinInput(value);
      setRange([numValue, range[1]]);
    } else {
      setMaxInput(value);
      setRange([range[0], numValue]);
    }
  };

  const handleApply = () => {
    onApply(range[0], range[1]);
    setOpen(false);
  };

  const handleReset = () => {
    setRange([0, 1000]);
    setMinInput('0');
    setMaxInput('1000');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Price Range
          </DialogTitle>
        </DialogHeader>
        
        <motion.div 
          className="space-y-6 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Slider */}
          <div className="space-y-4">
            <Slider
              value={range}
              onValueChange={handleSliderChange}
              max={2000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatPrice(0, currencyCode)}</span>
              <span>{formatPrice(2000, currencyCode)}+ </span>
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Price</label>
              <div className="relative">
                <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={minInput}
                  onChange={(e) => handleInputChange('min', e.target.value)}
                  className="pl-10"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Price</label>
              <div className="relative">
                <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={maxInput}
                  onChange={(e) => handleInputChange('max', e.target.value)}
                  className="pl-10"
                  placeholder="1000"
                />
              </div>
            </div>
          </div>

          {/* Current Range Display */}
          <motion.div 
            className="text-center p-4 bg-secondary/50 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm text-muted-foreground">Selected Range</p>
            <p className="text-lg font-semibold">{formatPrice(range[0], currencyCode)} - {formatPrice(range[1], currencyCode)}</p>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3">
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