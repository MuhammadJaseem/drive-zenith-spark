import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useVehicleDetails } from '@/hooks/useVehicleDetails';
import { format, addDays, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

const VehicleDetails = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading, error } = useVehicleDetails(vehicleId ? parseInt(vehicleId) : undefined);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pickupDate, setPickupDate] = useState<Date | undefined>(new Date());
  const [returnDate, setReturnDate] = useState<Date | undefined>(addDays(new Date(), 3));
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-120px)]">
          
          {/* Image Gallery - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <div className="relative h-full overflow-hidden rounded-lg">
                  {/* Single Image Display with smooth fade transition */}
                  {images.length > 0 ? (
                    <img
                      key={currentImageIndex} // This forces re-render for smooth transition
                      src={images[currentImageIndex]}
                      alt={`${vehicle.make} ${vehicle.model} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&h=600&fit=crop&crop=center';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Car className="w-20 h-20 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No Image Available</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl z-10"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl z-10"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}

                  {/* Dot Indicators */}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all duration-200",
                            index === currentImageIndex 
                              ? "bg-white scale-125" 
                              : "bg-white/60 hover:bg-white/80"
                          )}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium z-10">
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
                  Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <Gauge className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">{vehicle.odometer} km</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Auto</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">5 seats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Palette className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">{vehicle.extColor}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs py-0 px-2 h-5">
                    Automatic
                  </Badge>
                  <Badge variant="secondary" className="text-xs py-0 px-2 h-5">
                    Petrol
                  </Badge>
                  <Badge variant="outline" className="text-xs py-0 px-2 h-5">
                    A/C
                  </Badge>
                  <Badge variant="outline" className="text-xs py-0 px-2 h-5">
                    GPS
                  </Badge>
                </div>
                
                <div className="mt-3 space-y-1">
                  <div className="flex items-center text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                    Air Conditioning
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                    GPS Navigation
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                    Bluetooth
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Host */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Shield className="mr-1 h-3 w-3" />
                  Host
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs font-medium">John Smith</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Star className="h-2 w-2 text-yellow-400 fill-current mr-1" />
                        4.9 • 89 trips
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                      <Phone className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Panel - 1 column */}
          <div>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Book this vehicle</span>
                  <Shield className="h-3 w-3 text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Date Selection - Compact */}
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Pickup
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
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Return
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
                        <span className="text-gray-600">Days</span>
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

                {/* Trust Signals */}
                <div className="mt-4 pt-3 border-t">
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-gray-600">
                      <Shield className="h-3 w-3 text-green-500 mr-2" />
                      Verified owner
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                      Insurance included
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <Award className="h-3 w-3 text-blue-500 mr-2" />
                      24/7 roadside assistance
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
