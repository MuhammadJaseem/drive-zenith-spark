import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Settings, Clock, Fuel, CheckCircle, DollarSign, AlertTriangle, X, Car, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface StaticVehicleCardProps {
  vehicle: StaticVehicle;
}

export default function StaticVehicleCard({ vehicle }: StaticVehicleCardProps) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Create URL slug from vehicle name
  const createVehicleSlug = (carName: string) => {
    return carName.toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '') // Remove special characters
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  const handleImageClick = () => {
    const slug = createVehicleSlug(vehicle.car);
    console.log('Vehicle name:', vehicle.car);
    console.log('Generated slug:', slug);
    console.log('Navigation path:', `/rent-a-${slug}`);
    
    // Store vehicle data in localStorage for URL rewriting
    const dataToStore = {
      vehicle,
      currencyCode: 'PKR',
      timestamp: Date.now()
    };
    localStorage.setItem('staticVehicleData', JSON.stringify(dataToStore));
    
    // Use URL rewriting with slug
    navigate(`/rent-a-${slug}`);
  };

  const handleViewDetails = () => {
    setShowModal(true);
  };

  const handleWithDriver = () => {
    console.log('With Driver selected for:', vehicle.car);
    // Add your with driver logic here
  };

  const handleSelfDrive = () => {
    console.log('Self Drive selected for:', vehicle.car);
    // Add your self drive logic here
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="w-full max-w-lg mx-auto"
      >
        <Card className="overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-200 border-2 border-purple-600 bg-white rounded-lg relative">
          {/* Best Price Badge */}
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-purple-600 text-white text-xs font-semibold px-2.5 py-1 rounded-sm">
              BEST PRICE RATE SELECTED!
            </div>
          </div>

          {/* Vehicle Image */}
          <div className="relative">
            <div
              className="cursor-pointer"
              onClick={handleImageClick}
            >
              {vehicle.vehicleimage ? (
                <div className="w-full h-48 relative overflow-hidden bg-gray-50">
                  <img
                    src={vehicle.vehicleimage}
                    alt={vehicle.car}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 p-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-48 bg-gray-50 flex items-center justify-center">
                            <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                              <span class="text-xl font-semibold text-gray-600">
                                ${vehicle.car.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-50 hover:scale-105 transition-transform duration-300">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xl font-semibold text-gray-600">
                      {vehicle.car.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4">
            {/* Vehicle Name */}
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-3">
              {vehicle.car}
            </h3>

            {/* Two Column Layout - Left: Specs & Driver Options, Right: Price */}
            <div className="flex justify-between items-start mb-4">
              {/* Left Column - Specs and Driver Options */}
              <div className="flex-1">
                {/* Vehicle Specs */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{vehicle.seats} Seats</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    <span>{vehicle.transmission}</span>
                  </div>
                </div>

                {/* Driver Options */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>With Driver</span>
                    <span className="ml-auto text-gray-900 font-medium">{vehicle.with_driver}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Car className="w-4 h-4 text-gray-500" />
                    <span>Self Drive</span>
                    <span className="ml-auto text-gray-900 font-medium">{vehicle.self_drive || '24hrs'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>Overtime:</span>
                    <span className="ml-auto text-gray-900 font-medium">{vehicle.overtime}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Price Section */}
              <div className="text-right ml-4">
                {vehicle.price.old && vehicle.price.new && vehicle.price.old > vehicle.price.new && (
                  <div className="text-sm text-gray-400 line-through">
                    {vehicle.price.old.toLocaleString()}
                  </div>
                )}
                <div className="text-2xl font-bold text-purple-600">
                  {vehicle.price.new ? vehicle.price.new.toLocaleString() : '8,500'}
                </div>
                <div className="text-sm text-gray-600">PKR/day</div>
              </div>
            </div>

            {/* Fuel Policy */}
            <div className="text-sm text-gray-600 leading-snug mb-2">
              Refill fuel at the end of the day or pay PKR {vehicle.fuel_policy.match(/\d+/)?.[0] || '40'}/KM
            </div>

            {/* Excluding charges note */}
            <div className="text-sm text-gray-600 mb-4">
              Excluding fuel & overtime charges
            </div>

            {/* Two Column Layout - Left: Empty, Right: FREE CANCELLATION */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1"></div>
              
              {/* Right Column - Free Cancellation */}
              <div className="text-right ml-4">
                <div className="text-purple-600 font-bold text-sm mb-1">FREE CANCELLATION</div>
                <div className="flex items-baseline gap-2 justify-end">
                  <span className="text-2xl font-bold text-purple-600">
                    {vehicle.price.new ? vehicle.price.new.toLocaleString() : '8,500'}
                  </span>
                  <span className="text-sm text-gray-600">PKR/day</span>
                </div>
              </div>
            </div>

            {/* Buttons Section */}
            <div className="space-y-3">
              {/* Horizontal Button Layout - Side by Side */}
              <div className="grid grid-cols-2 gap-3">
                {/* Main Action Button */}
                <Button
                  className="h-11 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-md"
                  onClick={handleWithDriver}
                >
                  With Driver
                </Button>

                {/* Secondary Action Button */}
                <Button
                  variant="outline"
                  className="h-11 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold text-sm rounded-md"
                  onClick={handleSelfDrive}
                >
                  Self Drive
                </Button>
              </div>

              {/* View Details Link */}
              <div className="text-center">
                <button 
                  className="text-sm text-purple-600 hover:text-purple-700 underline cursor-pointer font-medium"
                  onClick={handleViewDetails}
                >
                  View Detail
                </button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Vehicle Details Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[80vh] p-0 [&>button]:hidden bg-white border border-gray-300 shadow-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94] // Smooth cubic-bezier easing
            }}
          >
            {/* Custom Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors duration-200"
            >
              <X className="w-4 h-4 text-gray-600 hover:text-gray-800" />
            </button>

            <div className="p-7">
              <DialogHeader className="pb-5">
                <DialogTitle className="text-xl font-bold text-black text-center">
                  Excluding Charges Details
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <motion.div
                  className="bg-white rounded-lg p-6 border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <div className="grid grid-cols-2 gap-4 font-semibold text-sm mb-6 text-gray-800">
                    <span className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-gray-600" />
                      Services
                    </span>
                    <span className="text-right flex items-center justify-end gap-2">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                      Amount
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { icon: Fuel, label: "Fuel Cost", value: vehicle.services?.fuel_cost },
                      { icon: Car, label: "Base Fare", value: vehicle.services?.base_fare },
                      { icon: Clock, label: "Latenight Offer", value: vehicle.services?.latenight_offer },
                      { icon: DollarSign, label: "Overtime", value: vehicle.services?.overtime }
                    ].map((service, index) => (
                      <motion.div
                        key={service.label}
                        className="grid grid-cols-2 gap-4 text-sm py-4 px-5 rounded-lg bg-white border border-gray-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.2 + index * 0.1,
                          duration: 0.3,
                          ease: "easeOut"
                        }}
                      >
                        <span className="flex items-center gap-3 font-medium text-gray-900">
                          <service.icon className="w-4 h-4 text-gray-600" />
                          {service.label}
                        </span>
                        <span className="text-right font-semibold text-gray-900">{service.value || "N/A"}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}