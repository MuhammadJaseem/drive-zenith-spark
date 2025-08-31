import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, MapPin, CreditCard, Gauge, Car, Settings, Shield } from 'lucide-react';
import { useVehicleDetails } from '@/hooks/useVehicleDetails';
import { motion } from 'framer-motion';

const VehicleDetails = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading, error } = useVehicleDetails(vehicleId ? parseInt(vehicleId) : undefined);

  const formatPrice = (price: number) => {
    return `$${(price / 100).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="aspect-video bg-muted rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Error Loading Vehicle</h1>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : 'Failed to load vehicle details'}
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vehicles
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Vehicle Not Found</h1>
            <p className="text-muted-foreground">The requested vehicle could not be found.</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vehicles
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Vehicles
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{vehicle.make} {vehicle.model}</h1>
            <p className="text-muted-foreground">Vehicle #{vehicle.vehicleId}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    {vehicle.images ? (
                      <img
                        src={vehicle.images}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&h=400&fit=crop&crop=center';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Car className="w-16 h-16 mx-auto mb-4" />
                          <p className="text-lg font-medium">No Image Available</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge variant={vehicle.isavailable ? "success" : "destructive"}>
                        {vehicle.isavailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vehicle Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Car className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Make & Model</p>
                        <p className="text-muted-foreground">{vehicle.make} {vehicle.model}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Manufacture Date</p>
                        <p className="text-muted-foreground">{formatDate(vehicle.manufactureMonthYear)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground flex items-center justify-center text-xs font-bold text-muted-foreground">
                        E
                      </div>
                      <div>
                        <p className="font-medium">Exterior Color</p>
                        <p className="text-muted-foreground">{vehicle.extColor || 'Not specified'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground flex items-center justify-center text-xs font-bold text-muted-foreground">
                        I
                      </div>
                      <div>
                        <p className="font-medium">Interior Color</p>
                        <p className="text-muted-foreground">{vehicle.intColor || 'Not specified'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Registration</p>
                        <p className="text-muted-foreground">{vehicle.rego || 'Not specified'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Rego Expiry</p>
                        <p className="text-muted-foreground">{formatDate(vehicle.regoExpiry)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Gauge className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Odometer</p>
                        <p className="text-muted-foreground">{vehicle.odometer?.toLocaleString() || '0'} km</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Payment Method</p>
                        <p className="text-muted-foreground">{vehicle.paymentMethod || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {vehicle.comments && (
                    <>
                      <Separator />
                      <div>
                        <p className="font-medium mb-2">Comments</p>
                        <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                          {vehicle.comments}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Rental Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(vehicle.rentCharges)}
                    </div>
                    <p className="text-muted-foreground">per day</p>
                  </div>
                  <Button className="w-full" size="lg">
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Location Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Location & Pickup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Registered Location</p>
                      <p className="text-muted-foreground text-sm">
                        {vehicle.registeredCity}, {vehicle.registeredCountry}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-sm">Pickup Location</p>
                      <p className="text-muted-foreground text-sm">
                        {vehicle.pickupLocation || 'Not specified'}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-sm">Dropoff Location</p>
                      <p className="text-muted-foreground text-sm">
                        {vehicle.dropoffLocation || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
