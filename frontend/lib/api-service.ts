/**
 * API Service Layer
 *
 * This service layer provides an abstraction for API calls to the backend.
 * Currently using localStorage for data persistence, but designed to be easily
 * refactored to use real API endpoints from a Spring Boot backend.
 *
 * Future Implementation Notes:
 * - Replace localStorage operations with fetch() calls to the corresponding endpoints
 * - Add proper error handling for network requests
 * - Implement authentication for admin endpoints
 */

import {
  type Product,
  type Order,
  type Admin,
} from "./data-store"

// ==================== USER-FACING API SERVICES ====================

export const productService = {
  /**
   * Get all active products
   * Calls GET /api/products
   */
  getAllProducts: async (): Promise<Product[]> => {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  /**
   * Get product by ID
   * Calls GET /api/products/{id}
   */
  getProductById: async (id: string): Promise<Product | null> => {
    const response = await fetch(`/api/products/${id}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Failed to fetch product");
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
  placeOrder: async (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error("Failed to place order");
    return response.json();
  },

  /**
   * Get order by code
   * Calls GET /api/orders/{orderCode}
   */
  getOrderByCode: async (code: string): Promise<Order | null> => {
    const response = await fetch(`/api/orders/${code}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Failed to fetch order");
    return response.json();
  },

  /**
   * Get order status
   * Calls GET /api/order-status/{orderCode}
   */
  getOrderStatus: async (code: string): Promise<Order | null> => {
    const response = await fetch(`/api/order-status/${code}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Failed to fetch order status");
    return response.json();
  },
}

// ==================== ADMIN API SERVICES ====================

export const authService = {
  /**
   * Admin login
   * Calls POST /admin/login
   */
  login: async (username: string, password: string): Promise<Admin | null> => {
    const response = await fetch("/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) return null;
    return response.json();
  },

  /**
   * Admin logout
   * Calls POST /logout
   */
  logout: async (): Promise<void> => {
    await fetch("/admin/logout", { method: "POST" });
  },

  /**
   * Check if admin is logged in
   */
  isLoggedIn: (): boolean => {
    // TODO: Implement login state check (e.g., JWT in localStorage)
    return false
  },

  /**
   * Get current admin user
   */
  getCurrentAdmin: (): Admin | null => {
    // TODO: Implement retrieval from JWT or session
    return null
  },
}

export const adminProductService = {
  /**
   * Get all products (admin)
   * Calls GET /admin/api/products
   */
  getAllProducts: async (): Promise<Product[]> => {
    const response = await fetch("/admin/api/products/all");
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  /**
   * Create or update product
   * Calls POST /admin/products/save
   */
  saveProduct: async (product: Omit<Product, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<Product> => {
    const method = product.id ? "PUT" : "POST";
    const url = product.id ? `/admin/api/products/${product.id}` : "/admin/api/products";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error("Failed to save product");
    return response.json();
  },

  /**
   * Archive product
   * Calls POST /admin/products/archive/{productId}
   */
  archiveProduct: async (id: string, archived: boolean): Promise<Product | null> => {
    const url = archived
      ? `/admin/api/products/${id}/archive`
      : `/admin/api/products/${id}/restore`;
    const response = await fetch(url, { method: "POST" });
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
    const response = await fetch("/admin/api/orders");
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  /**
   * Update order status
   * Calls POST /admin/orders/{orderId}/status
   */
  updateOrderStatus: async (id: string, status: Order["status"]): Promise<Order | null> => {
    const response = await fetch(`/admin/api/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) return null;
    return response.json();
  },

  /**
   * Archive order
   * Calls POST /admin/orders/{orderId}/archive
   */
  archiveOrder: async (id: string, archived: boolean): Promise<Order | null> => {
    const url = `/admin/api/orders/${id}/archive`;
    const response = await fetch(url, { method: "POST" });
    if (!response.ok) return null;
    return response.json();
  },
}

export const adminUserService = {
  /**
   * Get all admin users
   * Calls GET /admin/api/users
   */
  getAllAdmins: async (): Promise<Admin[]> => {
    const response = await fetch("/admin/api/admins");
    if (!response.ok) throw new Error("Failed to fetch admins");
    return response.json();
  },

  /**
   * Create or update admin user
   * Calls POST /admin/users/save
   */
  saveAdmin: async (admin: Omit<Admin, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<Admin> => {
    const method = admin.id ? "PUT" : "POST";
    const url = admin.id ? `/admin/api/admins/${admin.id}` : "/admin/api/admins";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(admin),
    });
    if (!response.ok) throw new Error("Failed to save admin");
    return response.json();
  },

  /**
   * Delete admin user
   * Calls POST /admin/users/delete/{userId}
   */
  deleteAdmin: async (id: string): Promise<boolean> => {
    const response = await fetch(`/admin/api/admins/${id}/archive`, { method: "POST" });
    return response.ok;
  },
}
