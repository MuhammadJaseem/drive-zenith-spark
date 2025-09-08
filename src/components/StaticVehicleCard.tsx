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
    const index = vehicle.car.length % colors.length;
    return colors[index];
  };

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

  return (
    <>
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <Card className="overflow-hidden group shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 bg-white">
          <div className="relative">
            {/* Vehicle Image or Placeholder */}
            <div
              className="cursor-pointer"
              onClick={handleImageClick}
            >
              {vehicle.vehicleimage ? (
                <div className="w-full h-44 relative overflow-hidden">
                  <img
                    src={vehicle.vehicleimage}
                    alt={vehicle.car}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-44 bg-gray-100 flex items-center justify-center relative">
                            <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                              <span class="text-lg font-semibold text-gray-600">
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
                <div className="w-full h-44 flex items-center justify-center bg-gray-100 relative hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-600">
                      {vehicle.car.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Vehicle Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 leading-tight">
                    {vehicle.car}
                  </h3>
                </div>
                <div className="text-right">
                  {vehicle.price.old && vehicle.price.new && vehicle.price.old > vehicle.price.new && (
                    <div className="text-xs text-gray-400 line-through">
                      {vehicle.price.old} PKR/day
                    </div>
                  )}
                  <div className="text-lg font-bold text-purple-600">
                    {vehicle.price.new ? `${vehicle.price.new}` : '8,500'}
                    <span className="text-sm font-normal text-gray-500 ml-1">PKR/day</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Details Row */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{vehicle.seats} Seats</span>
                </div>
                <div className="flex items-center gap-1">
                  <Settings className="w-4 h-4" />
                  <span>{vehicle.transmission}</span>
                </div>
              </div>

              {/* Service Options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">With Driver</span>
                  </div>
                  <span className="text-gray-700">{vehicle.with_driver}</span>
                </div>
                
                {vehicle.self_drive && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Self Drive</span>
                    </div>
                    <span className="text-gray-700">{vehicle.self_drive}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Overtime:</span>
                  </div>
                  <span className="text-gray-700">{vehicle.overtime}</span>
                </div>
              </div>

              {/* Fuel Policy Note */}
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                Refill fuel at the end of the day or pay PKR {vehicle.fuel_policy.match(/\d+/)?.[0] || '40'}/KM
              </div>

              {/* FREE CANCELLATION */}
              {vehicle.free_cancellation && (
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-purple-700 font-medium text-sm mb-1">FREE CANCELLATION</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-purple-700">
                      {vehicle.price.new ? `${vehicle.price.new}` : '8,500'}
                    </span>
                    <span className="text-sm text-purple-600">PKR/day</span>
                  </div>
                </div>
              )}

              {/* Excluding charges note */}
              <div className="text-xs text-gray-500">
                Excluding fuel & overtime charges
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <div className="w-full space-y-3">
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="accent"
                  className="flex-1 h-10 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm"
                  onClick={handleViewDetails}
                >
                  With Driver
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-10 border-gray-300 text-gray-700 font-medium text-sm"
                  onClick={handleViewDetails}
                >
                  Self Drive
                </Button>
              </div>

              {/* View Details Link */}
              <button 
                className="text-sm text-purple-600 hover:text-purple-700 underline text-center cursor-pointer w-full"
                onClick={handleViewDetails}
              >
                View Detail
              </button>
            </div>
          </CardFooter>
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
