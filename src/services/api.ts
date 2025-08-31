const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://zfleetdev.azurewebsites.net';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const authData = this.getStoredAuthData();
    const token = authData?.token;

    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, clear auth data
        this.clearAuthData();
        throw new Error('Authentication expired');
      }
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  // Authentication Methods
  async authorize(email: string) {
    return this.request(
      `/Login/Authenticate?provider=google&email=${encodeURIComponent(email)}`
    );
  }

  async refreshToken(refreshTokenRequest: any) {
    return this.request("/api/Login/RefreshToken", {
      method: "POST",
      body: JSON.stringify(refreshTokenRequest),
    });
  }

  // Vehicle API Methods
  async getVehicles(filters: any = {}) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const url = `/GetPubliclyavailableVehicles${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request(url);
  }

  async getVehicleDetails(vehicleId: number) {
    return this.request(`/api/Vehicle/${vehicleId}`);
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
