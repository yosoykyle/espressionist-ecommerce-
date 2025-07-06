/**
 * API Service Module
 * Provides functions to interact with the backend API for both user-facing and admin functionalities.
 */

import {
  type Product,
  type Order,
  type Admin,
} from "./data-store";
import { fetchWithAuth } from "./fetch-wrapper";

// JWT storage helper
function getJwt(): string | null {
  return (typeof window !== "undefined") ? localStorage.getItem("jwt") : null;
}

// Utility to extract error message from backend response
async function extractError(response: Response): Promise<string> {
  try {
    const data = await response.json(); // Parse JSON response
    if (data && data.message) return data.message; // Return error message if available
    if (typeof data === 'string') return data; // Return raw string if no message
    return response.statusText; // Return status text if no JSON message
  } catch {
    return response.statusText; // Return status text if parsing fails
  }
}

// ==================== USER-FACING API SERVICES ====================

export const productService = {
  /**
   * Get all active products
   * Calls GET /api/products
   */
  getAllProducts: async (): Promise<Product[]> => {
    const response = await fetch("/api/products"); // Fetch all products
    if (!response.ok) throw new Error(await extractError(response)); // Handle non-successful responses
    return response.json(); // Cast to Product[]
  },

  /**
   * Get product by ID
   * Calls GET /api/products/{id}
   */
  getProductById: async (id: string): Promise<Product | null> => {
    const response = await fetch(`/api/products/${id}`); 
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(await extractError(response));
    return response.json();
  },

  /**
   * Get product image URL
   * Calls GET /api/products/{id}/image
   */
  getProductImageUrl: (id: string): string => {
    return `/api/products/${id}/image`;
  },
}

export const orderService = {
  /**
   * Place an order
   * Calls POST /api/checkout
   */
  placeOrder: async (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    customerCity: string;
    customerPostalCode: string;
    customerNotes?: string;
    items: { productId: number; quantity: number }[];
  }): Promise<Order> => {
    // Do NOT send JWT for public checkout
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw new Error("Unauthorized");
      if (response.status === 409) {
        // Custom error for stock conflict
        const msg = await extractError(response);
        const error = new Error(msg || "Stock conflict");
        // @ts-ignore
        error.isStockConflict = true;
        throw error;
      }
      throw new Error(await extractError(response));
    }
    return response.json();
  },

  /**
   * Get order by code
   * Calls GET /api/orders/{orderCode}
   */
  getOrderByCode: async (code: string): Promise<Order | null> => {
    const jwt = getJwt();
    const headers: Record<string, string> = {};
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
    const response = await fetch(`/api/orders/${code}`, { headers });
    if (response.status === 404) return null;
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw new Error("Unauthorized");
      throw new Error(await extractError(response));
    }
    return response.json();
  },

  /**
   * Get order status
   * Calls GET /api/order-status/{orderCode}
   */
  getOrderStatus: async (code: string): Promise<Order | null> => {
    const jwt = getJwt();
    const headers: Record<string, string> = {};
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
    const response = await fetch(`/api/order-status/${code}`, { headers });
    if (response.status === 404) return null;
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw new Error("Unauthorized");
      throw new Error(await extractError(response));
    }
    return response.json();
  },
}

// ==================== ADMIN API SERVICES ====================

