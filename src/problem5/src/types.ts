// Resource type definition
export interface Resource {
  id: number;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

// Create resource request body
export interface CreateResourceRequest {
  name: string;
  description: string;
  category: string;
  status?: 'active' | 'inactive';
}

// Update resource request body
export interface UpdateResourceRequest {
  name?: string;
  description?: string;
  category?: string;
  status?: 'active' | 'inactive';
}

// Filter query parameters
export interface ResourceFilters {
  category?: string;
  status?: 'active' | 'inactive';
  search?: string;
  page?: number;
  limit?: number;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
