import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

interface Vehicle {
  vehicleId: number;
  isavailable: boolean;
  companyId: number | null;
  memberId: number | null;
  make: string;
  rentCharges: number;
  model: string;
  manufactureMonthYear: string;
  extColor: string;
  intColor: string;
  rego: string;
  regoExpiry: string;
  linkT: string | null;
  odometer: number;
  seatingCapacity: number | null;
  transmissionType: string | null;
  airConditioning: boolean | null;
  additionalFeatures: string | null;
  images: string;
  isRented: boolean;
  isArchived: boolean;
  archiveReason: string | null;
  archiveComments: string | null;
  resourcePath: string;
  owner: number;
  fuelUnit: number;
  comments: string;
  registeredCity: string;
  registeredCountry: string;
  excessKm: number | null;
  kmAllowed: number | null;
  additionalConditions: string | null;
  pickupLocation: string | null;
  dropoffLocation: string | null;
  paymentMethod: string | null;
  cancellationPolicyId: number | null;
  minRentPeriod: number | null;
  isRentalListingApproved: boolean;
  rentalListingStatus: string;
  rentalListingRemarks: string;
  rentalListingDate: string;
  rentalListingReviewedBy: string;
  rentalListingRejectionReason: string | null;
  createdAt: string;
  createdByUserId: number | null;
  lastModifiedDate: string;
  lastModifiedByUserId: number;
  isActive: boolean;
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
  currencyCode: string | null;
}

interface ApiVehicleResponse {
  vehicle: Vehicle;
  rating: Rating | null;
  unavailableDates: string[];
  blockedDates: Array<{ startDate: string; endDate: string }>;
  currencyCode: string | null;
}

interface ApiResponse {
  result: ApiVehicleResponse[];
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
  const mappedData = (data.result || []).map((item: ApiVehicleResponse) => {
    console.log('useVehicles: Extracting currencyCode from API response:', item.currencyCode);
    return {
      vehicle: item.vehicle,
      rating: item.rating,
      unavailableDates: item.unavailableDates,
      blockedDates: item.blockedDates,
      currencyCode: item.currencyCode
    };
  });
  return mappedData;
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