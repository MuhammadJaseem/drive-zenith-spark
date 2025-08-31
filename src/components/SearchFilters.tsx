import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Calendar, DollarSign, Filter } from 'lucide-react';
import { VehicleFilters } from '@/hooks/useVehicles';

interface SearchFiltersProps {
  onFiltersChange: (filters: VehicleFilters) => void;
  isLoading?: boolean;
}

export default function SearchFilters({ onFiltersChange, isLoading }: SearchFiltersProps) {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof VehicleFilters, value: string | number) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    onFiltersChange(filters);
  };

  const handleReset = () => {
    setFilters({});
    onFiltersChange({});
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Primary Search */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="City or Country"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="pl-10"
              />
            </div>
            
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
            
            <Button 
              onClick={handleSearch} 
              className="w-full" 
              variant="accent"
              disabled={isLoading}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
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

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-border">
              <Input
                placeholder="Make (e.g., Toyota)"
                value={filters.make || ''}
                onChange={(e) => handleFilterChange('make', e.target.value)}
              />
              
              <Input
                placeholder="Model"
                value={filters.model || ''}
                onChange={(e) => handleFilterChange('model', e.target.value)}
              />
              
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                  className="pl-10"
                />
              </div>
              
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                  className="pl-10"
                />
              </div>
              
              <Input
                type="number"
                placeholder="Min Year"
                value={filters.minYear || ''}
                onChange={(e) => handleFilterChange('minYear', Number(e.target.value))}
              />
              
              <Input
                type="number"
                placeholder="Max Year"
                value={filters.maxYear || ''}
                onChange={(e) => handleFilterChange('maxYear', Number(e.target.value))}
              />
            </div>
          )}

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