export const authService = {
  /**
   * Admin login
   * Calls POST /admin/login
   */
  login: async (username: string, password: string): Promise<boolean> => {
    const response = await fetch("/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) return false;
    const data = await response.json();
    if (data && data.jwttoken) {
      localStorage.setItem("jwt", data.jwttoken);
      return true;
    }
    return false;
  },

  /**
   * Admin logout
   */
  logout: (): void => {
    localStorage.removeItem("jwt");
  },

  /**
   * Check if admin is logged in
   */
  isLoggedIn: (): boolean => {
    return !!getJwt();
  },

  /**
   * Get current admin user (calls /admin/me)
   */
  getCurrentAdmin: async (): Promise<Admin | null> => {
    const jwt = getJwt();
    if (!jwt) return null;
    const response = await fetch("/admin/me", {
      headers: { "Authorization": `Bearer ${jwt}` },
    });
    if (!response.ok) return null;
    return response.json();
  },
}

export const adminProductService = {
  /**
   * Get all products (admin)
   * Calls GET /admin/api/products
   */
  getAllProducts: async (): Promise<Product[]> => {
    const jwt = getJwt();
    const headers: Record<string, string> = {};
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
    const response = await fetchWithAuth("/admin/api/products/all", { headers });
    if (!response.ok) throw new Error(await extractError(response));
    return response.json();
  },

  /**
   * Create or update product
   * Calls POST /admin/products/save
   */
  saveProduct: async (product: Omit<Product, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<Product> => {
    const method = product.id ? "PUT" : "POST";
    const url = product.id ? `/admin/api/products/${product.id}` : "/admin/api/products";
    const jwt = getJwt();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
    const response = await fetchWithAuth(url, {
      method,
      headers,
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error(await extractError(response));
    return response.json();
  },

  /**
   * Upload product image
   * Calls POST /admin/api/products/upload-image
   */
  uploadProductImage: async (productId: string, file: File): Promise<string> => {
    const jwt = getJwt();
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("file", file);
    const headers: Record<string, string> = {};
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
    const response = await fetchWithAuth("/admin/api/products/upload-image", {
      method: "POST",
      headers,
      body: formData,
    });
    if (!response.ok) throw new Error(await extractError(response));
    const data = await response.json();
    // The backend returns the updated product, return the image filename
    return data.image;
  },

  /**
   * Archive product
   * Calls POST /admin/products/archive/{productId}
   */
  archiveProduct: async (id: string, archived: boolean): Promise<Product | null> => {
    const url = archived
      ? `/admin/api/products/${id}/archive`
      : `/admin/api/products/${id}/restore`;
    const jwt = getJwt();
    const headers: Record<string, string> = {};
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
    const response = await fetchWithAuth(url, { method: "POST", headers });
    if (!response.ok) return null;
    return response.json();
  },
}

export const adminOrderService = {
  /**
   * Get all orders (admin)
   * Calls GET /admin/api/orders
   */
  getAllOrders: async (): Promise<Order[]> => {
    const jwt = getJwt();
    const headers: Record<string, string> = {};
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
    const response = await fetchWithAuth("/admin/api/orders", { headers });
    if (!response.ok) throw new Error(await extractError(response));
    return response.json();
  },

  /**
   * Update order status
   * Calls POST /admin/orders/{orderId}/status
   */
  updateOrderStatus: async (id: string, status: Order["status"]): Promise<Order | null> => {
    const jwt = getJwt();
    const headers: Record<string, string> = {};
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
    const response = await fetchWithAuth(`/admin/api/orders/${id}/status?status=${encodeURIComponent(status)}`, {
      method: "PUT",
      headers,
    });
    if (!response.ok) throw new Error(await extractError(response));
    return response.json();
  },

  /**
   * Archive order
   * Calls POST /admin/orders/{orderId}/archive
   */
  archiveOrder: async (id: string, archived: boolean): Promise<Order | null> => {
    const url = `/admin/api/orders/${id}/archive?archived=${archived}`;
    const jwt = getJwt();
    const headers: Record<string, string> = {};
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
    const response = await fetchWithAuth(url, { method: "POST", headers });
    if (!response.ok) throw new Error(await extractError(response));
    return response.json();
  },
}

export const adminUserService = {
  /**
   * Get all admin users
   * Calls GET /admin/api/users
   */
  getAllAdmins: async (): Promise<Admin[]> => {
    const jwt = getJwt();
    const headers: Record<string, string> = {};
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
    const response = await fetchWithAuth("/admin/api/admins", { headers });
    if (!response.ok) throw new Error(await extractError(response));
    return response.json();
  },

  /**
   * Create or update admin user
   * Calls POST /admin/users/save
   */
  saveAdmin: async (admin: Omit<Admin, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<Admin> => {
    const method = admin.id ? "PUT" : "POST";
    const url = admin.id ? `/admin/api/admins/${admin.id}` : "/admin/api/admins";
    const jwt = getJwt();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
    const response = await fetchWithAuth(url, {
      method,
      headers,
      body: JSON.stringify(admin),
    });
    if (!response.ok) throw new Error(await extractError(response));
    return response.json();
  },

  /**
   * Delete admin user
   * Calls POST /admin/users/delete/{userId}
   */
  deleteAdmin: async (id: string): Promise<Admin | null> => {
    const jwt = getJwt();
    const headers: Record<string, string> = {};
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
    const response = await fetchWithAuth(`/admin/api/admins/${id}/archive`, { method: "POST", headers });
    if (!response.ok) throw new Error(await extractError(response));
    return response.json();
  },

  /**
   * Restore admin user
   * Calls POST /admin/api/admins/{userId}/restore
   */
  restoreAdmin: async (id: string): Promise<Admin | null> => {
    const jwt = getJwt();
    const headers: Record<string, string> = {};
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
    const response = await fetchWithAuth(`/admin/api/admins/${id}/restore`, { method: "POST", headers });
    if (!response.ok) throw new Error(await extractError(response));
    return response.json();
  },
}

export const shippingFeeService = {
  /**
   * Get all shipping fees (base and additional) for each category
   * Calls GET /api/shipping-fees
   */
  getAllShippingFees: async (): Promise<Record<string, { baseFee: number; additionalFee: number }>> => {
    const response = await fetch("/api/shipping-fees");
    if (!response.ok) throw new Error("Failed to fetch shipping fees");
    return response.json();
  },
  /**
   * Update shipping fees
   * Calls PUT /api/shipping-fees
   */
  updateShippingFees: async (fees: Record<string, { baseFee: number; additionalFee: number }>) => {
    const response = await fetch("/api/shipping-fees", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fees),
    });
    if (!response.ok) throw new Error("Failed to update shipping fees");
    return response.json();
  },
};
