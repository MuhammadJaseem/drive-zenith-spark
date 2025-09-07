import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Settings, Clock, Fuel, CheckCircle, DollarSign, AlertTriangle, X, Car, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface StaticVehicle {
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

  const handleViewDetails = () => {
    setShowModal(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <Card className="overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50">
          <div className="relative">
            {/* Placeholder Image */}
            <div className={`w-full h-48 bg-gradient-to-br ${generatePlaceholderGradient()} flex items-center justify-center relative`}>
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
              className="text-sm text-accent hover:text-accent/80 underline text-center"
              onClick={handleViewDetails}
            >
              View Full Details
            </button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Vehicle Details Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[80vh] p-5 [&>button]:hidden">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-xl font-bold text-foreground text-center">
              Excluding Charges Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg p-4 border border-border/50">
              <div className="grid grid-cols-2 gap-3 font-semibold text-sm mb-4 text-foreground">
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-accent" />
                  Services
                </span>
                <span className="text-right flex items-center justify-end gap-2">
                  <DollarSign className="w-4 h-4 text-accent" />
                  Amount
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3 text-sm py-2 px-3 rounded-md bg-background/50 hover:bg-background/70 transition-colors">
                  <span className="flex items-center gap-2 font-medium">
                    <Fuel className="w-4 h-4 text-accent" />
                    Fuel Cost
                  </span>
                  <span className="text-right font-semibold text-accent">{vehicle.services?.fuel_cost || "N/A"}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm py-2 px-3 rounded-md bg-background/50 hover:bg-background/70 transition-colors">
                  <span className="flex items-center gap-2 font-medium">
                    <Car className="w-4 h-4 text-accent" />
                    Base Fare
                  </span>
                  <span className="text-right font-semibold text-accent">{vehicle.services?.base_fare || "N/A"}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm py-2 px-3 rounded-md bg-background/50 hover:bg-background/70 transition-colors">
                  <span className="flex items-center gap-2 font-medium">
                    <Clock className="w-4 h-4 text-accent" />
                    Latenight Offer
                  </span>
                  <span className="text-right font-semibold text-accent">{vehicle.services?.latenight_offer || "N/A"}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm py-2 px-3 rounded-md bg-background/50 hover:bg-background/70 transition-colors">
                  <span className="flex items-center gap-2 font-medium">
                    <DollarSign className="w-4 h-4 text-accent" />
                    Overtime
                  </span>
                  <span className="text-right font-semibold text-accent">{vehicle.services?.overtime || "N/A"}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                  Prices may vary based on location and availability
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
