import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, DollarSign, Filter, X, Car, Coins } from 'lucide-react';
import { VehicleFilters } from '@/hooks/useVehicles';
import MakePickerDialog from './MakePickerDialog';
import ModelPickerDialog from './ModelPickerDialog';
import PriceRangeDialog from './PriceRangeDialog';
import YearPickerDialog from './YearPickerDialog';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';

interface SearchFiltersProps {
  onFiltersChange: (filters: VehicleFilters) => void;
  isLoading?: boolean;
  currencyCode?: string;
  staticMakes?: any[];
  staticModels?: any[];
}

export default function SearchFilters({ onFiltersChange, isLoading, currencyCode, staticMakes, staticModels }: SearchFiltersProps) {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [makes, setMakes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [makesLoading, setMakesLoading] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const { countryConfig } = useAuth();

  const handleFilterChange = (key: keyof VehicleFilters, value: string | number) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    
    // Auto-apply filter changes for make/model for immediate results
    if (key === 'make' || key === 'model') {
      onFiltersChange(newFilters);
    }
  };

  const handleSearch = () => {
    onFiltersChange(filters);
  };

  const handleReset = () => {
    setFilters({});
    onFiltersChange({});
  };

  const handlePriceRangeApply = (min: number, max: number) => {
    const newFilters = { ...filters, minPrice: min, maxPrice: max };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleYearRangeApply = (minYear: number, maxYear: number) => {
    const newFilters = { ...filters, minYear, maxYear };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Fetch makes on component mount or use static
  useEffect(() => {
    if (staticMakes) {
      setMakes(staticMakes);
      setMakesLoading(false);
    } else {
      const fetchMakes = async () => {
        setMakesLoading(true);
        try {
          const response = await axios.get('https://zfleetdev.azurewebsites.net/api/makemodel/makes');
          setMakes(response.data || []);
        } catch (error) {
          console.error('Failed to fetch makes:', error);
        } finally {
          setMakesLoading(false);
        }
      };

      fetchMakes();
    }
  }, [staticMakes]);

  // Fetch models when make is selected or use static
  useEffect(() => {
    if (staticModels && filters.make) {
      const filteredModels = staticModels.filter(model => model.make === filters.make);
      setModels(filteredModels);
      setModelsLoading(false);
    } else if (!staticModels) {
      const fetchModels = async () => {
        if (!filters.make) {
          setModels([]);
          return;
        }

        setModelsLoading(true);
        try {
          const response = await axios.get(
            `https://zfleetdev.azurewebsites.net/api/makemodel/makes/models?VehicleMake=${filters.make}`
          );
          setModels(response.data || []);
        } catch (error) {
          console.error('Failed to fetch models:', error);
          setModels([]);
        } finally {
          setModelsLoading(false);
        }
      };

      fetchModels();
    }
  }, [filters.make, staticModels]);

  const handleMakeChange = (makeName: string) => {
    const newFilters = { ...filters, make: makeName, model: undefined }; // Clear model when make changes
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleModelChange = (modelName: string) => {
    const newFilters = { ...filters, model: modelName };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const removeFilter = (key: keyof VehicleFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const getActiveFilters = () => {
    const active = [];
    if (filters.city) active.push({ key: 'city' as keyof VehicleFilters, label: `City: ${filters.city}` });
    if (filters.make) active.push({ key: 'make' as keyof VehicleFilters, label: `Make: ${filters.make}` });
    if (filters.model) active.push({ key: 'model' as keyof VehicleFilters, label: `Model: ${filters.model}` });
    if (filters.minPrice || filters.maxPrice) {
      active.push({ 
        key: 'price' as keyof VehicleFilters, 
        label: `Price: ${formatPrice(filters.minPrice || 0, countryConfig?.currencyCode || 'USD')} - ${filters.maxPrice ? formatPrice(filters.maxPrice, countryConfig?.currencyCode || 'USD') : '∞'}`,
        clearKeys: ['minPrice', 'maxPrice'] as (keyof VehicleFilters)[]
      });
    }
    if (filters.minYear || filters.maxYear) {
      active.push({ 
        key: 'year' as keyof VehicleFilters, 
        label: `Year: ${filters.minYear || 'Any'} - ${filters.maxYear || 'Any'}`,
        clearKeys: ['minYear', 'maxYear'] as (keyof VehicleFilters)[]
      });
    }
    return active;
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Primary Search */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="City or Country"
                  value={filters.city || ''}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Pickup Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={filters.availableStartDate?.split('T')[0] || ''}
                  onChange={(e) => handleFilterChange('availableStartDate', e.target.value ? `${e.target.value}T00:00:00` : '')}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Return Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="date"
                  placeholder="End Date"
                  value={filters.availableEndDate?.split('T')[0] || ''}
                  onChange={(e) => handleFilterChange('availableEndDate', e.target.value ? `${e.target.value}T00:00:00` : '')}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground opacity-0">Search</label>
              <Button 
                onClick={handleSearch} 
                className="w-full h-10" 
                variant="accent"
                disabled={isLoading}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-muted-foreground"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
            </Button>
          </div>

          {/* Active Filters */}
          <AnimatePresence mode="wait">
            {getActiveFilters().length > 0 && (
              <motion.div
                key="active-filters"
                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                  overflow: 'visible',
                  transition: {
                    height: { duration: 0.3, ease: 'easeInOut' },
                    opacity: { duration: 0.2, delay: 0.1 }
                  }
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  overflow: 'hidden',
                  transition: {
                    height: { duration: 0.3, ease: 'easeInOut' },
                    opacity: { duration: 0.2 }
                  }
                }}
                className="flex flex-wrap gap-2"
              >
                {getActiveFilters().map((filter, index) => (
                  <motion.div
                    key={filter.key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.2, delay: index * 0.05, ease: 'easeOut' }
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      transition: { duration: 0.15, ease: 'easeIn' }
                    }}
                  >
                    <Badge
                      variant="secondary"
                      className="pr-1 py-1 cursor-pointer hover:bg-destructive/10 transition-colors"
                      onClick={() => {
                        if (filter.clearKeys) {
                          const newFilters = { ...filters };
                          filter.clearKeys.forEach(key => delete newFilters[key]);
                          setFilters(newFilters);
                          onFiltersChange(newFilters);
                        } else {
                          removeFilter(filter.key);
                        }
                      }}
                    >
                      <span className="mr-1">{filter.label}</span>
                      <X className="w-3 h-3" />
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Advanced Filters */}
          <AnimatePresence mode="wait">
            {showAdvanced && (
              <motion.div
                key="advanced-filters"
                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                  overflow: 'visible',
                  transition: {
                    height: { duration: 0.4, ease: 'easeInOut' },
                    opacity: { duration: 0.3, delay: 0.1 }
                  }
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  overflow: 'hidden',
                  transition: {
                    height: { duration: 0.3, ease: 'easeInOut' },
                    opacity: { duration: 0.2 }
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border"
              >
                <MakePickerDialog
                  makes={makes}
                  selectedMake={filters.make}
                  onApply={handleMakeChange}
                  isLoading={makesLoading}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Car className="w-4 h-4 mr-2" />
                    {filters.make ? filters.make : 'Select Make'}
                  </Button>
                </MakePickerDialog>
                
                <ModelPickerDialog
                  models={models}
                  selectedModel={filters.model}
                  selectedMake={filters.make}
                  onApply={handleModelChange}
                  isLoading={modelsLoading}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    disabled={!filters.make}
                  >
                    <Car className="w-4 h-4 mr-2" />
                    {filters.model ? filters.model : 'Select Model'}
                  </Button>
                </ModelPickerDialog>
                
                <PriceRangeDialog
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  currencyCode={currencyCode}
                  onApply={handlePriceRangeApply}
                >
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    {filters.minPrice || filters.maxPrice 
                      ? `${formatPrice(filters.minPrice || 0, countryConfig?.currencyCode || 'USD')} - ${filters.maxPrice ? formatPrice(filters.maxPrice, countryConfig?.currencyCode || 'USD') : '∞'}` 
                      : 'Price Range'
                    }
                  </Button>
                </PriceRangeDialog>
                
                <YearPickerDialog
                  selectedMinYear={filters.minYear}
                  selectedMaxYear={filters.maxYear}
                  onApply={handleYearRangeApply}
                >
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {filters.minYear || filters.maxYear 
                      ? `${filters.minYear || 'Any'} - ${filters.maxYear || 'Any'}` 
                      : 'Year Range'
                    }
                  </Button>
                </YearPickerDialog>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reset Button */}
          {Object.keys(filters).some(key => filters[key as keyof VehicleFilters]) && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}