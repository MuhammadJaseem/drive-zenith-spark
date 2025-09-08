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
    navigate(`/rent-a-${slug}`, {
      state: {
        vehicle,
        currencyCode: 'PKR'
      }
    });
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
        <Card className="overflow-hidden group shadow-none hover:shadow-[0_4px_12px_-2px_rgba(var(--primary),0.15)] transition-all duration-200 border-2 border-transparent hover:border-accent/30 focus-within:border-accent/30">
          <div className="relative">
            {/* Vehicle Image or Placeholder */}
            <div
              className="cursor-pointer"
              onClick={handleImageClick}
            >
              {vehicle.vehicleimage ? (
                <div className="w-full h-48 relative overflow-hidden">
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
                          <div class="w-full h-48 bg-gradient-to-br ${generatePlaceholderGradient()} flex items-center justify-center relative">
                            <div class="absolute inset-0 bg-black/10"></div>
                            <div class="text-center text-white z-10">
                              <div class="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <span class="text-2xl font-bold">
                                  ${vehicle.car.split(' ')[0].charAt(0)}${vehicle.car.split(' ')[1]?.charAt(0) || ''}
                                </span>
                              </div>
                              <p class="text-base font-semibold">${vehicle.car}</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className={`w-full h-48 bg-gradient-to-br ${generatePlaceholderGradient()} flex items-center justify-center relative hover:scale-105 transition-transform duration-300`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="text-center text-white z-10">
                    <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-2xl font-bold">
                        {vehicle.car.split(' ')[0].charAt(0)}{vehicle.car.split(' ')[1]?.charAt(0) || ''}
                      </span>
                    </div>
                    <p className="text-base font-semibold">{vehicle.car}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Best Price Badge */}
            {vehicle.price.old && vehicle.price.new && vehicle.price.old > vehicle.price.new && (
              <div className="absolute top-3 left-3 bg-accent text-accent-foreground rounded-full px-3 py-1 shadow-md">
                <span className="text-xs font-semibold">BEST PRICE!</span>
              </div>
            )}

            {/* Free Cancellation Badge */}
            {vehicle.free_cancellation && (
              <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-semibold">Free Cancel</span>
              </div>
            )}
          </div>

          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Vehicle Info */}
              <div>
                <h3 className="text-xl font-bold text-foreground leading-tight">
                  {vehicle.car}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {vehicle.transmission} • {vehicle.seats} seats
                </p>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                  <div>
                    <span className="text-muted-foreground block text-xs">With Driver</span>
                    <span className="font-semibold text-foreground">{vehicle.with_driver}</span>
                  </div>
                </div>

                {vehicle.self_drive && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
                    <div>
                      <span className="text-muted-foreground block text-xs">Self Drive</span>
                      <span className="font-semibold text-foreground">{vehicle.self_drive}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-accent flex-shrink-0" />
                  <div>
                    <span className="text-muted-foreground block text-xs">Overtime</span>
                    <span className="font-semibold text-foreground">{vehicle.overtime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-accent flex-shrink-0" />
                  <div>
                    <span className="text-muted-foreground block text-xs">Fuel Policy</span>
                    <span className="font-semibold text-foreground leading-tight">Pay PKR {vehicle.fuel_policy.match(/\d+/)?.[0] || '40'}/KM</span>
                  </div>
                </div>
              </div>

              {/* Price Section - Prominent */}
              <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    {vehicle.price.old && vehicle.price.new && vehicle.price.old !== vehicle.price.new && (
                      <div className="text-sm text-muted-foreground line-through mb-1">
                        {vehicle.price.old} PKR/day
                      </div>
                    )}
                    <div className="text-3xl font-bold text-foreground">
                      {vehicle.price.new ? `${vehicle.price.new}` : 'Call for Price'}
                      {vehicle.price.new && <span className="text-base font-normal text-muted-foreground ml-1">PKR/day</span>}
                    </div>
                    {vehicle.price.old && vehicle.price.new && vehicle.price.old > vehicle.price.new && (
                      <div className="text-sm text-green-600 font-medium mt-1">
                        Save {vehicle.price.old - vehicle.price.new} PKR
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-4 flex flex-col gap-3">
            <div className="w-full flex gap-3">
              <Button
                variant="accent"
                className="flex-1 h-11 font-semibold"
                onClick={handleViewDetails}
              >
                Book with Driver
              </Button>
              {vehicle.self_drive && (
                <Button
                  variant="outline"
                  className="flex-1 h-11 font-semibold"
                  onClick={handleViewDetails}
                >
                  Self Drive
                </Button>
              )}
            </div>
            <button 
              className="text-sm text-accent hover:text-accent/80 underline text-center cursor-pointer"
              onClick={handleViewDetails}
            >
              View Full Details
            </button>
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
