import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

interface Vehicle {
  vehicleId: number;
  make: string;
  model: string;
  rentCharges: number;
  manufactureMonthYear: string;
  extColor: string;
  intColor: string;
  rego: string;
  regoExpiry: string;
  odometer: number;
  isRented: boolean;
  images: string;
  resourcePath: string;
  registeredCity: string;
  registeredCountry: string;
  pickupLocation: string;
  dropoffLocation: string;
  paymentMethod: string;
  comments: string;
}

interface Rating {
  averageRating: number;
  totalReviews: number;
}

interface VehicleResponse {
  vehicle: Vehicle;
  rating: Rating | null;
  unavailableDates: string[];
  blockedDates: Array<{ startDate: string; endDate: string }>;
}

interface ApiResponse {
  result: VehicleResponse[];
}

interface VehicleFilters {
  minPrice?: number;
  maxPrice?: number;
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  availableStartDate?: string;
  availableEndDate?: string;
  city?: string;
  country?: string;
}

const fetchVehicles = async (filters: VehicleFilters = {}): Promise<VehicleResponse[]> => {
  const data: ApiResponse = await apiService.getVehicles(filters);
  return data.result || [];
};

export const useVehicles = (filters: VehicleFilters = {}) => {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => fetchVehicles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export type { Vehicle, Rating, VehicleResponse, VehicleFilters };