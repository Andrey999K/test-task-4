import { PaginatedResponseType } from "@/types/PaginatedResponse.types";
import { CategoryType } from "@/types/Category.types";
import { ProductType } from "@/types/Product.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({message: "Request failed"}));
    throw new Error(error.message || "Request failed");
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

export const categoryApi = {
  getAll: async (limit = 10, offset = 0) => {
    return fetchApi<PaginatedResponseType<CategoryType>>(
      `${API_URL}/categories?limit=${limit}&offset=${offset}`
    );
  },

  getById: async (id: number) => {
    return fetchApi<CategoryType>(`${API_URL}/categories/${id}`);
  },

  create: async (data: { name: string; description?: string }) => {
    return fetchApi<CategoryType>(`${API_URL}/categories`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: { name?: string; description?: string }) => {
    return fetchApi<CategoryType>(`${API_URL}/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return fetchApi<void>(`${API_URL}/categories/${id}`, {
      method: "DELETE",
    });
  },
};

export const productApi = {
  getAll: async (limit = 10, offset = 0) => {
    return fetchApi<PaginatedResponseType<ProductType>>(
      `${API_URL}/products?limit=${limit}&offset=${offset}`
    );
  },

  getById: async (id: number) => {
    return fetchApi<ProductType>(`${API_URL}/products/${id}`);
  },

  create: async (data: {
    name: string;
    categoryId: number;
    price: number;
    stock?: number;
  }) => {
    return fetchApi<ProductType>(`${API_URL}/products`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: number,
    data: {
      name?: string;
      categoryId?: number;
      price?: number;
      stock?: number;
    }
  ) => {
    return fetchApi<ProductType>(`${API_URL}/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return fetchApi<void>(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });
  },
};
