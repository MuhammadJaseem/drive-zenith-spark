import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

interface CustomerDetails {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  profilePicture?: string;
  city?: string;
  country?: string;
  rating?: number;
  totalReviews?: number;
  memberSince?: string;
  verified?: boolean;
}

interface UserRating {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ApiResponse {
  result: CustomerDetails;
  hasError: boolean;
  errorCode: number;
  errorMessage: string;
}

interface RatingResponse {
  result: UserRating;
  hasError: boolean;
  errorCode: number;
  errorMessage: string;
}

const fetchCustomerDetails = async (customerId: number): Promise<CustomerDetails> => {
  const data: ApiResponse = await apiService.getCustomerDetails(customerId);

  if (data.hasError) {
    throw new Error(data.errorMessage || 'Failed to fetch customer details');
  }

  return data.result;
};

const fetchUserRating = async (userId: number): Promise<UserRating> => {
  const data: RatingResponse = await apiService.getUserRating(userId);

  if (data.hasError) {
    // Return default rating if API fails
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  return data.result;
};

export const useCustomerDetails = (customerId: number | undefined) => {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => fetchCustomerDetails(customerId!),
    enabled: !!customerId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUserRating = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['userRating', userId],
    queryFn: () => fetchUserRating(userId!),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export type { CustomerDetails, UserRating };
