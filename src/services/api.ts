const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://zfleetdev.azurewebsites.net';

interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
}

class ApiService {
  private isRefreshing = false;
  private refreshPromise: Promise<any> | null = null;

  // HTTP Interceptor for adding auth headers
  private async interceptRequest(config: RequestConfig): Promise<RequestConfig> {
    // Skip auth for certain endpoints
    if (config.skipAuth) {
      return config;
    }

    const authData = this.getStoredAuthData();
    const token = authData?.token;

    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    return config;
  }

  // HTTP Response Interceptor for handling auth errors
  private async interceptResponse<T>(response: Response, originalRequest: RequestConfig): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        const newToken = await this.handleTokenRefresh();
        if (newToken) {
          // Retry the original request with new token
          const retryConfig = {
            ...originalRequest,
            headers: {
              ...originalRequest.headers,
              'Authorization': `Bearer ${newToken}`,
            },
          };

          const retryResponse = await fetch(response.url, retryConfig);
          if (retryResponse.ok) {
            return retryResponse.json();
          }
        }

        // If refresh failed or no new token, clear auth data
        this.clearAuthData();
        throw new Error('Authentication expired');
      }

      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  // Handle token refresh
  private async handleTokenRefresh(): Promise<string | null> {
    if (this.isRefreshing) {
      // If already refreshing, wait for the existing promise
      return this.refreshPromise;
    }

    this.isRefreshing = true;

    try {
      const authData = this.getStoredAuthData();
      if (!authData?.refreshToken) {
        throw new Error('No refresh token available');
      }

      this.refreshPromise = this.refreshToken({
        refreshToken: authData.refreshToken,
        token: authData.token,
      });

      const refreshResponse = await this.refreshPromise;

      if (refreshResponse?.token) {
        // Update stored auth data with new token
        const updatedAuthData = {
          ...authData,
          token: refreshResponse.token,
          refreshToken: refreshResponse.refreshToken || authData.refreshToken,
        };

        this.storeAuthData(updatedAuthData);
        return refreshResponse.token;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuthData();
      return null;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  // Main request method with interceptors
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Apply request interceptor
    const interceptedConfig = await this.interceptRequest(config);

    const response = await fetch(url, {
      ...interceptedConfig,
      headers: {
        'Content-Type': 'application/json',
        ...interceptedConfig.headers,
      },
    });

    // Apply response interceptor
    return this.interceptResponse<T>(response, interceptedConfig);
  }

  // Authentication Methods (skip auth for these)
  async authorize(email: string, firebaseUser?: any) {
    try {
      // First try to authenticate (login) the user
      const authResponse = await this.request(
        `/Login/Authenticate?provider=google&email=${encodeURIComponent(email)}`,
        { skipAuth: true }
      );

      // Check if user is new and needs registration
      if (authResponse && (authResponse as any).isNew === true) {
        console.log('User is new, attempting registration');
        if (firebaseUser) {
          const registerResponse = await this.registerUser(firebaseUser);
          return { ...registerResponse, isNew: true };
        } else {
          throw new Error('Firebase user data required for registration');
        }
      }

      return { ...(authResponse as any), isNew: false };
    } catch (error: any) {
      // If authentication fails (user not registered), try registration
      console.log('Authentication failed, attempting registration:', error);
      
      if (firebaseUser) {
        try {
          const registerResponse = await this.registerUser(firebaseUser);
          return { ...registerResponse, isNew: true };
        } catch (registerError) {
          console.error('Registration also failed:', registerError);
          throw registerError;
        }
      }
      
      throw error;
    }
  }

  // Register new user with multipart/form-data
  private async registerUser(firebaseUser: any) {
    const formData = new FormData();
    
    // Extract names from displayName if available
    const displayName = firebaseUser.displayName || '';
    const nameParts = displayName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Populate form data with available information
    formData.append('Email', firebaseUser.email || '');
    formData.append('FirstName', firstName);
    formData.append('LastName', lastName);
    formData.append('Provider', 'google');
    formData.append('Username', firebaseUser.email || displayName || '');
    
    // Add empty/default values for required fields
    formData.append('Picture', ''); // Empty as specified
    formData.append('Country', '');
    formData.append('Dob', '');
    formData.append('City', '');
    formData.append('Mobile', '');
    formData.append('Address', '');
    formData.append('Crn', '');
    formData.append('Crnexpiry', '');
    formData.append('ForiegnLicenseNo', '');
    formData.append('ForiegnLicenseExpiry', '');
    formData.append('PassportNo', '');
    formData.append('PassportExpiry', '');
    formData.append('VisaNo', '');
    formData.append('VisaExpiry', '');
    formData.append('Images', '');
    formData.append('FcmToken', '');
    formData.append('FuelUnit', '0'); // Default to 0 as integer

    // Try to fetch profile picture if available
    if (firebaseUser.photoURL) {
      try {
        const response = await fetch(firebaseUser.photoURL);
        if (response.ok) {
          const blob = await response.blob();
          formData.append('ProofOfaddress', blob, 'profile-picture.jpg');
        }
      } catch (error) {
        console.log('Could not fetch profile picture:', error);
      }
    }

    // Add empty file for InternationalDrivingLicensePhoto
    formData.append('InternationalDrivingLicensePhoto', new Blob(), '');

    // Make the registration request
    const url = `${API_BASE_URL}/api/Customer?role=renter`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status}`);
    }

    return await response.json();
  }

  async refreshToken(refreshTokenRequest: any) {
    return this.request("/api/Login/RefreshToken", {
      method: "POST",
      body: JSON.stringify(refreshTokenRequest),
      skipAuth: true, // Don't add auth header for refresh token request
    });
  }

  // Vehicle API Methods (will automatically use interceptor for auth)
  async getVehicles(filters: any = {}): Promise<{ result: any[] }> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const url = `/GetPubliclyavailableVehicles${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request(url);
  }

  async getVehicleDetails(vehicleId: number): Promise<{ result: any; hasError: boolean; errorMessage: string; errorCode: number }> {
    return this.request(`/api/Vehicle/${vehicleId}`);
  }

  async getCustomerDetails(customerId: number): Promise<{ result: any; hasError: boolean; errorMessage: string; errorCode: number }> {
    return this.request(`/api/Customer/${customerId}`);
  }

  async getUserRating(userId: number): Promise<{ result: any; hasError: boolean; errorMessage: string; errorCode: number }> {
    return this.request(`/api/UserRating/${userId}`);
  }

  // Storage Methods
  storeAuthData(response: any): void {
    localStorage.setItem("auth_data", JSON.stringify(response));
    localStorage.setItem("authToken", response.token);
    localStorage.setItem("refreshToken", response.refreshToken);
  }

  getStoredAuthData(): any {
    const data = localStorage.getItem("auth_data");
    return data ? JSON.parse(data) : null;
  }

  getStoredCustomer(): any {
    const data = localStorage.getItem("userdetails");
    return data ? JSON.parse(data) : null;
  }

  clearAuthData(): void {
    localStorage.removeItem("auth_data");
    localStorage.removeItem("userdetails");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const authData = this.getStoredAuthData();
    return !!authData?.token;
  }
}

export const apiService = new ApiService();
