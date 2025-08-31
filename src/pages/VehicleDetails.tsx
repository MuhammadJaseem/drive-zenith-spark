import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, MapPin, CreditCard, Gauge, Car, Settings, Shield, Palette, FileText, Info, ChevronLeft, ChevronRight, Star, CheckCircle, Clock, Users } from 'lucide-react';
import { useVehicleDetails } from '@/hooks/useVehicleDetails';
import { motion } from 'framer-motion';

const VehicleDetails = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading, error } = useVehicleDetails(vehicleId ? parseInt(vehicleId) : undefined);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number) => {
    return `$${(price / 100).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getYear = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear().toString();
  };

  // Handle multiple images from the images string
  const getImageArray = (imagesString: string) => {
    if (!imagesString) return [];
    return imagesString.split(';').filter(img => img.trim() !== '');
  };

  const nextImage = () => {
    if (vehicle?.images) {
      const images = getImageArray(vehicle.images);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (vehicle?.images) {
      const images = getImageArray(vehicle.images);
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto p-4">
          <div className="animate-pulse">
            <div className="h-12 bg-white rounded-lg shadow-sm mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="aspect-[4/3] bg-muted rounded-xl"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-white rounded-xl shadow-sm"></div>
                <div className="h-48 bg-white rounded-xl shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Error Loading Vehicle</h1>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : 'Failed to load vehicle details'}
            </p>
            <Button onClick={() => navigate('/')} variant="accent">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Vehicle Not Found</h1>
            <p className="text-muted-foreground">The requested vehicle could not be found.</p>
            <Button onClick={() => navigate('/')} variant="accent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vehicles
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const images = getImageArray(vehicle.images);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Vehicles
          </Button>
        </motion.div>

        {/* Main Content - Modern Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Image Gallery (2/3 width - larger) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Main Image Display */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl bg-white">
              {images.length > 0 ? (
                <img
                  src={images[currentImageIndex]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&h=600&fit=crop&crop=center';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Car className="w-24 h-24 mx-auto mb-4" />
                    <p className="text-xl font-medium">No Image Available</p>
                  </div>
                </div>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Availability Badge */}
              <div className="absolute top-4 right-4">
                <Badge variant={vehicle.isavailable ? "success" : "destructive"} className="text-sm px-4 py-2 shadow-lg">
                  {vehicle.isavailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Vehicle Information (1/3 width - compact) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Title and Price Card */}
            <Card className="bg-white shadow-xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">
                  {vehicle.make} {vehicle.model}
                </h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{formatPrice(vehicle.rentCharges)}</span>
                  <span className="text-base opacity-90">per day</span>
                </div>
              </div>
              <CardContent className="p-6">
                <Button variant="accent" className="w-full py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all" size="lg">
                  Book Now
                </Button>
              </CardContent>
            </Card>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white p-4 rounded-xl shadow-lg border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Year</p>
                    <p className="font-bold text-sm">{getYear(vehicle.manufactureMonthYear)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-lg border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Gauge className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Mileage</p>
                    <p className="font-bold text-sm">{vehicle.odometer?.toLocaleString() || '0'} km</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-lg border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Location</p>
                    <p className="font-bold text-sm">{vehicle.registeredCity}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-lg border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Payment</p>
                    <p className="font-bold text-sm">{vehicle.paymentMethod || 'Cash'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Details Card */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="w-5 h-5 text-primary" />
                  Vehicle Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-muted-foreground">Exterior Color</span>
                  <span className="font-medium">{vehicle.extColor || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-muted-foreground">Interior Color</span>
                  <span className="font-medium">{vehicle.intColor || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-muted-foreground">Registration</span>
                  <span className="font-medium">{vehicle.rego || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Rego Expiry</span>
                  <span className="font-medium">{formatDate(vehicle.regoExpiry)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Rental Terms Card */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  Rental Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Free cancellation up to 24h</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Insurance included</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>24/7 roadside assistance</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pickup</span>
                    <span className="font-medium">{vehicle.pickupLocation || 'TBD'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dropoff</span>
                    <span className="font-medium">{vehicle.dropoffLocation || 'TBD'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes Section - Only if comments exist */}
            {vehicle.comments && (
              <Card className="bg-white shadow-lg border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-primary" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {vehicle.comments}
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
