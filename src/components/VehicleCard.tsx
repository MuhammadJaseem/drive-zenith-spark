import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Calendar, Users } from 'lucide-react';

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
  rating: Rating;
  unavailableDates: string[];
  blockedDates: Array<{ startDate: string; endDate: string }>;
}

export default function VehicleCard({ vehicle, rating, unavailableDates, blockedDates }: VehicleCardProps) {
  const formatPrice = (price: number) => {
    // Assuming price is in cents, convert to dollars
    return `$${(price / 100).toLocaleString()}`;
  };

  const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const isAvailable = !vehicle.isRented && unavailableDates.length === 0 && blockedDates.length === 0;

  return (
    <Card className="overflow-hidden group cursor-pointer">
      <div className="relative">
        {/* Car Image */}
        <div className="aspect-video bg-gradient-to-br from-secondary to-muted rounded-t-xl overflow-hidden">
          {vehicle.resourcePath ? (
            <img
              src={vehicle.resourcePath}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&h=240&fit=crop&crop=center';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
                <p className="text-sm">{vehicle.make} {vehicle.model}</p>
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

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{rating.averageRating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({rating.totalReviews})</span>
        </div>
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
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{vehicle.paymentMethod}</span>
            </div>
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
  );
}