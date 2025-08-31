import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Car, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModelPickerDialogProps {
  models: any[];
  selectedModel?: string;
  selectedMake?: string;
  onApply: (model: string) => void;
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function ModelPickerDialog({ models, selectedModel, selectedMake, onApply, children, isLoading }: ModelPickerDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSelected, setTempSelected] = useState(selectedModel || '');

  const filteredModels = useMemo(() => {
    if (!searchTerm) return models;
    return models.filter(model =>
      (model.name || model).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [models, searchTerm]);

  const handleApply = () => {
    onApply(tempSelected);
    setOpen(false);
  };

  const handleReset = () => {
    setTempSelected('');
    setSearchTerm('');
  };

  const handleModelSelect = (model: any) => {
    const modelName = model.name || model;
    setTempSelected(modelName);
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
            Select Model
          </DialogTitle>
        </DialogHeader>

        <motion.div
          className="space-y-4 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Make Info */}
          {selectedMake && (
            <motion.div
              className="text-center p-3 bg-secondary/30 rounded-lg border"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-muted-foreground">Models for</p>
              <p className="text-lg font-semibold">{selectedMake}</p>
            </motion.div>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Models List */}
          <ScrollArea className="h-64 w-full rounded-md border p-2">
            {!selectedMake ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <Car className="w-6 h-6 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Please select a make first</p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <Car className="w-6 h-6 animate-pulse text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Loading models...</p>
                </div>
              </div>
            ) : filteredModels.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'No models found' : 'No models available'}
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredModels.map((model, index) => {
                  const modelName = model.name || model;
                  const isSelected = tempSelected === modelName;

                  return (
                    <motion.div
                      key={model.id || model}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-secondary/50 ${
                        isSelected ? 'bg-accent/20 border border-accent' : ''
                      }`}
                      onClick={() => handleModelSelect(model)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Car className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{modelName}</span>
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
              disabled={!tempSelected || !selectedMake}
            >
              Apply
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
