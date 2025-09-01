import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

interface VehicleDetails {
  vehicleId: number;
  isavailable: boolean;
  companyId: number;
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
  seatingCapacity: number;
  transmissionType: string;
  airConditioning: boolean;
  additionalFeatures: string;
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
  excessKm: number;
  kmAllowed: number;
  additionalConditions: string;
  pickupLocation: string;
  dropoffLocation: string;
  paymentMethod: string;
  cancellationPolicyId: number;
  minRentPeriod: number;
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

interface ApiResponse {
  result: VehicleDetails;
  hasError: boolean;
  errorCode: number;
  errorMessage: string;
}

const fetchVehicleDetails = async (vehicleId: number): Promise<VehicleDetails> => {
  const data: ApiResponse = await apiService.getVehicleDetails(vehicleId);

  if (data.hasError) {
    throw new Error(data.errorMessage || 'Failed to fetch vehicle details');
  }

  // Debug: Log the actual API response
  console.log('API Response:', data);
  console.log('Vehicle data:', data.result);
  console.log('seatingCapacity value:', data.result?.seatingCapacity);
  console.log('All keys:', Object.keys(data.result || {}));

  return data.result;
};

export const useVehicleDetails = (vehicleId: number | undefined) => {
  return useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => fetchVehicleDetails(vehicleId!),
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export type { VehicleDetails };
