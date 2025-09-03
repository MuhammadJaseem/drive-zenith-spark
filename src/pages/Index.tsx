import React, { useState } from 'react';
import Header from '@/components/Header';
import VehicleCard from '@/components/VehicleCard';
import SearchFilters from '@/components/SearchFilters';
import { useVehicles, VehicleFilters } from '@/hooks/useVehicles';
import { Loader2, Car, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const { data: vehicles, isLoading, error, refetch } = useVehicles(filters);

  const handleFiltersChange = (newFilters: VehicleFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Premium Car Rentals
              <span className="block text-accent">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              Discover luxury vehicles, competitive prices, and exceptional service. 
              Your perfect ride is just a click away.
            </p>
            
            {/* Key Features */}
            <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>No Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>24/7 Customer Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Premium Fleet</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SearchFilters onFiltersChange={handleFiltersChange} isLoading={isLoading} currencyCode={vehicles?.[0]?.currencyCode} />
        </div>
      </section>

      {/* Vehicle Listings */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Available Vehicles</h2>
              <p className="text-muted-foreground mt-2">
                {vehicles?.length ? `${vehicles.length} vehicles found` : 'Discover our premium fleet'}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
                <p className="text-muted-foreground">Loading vehicles...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4 max-w-md">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                <h3 className="text-lg font-semibold text-foreground">Unable to load vehicles</h3>
                <p className="text-muted-foreground">
                  We're having trouble connecting to our servers. Please try again.
                </p>
                <Button onClick={() => refetch()} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && vehicles?.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4 max-w-md">
                <Car className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold text-foreground">No vehicles found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search filters or check back later for new availability.
                </p>
                <Button onClick={() => setFilters({})} variant="outline">
                  Reset Filters
                </Button>
              </div>
            </div>
          )}

          {/* Vehicle Grid */}
          {vehicles && vehicles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicles.map((vehicleData) => (
                <VehicleCard
                  key={vehicleData.vehicle.vehicleId}
                  vehicle={vehicleData.vehicle}
                  rating={vehicleData.rating}
                  unavailableDates={vehicleData.unavailableDates}
                  blockedDates={vehicleData.blockedDates}
                  currencyCode={vehicleData.currencyCode}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
