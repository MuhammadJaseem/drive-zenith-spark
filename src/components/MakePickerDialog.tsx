import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Car, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MakePickerDialogProps {
  makes: any[];
  selectedMake?: string;
  onApply: (make: string) => void;
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function MakePickerDialog({ makes, selectedMake, onApply, children, isLoading }: MakePickerDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSelected, setTempSelected] = useState(selectedMake || '');

  const filteredMakes = useMemo(() => {
    if (!searchTerm) return makes;
    return makes.filter(make =>
      (make.name || make).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [makes, searchTerm]);

  const handleApply = () => {
    onApply(tempSelected);
    setOpen(false);
  };

  const handleReset = () => {
    setTempSelected('');
    setSearchTerm('');
  };

  const handleMakeSelect = (make: any) => {
    const makeName = make.name || make;
    setTempSelected(makeName);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Select Make
          </DialogTitle>
        </DialogHeader>

        <motion.div
          className="space-y-4 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search makes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Makes List */}
          <ScrollArea className="h-64 w-full rounded-md border p-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <Car className="w-6 h-6 animate-pulse text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Loading makes...</p>
                </div>
              </div>
            ) : filteredMakes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'No makes found' : 'No makes available'}
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredMakes.map((make, index) => {
                  const makeName = make.name || make;
                  const isSelected = tempSelected === makeName;

                  return (
                    <motion.div
                      key={make.id || make}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-secondary/50 ${
                        isSelected ? 'bg-accent/20 border border-accent' : ''
                      }`}
                      onClick={() => handleMakeSelect(make)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Car className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{makeName}</span>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Check className="w-4 h-4 text-accent" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </ScrollArea>

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
              disabled={!tempSelected}
            >
              Apply
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
