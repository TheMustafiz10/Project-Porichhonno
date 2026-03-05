// API utility functions for frontend
import { ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Specific API methods for each feature
export const LogsAPI = {
  getAll: (userId = 'default-user') => ApiClient.get(`/logs?userId=${userId}`),
  getById: (id: string) => ApiClient.get(`/logs/${id}`),
  create: (data: any) => ApiClient.post('/logs', data),
  update: (id: string, data: any) => ApiClient.put(`/logs/${id}`, data),
  delete: (id: string) => ApiClient.delete(`/logs/${id}`),
  getStats: (userId = 'default-user') => ApiClient.get(`/logs/stats/summary?userId=${userId}`),
};

export const UsersAPI = {
  getById: (id: string) => ApiClient.get(`/users/${id}`),
  getByUsername: (username: string) => ApiClient.get(`/users/username/${username}`),
  create: (data: any) => ApiClient.post('/users', data),
  update: (id: string, data: any) => ApiClient.put(`/users/${id}`, data),
  addBadge: (id: string, badge: { name: string; icon: string }) => 
    ApiClient.post(`/users/${id}/badges`, badge),
  getStats: (id: string) => ApiClient.get(`/users/${id}/stats`),
};

export const ScrapRatesAPI = {
  getAll: () => ApiClient.get('/scrap-rates'),
  getByMaterial: (material: string) => ApiClient.get(`/scrap-rates/${material}`),
  calculate: (material: string, weightKg: number) =>
    ApiClient.post('/scrap-rates/calculate', { materialType: material, weightKg }),
  update: (material: string, pricePerKg: number) =>
    ApiClient.post('/scrap-rates', { materialType: material, pricePerKg }),
};

export const EcoTipsAPI = {
  getAll: () => ApiClient.get('/eco-tips'),
  getRandom: () => ApiClient.get('/eco-tips/random'),
  getById: (id: string) => ApiClient.get(`/eco-tips/${id}`),
  create: (data: any) => ApiClient.post('/eco-tips', data),
  update: (id: string, data: any) => ApiClient.put(`/eco-tips/${id}`, data),
  delete: (id: string) => ApiClient.delete(`/eco-tips/${id}`),
};
