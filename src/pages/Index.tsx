import React, { useState } from 'react';
import Header from '@/components/Header';
import VehicleCard from '@/components/VehicleCard';
import SearchFilters from '@/components/SearchFilters';
import { useVehicles, VehicleFilters } from '@/hooks/useVehicles';
import { Loader2, Car, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';

const Index = () => {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const { data: vehicles, isLoading, error, refetch } = useVehicles(filters);

  const handleFiltersChange = (newFilters: VehicleFilters) => {
    setFilters(newFilters);
  };

  // Skeleton Card Component for individual loading
  const SkeletonCard = ({ index }: { index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden shadow-lg">
        {/* Image skeleton */}
        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
          {/* Animated shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.2,
            }}
          />

          {/* Car icon placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.3,
              }}
            >
              <Car className="w-12 h-12 text-gray-400" />
            </motion.div>
          </div>

          {/* Pulsing dots */}
          <div className="absolute bottom-3 left-3 flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white/60 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2 + index * 0.1,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Title skeleton */}
            <div className="space-y-2">
              <motion.div
                className="h-5 bg-gray-200 rounded"
                animate={{
                  backgroundColor: ['#e5e7eb', '#f3f4f6', '#e5e7eb'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.1,
                }}
              />
              <motion.div
                className="h-4 bg-gray-200 rounded w-3/4"
                animate={{
                  backgroundColor: ['#e5e7eb', '#f3f4f6', '#e5e7eb'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.15,
                }}
              />
            </div>

            {/* Location skeleton */}
            <motion.div
              className="flex items-center gap-2"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.2,
              }}
            >
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded flex-1" />
            </motion.div>

            {/* Details skeleton */}
            <div className="flex items-center gap-4">
              <motion.div
                className="flex items-center gap-1"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.25,
                }}
              >
                <div className="w-3 h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </motion.div>
              <motion.div
                className="flex items-center gap-1"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.3,
                }}
              >
                <div className="w-3 h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-12" />
              </motion.div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="space-y-1">
            <motion.div
              className="h-6 bg-gray-200 rounded w-20"
              animate={{
                backgroundColor: ['#e5e7eb', '#f3f4f6', '#e5e7eb'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.35,
              }}
            />
            <motion.div
              className="h-3 bg-gray-200 rounded w-12"
              animate={{
                backgroundColor: ['#e5e7eb', '#f3f4f6', '#e5e7eb'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.4,
              }}
            />
          </div>
          <motion.div
            className="h-9 bg-gray-200 rounded w-24"
            animate={{
              backgroundColor: ['#e5e7eb', '#f3f4f6', '#e5e7eb'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.45,
            }}
          />
        </CardFooter>
      </Card>
    </motion.div>
  );

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

          {/* Loading State - Individual Card Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <SkeletonCard key={index} index={index} />
              ))}
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
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {vehicles.map((vehicleData, index) => (
                <motion.div
                  key={vehicleData.vehicle.vehicleId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <VehicleCard
                    vehicle={vehicleData.vehicle}
                    rating={vehicleData.rating}
                    unavailableDates={vehicleData.unavailableDates}
                    blockedDates={vehicleData.blockedDates}
                    currencyCode={vehicleData.currencyCode}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
