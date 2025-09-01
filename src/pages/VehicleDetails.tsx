import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  MapPin, 
  CreditCard, 
  Gauge, 
  Car, 
  Settings, 
  Shield, 
  FileText, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  CheckCircle, 
  Users, 
  Phone, 
  MessageCircle,
  Palette,
  Heart,
  Share2,
  Award,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useVehicleDetails } from '@/hooks/useVehicleDetails';
import { useCustomerDetails, useUserRating } from '@/hooks/useCustomer';
import { format, addDays, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

const VehicleDetails = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading, error } = useVehicleDetails(vehicleId ? parseInt(vehicleId) : undefined);
  const { data: customer } = useCustomerDetails(vehicle?.owner);
  const { data: ownerRating } = useUserRating(vehicle?.owner);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pickupDate, setPickupDate] = useState<Date | undefined>(new Date());
  const [returnDate, setReturnDate] = useState<Date | undefined>(addDays(new Date(), 3));
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const { countryConfig } = useAuth();

  const handleBooking = () => {
    console.log('Booking vehicle:', vehicle?.vehicleId);
  };

  const calculateTotal = () => {
    if (!pickupDate || !returnDate || !vehicle) return 0;
    const days = differenceInDays(returnDate, pickupDate);
    return days * vehicle.rentCharges;
  };

  // Handle multiple images from the images string - restored original logic
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
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[80vh]">
          <div className="lg:col-span-2 bg-gray-200 rounded-md animate-pulse" />
          <div className="bg-gray-200 rounded-md animate-pulse" />
          <div className="bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Vehicle not found</h2>
          <Button onClick={() => navigate('/')} variant="outline" size="sm">
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to search
          </Button>
        </div>
      </div>
    );
  }

  const images = getImageArray(vehicle.images || '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {vehicle.make} {vehicle.model}
                </h1>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                    4.8 (124)
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {vehicle.registeredCity}
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatPrice(vehicle.rentCharges, countryConfig?.currencyCode || 'USD')}/day
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm">
                <Heart className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Horizontal Layout */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Image Gallery - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <div className="relative h-full overflow-hidden rounded-lg bg-gray-100">
                  {/* Fixed aspect ratio container for consistent dimensions */}
                  <div className="absolute inset-0 w-full h-full">
                    {images.length > 0 ? (
                      <div className="relative w-full h-full">
                        {images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${vehicle.make} ${vehicle.model} - Image ${index + 1}`}
                            className={cn(
                              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out",
                              index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                            )}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&h=600&fit=crop&crop=center';
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Car className="w-20 h-20 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">No Image Available</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation Arrows - Fixed positioning */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl z-20 backdrop-blur-sm"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl z-20 backdrop-blur-sm"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Dot Indicators - Fixed positioning */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={cn(
                            "w-2.5 h-2.5 rounded-full transition-all duration-200",
                            index === currentImageIndex 
                              ? "bg-white scale-125 shadow-lg" 
                              : "bg-white/60 hover:bg-white/80"
                          )}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Image Counter - Fixed positioning */}
                  {images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium z-20 backdrop-blur-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Info - 1 column */}
          <div className="space-y-3">
            {/* Quick Specs */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Car className="mr-1 h-3 w-3" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year</span>
                    <span className="font-medium">{new Date(vehicle.manufactureMonthYear).getFullYear()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exterior</span>
                    <span className="font-medium">{vehicle.extColor}</span>
                  </div>
                  {vehicle.intColor && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interior</span>
                      <span className="font-medium">{vehicle.intColor}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Odometer</span>
                    <span className="font-medium">{vehicle.odometer.toLocaleString()} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration</span>
                    <span className="font-medium">{vehicle.rego}</span>
                  </div>
                  {vehicle.regoExpiry && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rego Expiry</span>
                      <span className="font-medium">{new Date(vehicle.regoExpiry).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Vehicle Features
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Basic Features - Compact Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {vehicle.seatingCapacity && (
                      <div className="flex items-center text-xs text-gray-600 bg-gray-50 rounded-md px-2 py-1">
                        <Users className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                        <span className="truncate">{vehicle.seatingCapacity} seats</span>
                      </div>
                    )}
                    {vehicle.transmissionType && (
                      <div className="flex items-center text-xs text-gray-600 bg-gray-50 rounded-md px-2 py-1">
                        <Settings className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                        <span className="truncate">{vehicle.transmissionType}</span>
                      </div>
                    )}
                    {vehicle.airConditioning &&
                     vehicle.airConditioning !== 'false' &&
                     vehicle.airConditioning !== false &&
                     vehicle.airConditioning !== 'no' &&
                     vehicle.airConditioning !== 'No' &&
                     vehicle.airConditioning !== 'NO' &&
                     vehicle.airConditioning !== '0' &&
                     vehicle.airConditioning !== 0 && (
                      <div className="flex items-center text-xs text-gray-600 bg-gray-50 rounded-md px-2 py-1">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                        <span className="truncate">A/C</span>
                      </div>
                    )}
                  </div>

                  {/* Additional Features - Limited to 2 rows (6 features) */}
                  {vehicle.additionalFeatures && vehicle.additionalFeatures.trim() !== '' && (
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-medium text-gray-700">Additional Features:</div>
                        {vehicle.additionalFeatures.split(',').length > 6 && (
                          <Dialog open={isFeaturesModalOpen} onOpenChange={setIsFeaturesModalOpen}>
                            <DialogTrigger asChild>
                              <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                Show all ({vehicle.additionalFeatures.split(',').length})
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-lg flex items-center">
                                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                  All Features - {vehicle.make} {vehicle.model}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                {/* All Additional Features in Modal */}
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-3">Additional Features ({vehicle.additionalFeatures.split(',').length}):</h4>
                                  <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                                    {vehicle.additionalFeatures.split(',').map((feature, index) => (
                                      <div key={index} className="flex items-center text-sm text-gray-600 bg-blue-50 rounded-md px-3 py-2">
                                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                                        {feature.trim()}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                        {vehicle.additionalFeatures.split(',').slice(0, 6).map((feature, index) => (
                          <div key={index} className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-center truncate">
                            {feature.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment & Policy */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <CreditCard className="mr-1 h-3 w-3" />
                  Payment & Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-xs">
                  {vehicle.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium capitalize">{vehicle.paymentMethod}</span>
                    </div>
                  )}
                  {vehicle.minRentPeriod && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min. Rental Period</span>
                      <span className="font-medium">{vehicle.minRentPeriod} day{vehicle.minRentPeriod > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {vehicle.kmAllowed && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Km Allowed/Day</span>
                      <span className="font-medium">{vehicle.kmAllowed} km</span>
                    </div>
                  )}
                  {vehicle.excessKm && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Excess Km Rate</span>
                      <span className="font-medium">${vehicle.excessKm}/km</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancellation</span>
                    <span className="font-medium">24h free</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Profile */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Users className="mr-1 h-3 w-3" />
                  Listed By
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-3">
                  {/* Profile Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {customer?.profilePicture ? (
                        <img
                          src={customer.profilePicture}
                          alt={`${customer.firstName} ${customer.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    {customer?.verified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                        <CheckCircle className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 leading-tight">
                      {customer ? `${customer.firstName} ${customer.lastName}` : 'Loading...'}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      {/* Empty left side for name */}
                      <div></div>
                      
                      {/* Rating with trips on the right */}
                      {ownerRating && ownerRating.averageRating > 0 && (
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div key={star} className="relative">
                                <Star
                                  className={`h-3 w-3 ${
                                    star <= Math.floor(ownerRating.averageRating)
                                      ? 'text-amber-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                                {/* Half star overlay for partial ratings */}
                                {star - 0.5 <= ownerRating.averageRating &&
                                 star > Math.floor(ownerRating.averageRating) && (
                                  <div className="absolute inset-0 overflow-hidden w-1/2">
                                    <Star className="h-3 w-3 text-amber-400 fill-current" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs font-bold text-gray-900">
                            {ownerRating.averageRating.toFixed(1)}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {ownerRating.totalReviews} {ownerRating.totalReviews === 1 ? 'trip' : 'trips'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Call Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-9 h-9 p-0 border-gray-300 hover:bg-gray-50"
                    onClick={() => {
                      if (customer?.mobile) {
                        window.open(`tel:${customer.mobile}`, '_self');
                      }
                    }}
                  >
                    <Phone className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>

                {/* Additional Info */}
                {customer && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Trips</span>
                        <span className="font-medium text-gray-900">127</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Panel - 1 column */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Book this vehicle</span>
                  <Shield className="h-3 w-3 text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Date & Location Selection - Compact */}
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Pickup Date & Location
                    </label>
                    <Popover open={isPickupOpen} onOpenChange={setIsPickupOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left font-normal h-8"
                        >
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          <span className="text-xs">
                            {pickupDate ? format(pickupDate, "MMM dd") : "Select"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={pickupDate}
                          onSelect={(date) => {
                            setPickupDate(date);
                            setIsPickupOpen(false);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {vehicle.pickupLocation && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <MapPin className="h-2 w-2 mr-1" />
                        {vehicle.pickupLocation}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Return Date & Location
                    </label>
                    <Popover open={isReturnOpen} onOpenChange={setIsReturnOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left font-normal h-8"
                        >
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          <span className="text-xs">
                            {returnDate ? format(returnDate, "MMM dd") : "Select"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={returnDate}
                          onSelect={(date) => {
                            setReturnDate(date);
                            setIsReturnOpen(false);
                          }}
                          disabled={(date) => date <= (pickupDate || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {vehicle.dropoffLocation && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <MapPin className="h-2 w-2 mr-1" />
                        {vehicle.dropoffLocation}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown - Compact */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Daily rate</span>
                    <span className="font-medium">{formatPrice(vehicle.rentCharges, countryConfig?.currencyCode || 'USD')}</span>
                  </div>
                  {pickupDate && returnDate && (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Rental days</span>
                        <span className="font-medium">{differenceInDays(returnDate, pickupDate)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Service fee</span>
                        <span className="font-medium">{formatPrice(25, countryConfig?.currencyCode || 'USD')}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Total</span>
                        <span className="text-blue-600">{formatPrice(calculateTotal() + 25, countryConfig?.currencyCode || 'USD')}</span>
                      </div>
                    </>
                  )}
                </div>

                <Button 
                  className="w-full h-8 text-xs" 
                  onClick={handleBooking}
                  disabled={!pickupDate || !returnDate}
                >
                  <CreditCard className="mr-1 h-3 w-3" />
                  Book Now
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  <Info className="inline h-2 w-2 mr-1" />
                  Free cancellation 24h before pickup
                </div>
              </CardContent>
            </Card>

            {/* Additional Information - Separate Card */}
            {(vehicle.additionalConditions || vehicle.comments) && (
              <Card className="mt-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <FileText className="mr-1 h-3 w-3" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 max-h-32 overflow-y-auto">
                    {vehicle.additionalConditions && vehicle.additionalConditions.trim() !== '' && (
                      <div className="text-xs text-gray-600">
                        <div className="font-medium mb-1 text-gray-700">Conditions:</div>
                        <div className="text-gray-500 leading-relaxed whitespace-pre-wrap break-words">
                          {vehicle.additionalConditions}
                        </div>
                      </div>
                    )}
                    {vehicle.comments && vehicle.comments.trim() !== '' && vehicle.comments !== vehicle.additionalConditions && (
                      <div className="text-xs text-gray-600">
                        <div className="font-medium mb-1 text-gray-700">Comments:</div>
                        <div className="text-gray-500 leading-relaxed whitespace-pre-wrap break-words">
                          {vehicle.comments}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
