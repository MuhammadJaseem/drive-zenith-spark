import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  Eye,
  X,
  Clock,
  Fuel,
  DollarSign
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { format, addDays, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface StaticVehicle {
  vehicleimage: string;
  car: string;
  seats: number;
  transmission: string;
  with_driver: string;
  self_drive?: string;
  overtime: string;
  fuel_policy: string;
  note: string;
  price: { old: number | null; new: number | null; unit: string };
  free_cancellation: boolean;
  services: {
    fuel_cost: string;
    base_fare: string;
    latenight_offer: string;
    overtime: string;
  };
}

const StaticVehicleDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract slug from route parameters
  const slug = params.vehicleSlug || '';
  
  console.log('StaticVehicleDetails loaded!');
  console.log('Route params:', params);
  console.log('Extracted slug:', slug);
  console.log('Location state:', location.state);
  
  // Try to get vehicle data from navigation state first, then from localStorage
  let vehicle = location.state?.vehicle as StaticVehicle;
  let currencyCode = location.state?.currencyCode || 'PKR';
  
  console.log('Vehicle from state:', vehicle);
  
  // If no vehicle data in state, try to get from localStorage
  if (!vehicle) {
    try {
      const storedData = localStorage.getItem('staticVehicleData');
      console.log('Stored data from localStorage:', storedData);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('Parsed data:', parsedData);
        // Check if data is not too old (24 hours)
        if (Date.now() - parsedData.timestamp < 24 * 60 * 60 * 1000) {
          vehicle = parsedData.vehicle;
          currencyCode = parsedData.currencyCode;
          console.log('Vehicle loaded from localStorage:', vehicle);
        } else {
          // Clear old data
          localStorage.removeItem('staticVehicleData');
          console.log('Old data cleared from localStorage');
        }
      }
    } catch (error) {
      console.error('Error parsing stored vehicle data:', error);
      localStorage.removeItem('staticVehicleData');
    }
  }

  // If still no vehicle data, create a fallback demo vehicle based on the slug
  if (!vehicle && slug) {
    const vehicleName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    vehicle = {
      vehicleimage: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&h=600&fit=crop&crop=center',
      car: vehicleName,
      seats: 5,
      transmission: 'Automatic',
      with_driver: 'Available',
      self_drive: 'Available',
      overtime: '$10/hour',
      fuel_policy: 'Full to Full',
      note: 'Demo vehicle for URL testing',
      price: { old: 120, new: 100, unit: 'day' },
      free_cancellation: true,
      services: {
        fuel_cost: 'Included',
        base_fare: '$100/day',
        latenight_offer: 'Available',
        overtime: '$10/hour'
      }
    };
    console.log('Created fallback vehicle:', vehicle);
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pickupDate, setPickupDate] = useState<Date | undefined>(new Date());
  const [returnDate, setReturnDate] = useState<Date | undefined>(addDays(new Date(), 3));
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);

  const handleBooking = () => {
    console.log('Booking static vehicle:', vehicle?.car);
  };

  const calculateTotal = () => {
    if (!pickupDate || !returnDate || !vehicle?.price.new) return 0;
    const days = differenceInDays(returnDate, pickupDate);
    return days * vehicle.price.new;
  };

  // Handle single image from vehicle
  const getImageArray = (imageString: string) => {
    return imageString ? [imageString] : [];
  };

  const nextImage = () => {
    // For static vehicles, we only have one image, so no navigation needed
  };

  const prevImage = () => {
    // For static vehicles, we only have one image, so no navigation needed
  };

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Vehicle not found</h2>
          <p className="text-gray-600 mb-4">The vehicle details could not be loaded. Please try again.</p>
          <Button onClick={() => navigate('/')} variant="outline" size="sm">
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to search
          </Button>
        </div>
      </div>
    );
  }

  // Clean up stored data after successful load
  useEffect(() => {
    if (vehicle) {
      localStorage.removeItem('staticVehicleData');
      
      // Update page title for SEO
      document.title = `Rent ${vehicle.car} - Fleetmate Rental | Car Rental Services`;
      
      // Update meta description for SEO
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Rent ${vehicle.car} from $${vehicle.price.new}/day. ${vehicle.seats} seats, ${vehicle.transmission} transmission. Free cancellation available. Book now!`
        );
      } else {
        // Create meta description if it doesn't exist
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = `Rent ${vehicle.car} from $${vehicle.price.new}/day. ${vehicle.seats} seats, ${vehicle.transmission} transmission. Free cancellation available. Book now!`;
        document.head.appendChild(meta);
      }
      
      // Add structured data for SEO
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": vehicle.car,
        "description": `Rent ${vehicle.car} - ${vehicle.seats} seats, ${vehicle.transmission} transmission`,
        "image": vehicle.vehicleimage,
        "offers": {
          "@type": "Offer",
          "price": vehicle.price.new,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        "brand": {
          "@type": "Brand",
          "name": vehicle.car.split(' ')[0]
        }
      };
      
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [vehicle]);

  const images = getImageArray(vehicle.vehicleimage);

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
                  {vehicle.car}
                </h1>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    Karachi, Pakistan
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatPrice(vehicle.price.new || 0, currencyCode)}/day
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
                        <img
                          src={images[0]}
                          alt={vehicle.car}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&h=600&fit=crop&crop=center';
                          }}
                        />
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
                    <span className="text-gray-600">Make & Model</span>
                    <span className="font-medium">{vehicle.car}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transmission</span>
                    <span className="font-medium">{vehicle.transmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats</span>
                    <span className="font-medium">{vehicle.seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">With Driver</span>
                    <span className="font-medium">{vehicle.with_driver}</span>
                  </div>
                  {vehicle.self_drive && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Self Drive</span>
                      <span className="font-medium">{vehicle.self_drive}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Settings className="mr-1 h-3 w-3" />
                  Services & Charges
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Policy</span>
                    <span className="font-medium">{vehicle.fuel_policy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overtime</span>
                    <span className="font-medium">{vehicle.overtime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Free Cancellation</span>
                    <span className="font-medium">{vehicle.free_cancellation ? 'Yes' : 'No'}</span>
                  </div>
                </div>
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
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <MapPin className="h-2 w-2 mr-1" />
                      Karachi, Pakistan
                    </div>
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
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <MapPin className="h-2 w-2 mr-1" />
                      Karachi, Pakistan
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown - Compact */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Daily rate</span>
                    <span className="font-medium">{formatPrice(vehicle.price.new || 0, currencyCode)}</span>
                  </div>
                  {pickupDate && returnDate && (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Rental days</span>
                        <span className="font-medium">{differenceInDays(returnDate, pickupDate)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Service fee</span>
                        <span className="font-medium">{formatPrice(25, currencyCode)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Total</span>
                        <span className="text-blue-600">{formatPrice(calculateTotal() + 25, currencyCode)}</span>
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

            {/* Additional Services */}
            <Card className="mt-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <FileText className="mr-1 h-3 w-3" />
                  Additional Services
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: Fuel, label: "Fuel Cost", value: vehicle.services?.fuel_cost },
                      { icon: Car, label: "Base Fare", value: vehicle.services?.base_fare },
                      { icon: Clock, label: "Latenight Offer", value: vehicle.services?.latenight_offer },
                      { icon: DollarSign, label: "Overtime", value: vehicle.services?.overtime }
                    ].map((service, index) => (
                      <div key={service.label} className="flex items-center text-xs text-gray-600 bg-gray-50 rounded-md px-2 py-1">
                        <service.icon className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                        <span className="truncate">{service.value || "N/A"}</span>
                      </div>
                    ))}
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

export default StaticVehicleDetails;
