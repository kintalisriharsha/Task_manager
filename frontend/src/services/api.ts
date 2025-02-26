const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_TIMEOUT = 15000; // 15 seconds

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const fetchWithTimeout = async (url: string, options: RequestOptions = {}) => {
  const { timeout = API_TIMEOUT } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(id);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(error.message || 'An error occurred', response.status);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(id);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }
    
    throw error;
  }
};

const api = {
  get: <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    return fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  },
  
  post: <T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> => {
    return fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });
  },
  
  put: <T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> => {
    return fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });
  },
  
  delete: <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    return fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  },
};

export default api;
export { ApiError };