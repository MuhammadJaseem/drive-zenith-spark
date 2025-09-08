import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import StaticVehicleCard from '@/components/StaticVehicleCard';
import SearchFilters from '@/components/SearchFilters';
import { Loader2, Car, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { VehicleFilters } from '@/hooks/useVehicles';

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

const staticVehicles: StaticVehicle[] = [
  {
    "vehicleimage": "/TOYOTA Corolla Altis.png",

    "car": "HONDA Civic",
    "seats": 4,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "self_drive": "24hrs",
    "overtime": "PKR 350/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 40/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 9000, "new": 8500, "unit": "PKR/day" },
    "free_cancellation": true,
    "services": {
      "fuel_cost": "PKR 40/km",
      "base_fare": "PKR 225",
      "latenight_offer": "PKR 1000",
      "overtime": "PKR 350/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "TOYOTA Corolla Altis",
    "seats": 4,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "self_drive": "24hrs",
    "overtime": "PKR 350/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 40/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 7500, "new": 7000, "unit": "PKR/day" },
    "free_cancellation": true,
    "services": {
      "fuel_cost": "PKR 40/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 300",
      "overtime": "PKR 350/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "TOYOTA Corolla Gli",
    "seats": 5,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "self_drive": "24hrs",
    "overtime": "PKR 350/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 37/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 6000, "new": 5500, "unit": "PKR/day" },
    "free_cancellation": true,
    "services": {
      "fuel_cost": "PKR 37/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 300",
      "overtime": "PKR 350/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "TOYOTA Yaris",
    "seats": 5,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "self_drive": "24hrs",
    "overtime": "PKR 350/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 37/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 6000, "new": 5500, "unit": "PKR/day" },
    "free_cancellation": true,
    "services": {
      "fuel_cost": "PKR 37/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 300",
      "overtime": "PKR 350/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "AUDI A4",
    "seats": 4,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "overtime": "PKR 500/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 60/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 28000, "new": 25000, "unit": "PKR/day" },
    "free_cancellation": false,
    "services": {
      "fuel_cost": "PKR 60/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 1000",
      "overtime": "PKR 500/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "AUDI A5",
    "seats": 4,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "overtime": "PKR 500/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 60/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 50000, "new": 40000, "unit": "PKR/day" },
    "free_cancellation": false,
    "services": {
      "fuel_cost": "PKR 60/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 1000",
      "overtime": "PKR 500/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "MERCEDES CLA200",
    "seats": 4,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "overtime": "PKR 350/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 50/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 45000, "new": 40000, "unit": "PKR/day" },
    "free_cancellation": false,
    "services": {
      "fuel_cost": "PKR 50/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 1000",
      "overtime": "PKR 350/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "MERCEDES S Class - S400",
    "seats": 5,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "overtime": "PKR 500/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 50/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 80000, "new": 80000, "unit": "PKR/day" },
    "free_cancellation": false,
    "services": {
      "fuel_cost": "PKR 50/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 0",
      "overtime": "PKR 500/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "HONDA BRV",
    "seats": 7,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "overtime": "PKR 300/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 37/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 10000, "new": 9500, "unit": "PKR/day" },
    "free_cancellation": false,
    "services": {
      "fuel_cost": "PKR 37/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 0",
      "overtime": "PKR 300/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "TOYOTA Fortuner",
    "seats": 7,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "overtime": "PKR 500/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 50/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 20000, "new": 18000, "unit": "PKR/day" },
    "free_cancellation": false,
    "services": {
      "fuel_cost": "PKR 50/km",
      "base_fare": "PKR 250",
      "latenight_offer": "PKR 1000",
      "overtime": "PKR 500/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "TOYOTA Land Cruiser",
    "seats": 7,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "overtime": "PKR 500/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 60/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 30000, "new": 28000, "unit": "PKR/day" },
    "free_cancellation": false,
    "services": {
      "fuel_cost": "PKR 60/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 1000",
      "overtime": "PKR 500/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "TOYOTA Prado",
    "seats": 7,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "overtime": "PKR 500/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 55/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 22000, "new": 19000, "unit": "PKR/day" },
    "free_cancellation": false,
    "services": {
      "fuel_cost": "PKR 55/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 1000",
      "overtime": "PKR 500/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "TOYOTA Revo",
    "seats": 6,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "self_drive": "24hrs",
    "overtime": "PKR 500/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 50/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 15000, "new": 17000, "unit": "PKR/day" },
    "free_cancellation": true,
    "services": {
      "fuel_cost": "PKR 50/km",
      "base_fare": "PKR 250",
      "latenight_offer": "PKR 1000",
      "overtime": "PKR 500/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "KIA Sportage",
    "seats": 5,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "overtime": "PKR 500/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 37/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 12000, "new": 12000, "unit": "PKR/day" },
    "free_cancellation": false,
    "services": {
      "fuel_cost": "PKR 37/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 0",
      "overtime": "PKR 500/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "HYUNDAI Tucson",
    "seats": 5,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "self_drive": "24hrs",
    "overtime": "PKR 500/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 37/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 12000, "new": 12000, "unit": "PKR/day" },
    "free_cancellation": true,
    "services": {
      "fuel_cost": "PKR 37/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 0",
      "overtime": "PKR 500/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "SUZUKI Alto",
    "seats": 4,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "self_drive": "24hrs",
    "overtime": "PKR 250/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 32/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 4800, "new": 4500, "unit": "PKR/day" },
    "free_cancellation": true,
    "services": {
      "fuel_cost": "PKR 32/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 250",
      "overtime": "PKR 250/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "SUZUKI Cultus",
    "seats": 4,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "self_drive": "24hrs",
    "overtime": "PKR 400/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 32/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 5500, "new": 5000, "unit": "PKR/day" },
    "free_cancellation": true,
    "services": {
      "fuel_cost": "PKR 32/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 250",
      "overtime": "PKR 400/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "SUZUKI Wagon R",
    "seats": 4,
    "transmission": "Automatic",
    "with_driver": "10hrs/day",
    "self_drive": "24hrs",
    "overtime": "PKR 250/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 32/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 5500, "new": 5000, "unit": "PKR/day" },
    "free_cancellation": true,
    "services": {
      "fuel_cost": "PKR 32/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 1000",
      "overtime": "PKR 250/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "TOYOTA Coaster",
    "seats": 22,
    "transmission": "Manual",
    "with_driver": "10hrs/day",
    "overtime": "PKR 500/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 70/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": 20000, "new": 20000, "unit": "PKR/day" },
    "free_cancellation": false,
    "services": {
      "fuel_cost": "PKR 70/km",
      "base_fare": "PKR 350",
      "latenight_offer": "PKR 0",
      "overtime": "PKR 500/hr"
    }
  },
  {
    "vehicleimage": "",
    "car": "TOYOTA HIACE",
    "seats": 12,
    "transmission": "Manual",
    "with_driver": "10hrs/day",
    "overtime": "PKR 500/hr",
    "fuel_policy": "Refill fuel at the end of the day or pay PKR 60/KM",
    "note": "Excluding fuel & overtime charges",
    "price": { "old": null, "new": null, "unit": "PKR/day" },
    "free_cancellation": false,
    "services": {
      "fuel_cost": "PKR 60/km",
      "base_fare": "PKR 0",
      "latenight_offer": "PKR 0",
      "overtime": "PKR 500/hr"
    }
  }
];

const StaticIndex = () => {
  const [filters, setFilters] = useState<VehicleFilters>({});

  // Prepare static makes and models
  const staticMakes = useMemo(() => {
    const makes = [...new Set(staticVehicles.map(v => v.car.split(' ')[0]))];
    return makes.map(make => ({ name: make }));
  }, []);

  const staticModels = useMemo(() => {
    const modelsMap: { [make: string]: string[] } = {};
    staticVehicles.forEach(v => {
      const parts = v.car.split(' ');
      const make = parts[0];
      const model = parts.slice(1).join(' ');
      if (!modelsMap[make]) modelsMap[make] = [];
      if (!modelsMap[make].includes(model)) modelsMap[make].push(model);
    });
    const models: any[] = [];
    Object.entries(modelsMap).forEach(([make, modelList]) => {
      modelList.forEach(model => {
        models.push({ make, name: model });
      });
    });
    return models;
  }, []);

  const handleFiltersChange = (newFilters: VehicleFilters) => {
    setFilters(newFilters);
  };

  // Filter the static vehicles based on filters
  const filteredVehicles = useMemo(() => {
    return staticVehicles.filter(vehicle => {
      // Filter by make (extract from car)
      if (filters.make) {
        const make = vehicle.car.split(' ')[0];
        if (make.toLowerCase() !== filters.make.toLowerCase()) return false;
      }
      // Filter by model (rest of car name)
      if (filters.model) {
        const model = vehicle.car.split(' ').slice(1).join(' ');
        if (!model.toLowerCase().includes(filters.model.toLowerCase())) return false;
      }
      // Filter by price
      if (filters.minPrice && vehicle.price.new && vehicle.price.new < filters.minPrice) return false;
      if (filters.maxPrice && vehicle.price.new && vehicle.price.new > filters.maxPrice) return false;
      // Filter by seats (using minPrice as proxy for seats filter, since no seats filter in VehicleFilters)
      // For simplicity, no seats filter yet
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Premium Car Rentals
              <span className="block text-accent">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              Discover luxury vehicles, competitive prices, and exceptional service.
              Your perfect ride is just a click away.
            </p>

            {/* Key Features */}
            <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>No Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>24/7 Customer Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Premium Fleet</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SearchFilters onFiltersChange={handleFiltersChange} currencyCode="PKR" staticMakes={staticMakes} staticModels={staticModels} />
        </div>
      </section>

      {/* Vehicle Listings */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Available Vehicles</h2>
              <p className="text-muted-foreground mt-2">
                {filteredVehicles.length} vehicles found
              </p>
            </div>
          </div>

          {/* Empty State */}
          {filteredVehicles.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4 max-w-md">
                <Car className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold text-foreground">No vehicles found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search filters or check back later for new availability.
                </p>
                <Button onClick={() => setFilters({})} variant="outline">
                  Reset Filters
                </Button>
              </div>
            </div>
          )}

          {/* Vehicle Grid */}
          {filteredVehicles.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.car}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <StaticVehicleCard vehicle={vehicle} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StaticIndex;
