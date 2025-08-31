import { useQuery } from '@tanstack/react-query';

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
  const response = await fetch(`https://zfleetdev.azurewebsites.net/api/Vehicle/${vehicleId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch vehicle details');
  }

  const data: ApiResponse = await response.json();

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
