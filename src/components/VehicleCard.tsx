import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Calendar, Heart, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

interface Vehicle {
  vehicleId: number;
  make: string;
  model: string;
  rentCharges: number;
  manufactureMonthYear: string;
  extColor: string;
  intColor: string;
  rego: string;
  odometer: number;
  isRented: boolean;
  images: string;
  resourcePath: string;
  registeredCity: string;
  registeredCountry: string;
  pickupLocation: string;
  dropoffLocation: string;
  paymentMethod: string;
  comments: string;
}

interface Rating {
  averageRating: number;
  totalReviews: number;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  rating: Rating | null;
  unavailableDates: string[];
  blockedDates: Array<{ startDate: string; endDate: string }>;
}

export default function VehicleCard({ vehicle, rating, unavailableDates, blockedDates }: VehicleCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  
  const formatPrice = (price: number) => {
    // Assuming price is in cents, convert to dollars
    return `$${(price / 100).toLocaleString()}`;
  };

  const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const isAvailable = !vehicle.isRented && unavailableDates.length === 0 && blockedDates.length === 0;

  // Generate unique placeholder based on vehicle data
  const generatePlaceholderGradient = () => {
    const colors = [
      'from-blue-400 to-purple-500',
      'from-green-400 to-blue-500',
      'from-pink-400 to-red-500',
      'from-yellow-400 to-orange-500',
      'from-indigo-400 to-purple-500',
      'from-teal-400 to-blue-500',
    ];
    const index = vehicle.vehicleId % colors.length;
    return colors[index];
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <Card className="overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          {/* Car Image */}
          <div className="aspect-video overflow-hidden">
            {vehicle.resourcePath ? (
              <motion.img
                src={vehicle.images.split(';')[0]}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&h=240&fit=crop&crop=center';
                }}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${generatePlaceholderGradient()} flex items-center justify-center`}>
                <div className="text-center text-white">
                  <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {vehicle.make.charAt(0)}{vehicle.model.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{vehicle.make} {vehicle.model}</p>
                </div>
              </div>
            )}
          </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isAvailable && (
            <Badge variant="success" className="text-xs font-medium">
              Available
            </Badge>
          )}
          {!isAvailable && (
            <Badge variant="destructive" className="text-xs font-medium">
              Unavailable
            </Badge>
          )}
        </div>

        {/* Save Button */}
        <motion.button
          className="absolute top-3 right-12 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full items-center justify-center hidden"
          onClick={(e) => {
            e.stopPropagation();
            handleSaveToggle();
          }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            animate={{ scale: isSaved ? 1.2 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Heart 
              className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
            />
          </motion.div>
        </motion.button>

        {/* Rating */}
        {rating && rating.averageRating !== null && (
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{rating.averageRating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({rating.totalReviews})</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Vehicle Info */}
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground">
              {getYear(vehicle.manufactureMonthYear)} • {vehicle.extColor}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{vehicle.registeredCity}, {vehicle.registeredCountry}</span>
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{vehicle.odometer.toLocaleString()} km</span>
            </div>
            {vehicle.paymentMethod && vehicle.paymentMethod.trim() !== '' ? (
              <div className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                <span>{vehicle.paymentMethod}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                <span>Cash</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-foreground">
            {formatPrice(vehicle.rentCharges)}
          </div>
          <div className="text-xs text-muted-foreground">per day</div>
        </div>
        <Button variant="accent" className="px-6">
          View Details
        </Button>
      </CardFooter>
    </Card>
    </motion.div>
  );
}