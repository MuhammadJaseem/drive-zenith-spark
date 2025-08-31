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
  odometer: number;
  comments: string;
  registeredCity: string;
  registeredCountry: string;
  pickupLocation: string;
  dropoffLocation: string;
  paymentMethod: string;
  images: string;
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
