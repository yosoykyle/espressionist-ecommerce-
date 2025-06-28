// Data models for backend integration

export interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
  stock: number
  description: string
  archived: boolean
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  code: string
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
  date: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    notes?: string
  }
  subtotal: number
  vat: number
  total: number
  archived: boolean
  createdAt: string
  updatedAt: string
}

export interface Admin {
  id: string
  username: string
  email: string
  // Accept both DB and legacy role values for compatibility
  role: "Super Admin" | "Manager" | "Staff" | "SUPER_ADMIN" | "MANAGER" | "STAFF"
  password?: string
  archived?: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

// Add this type for the checkout payload
export type CheckoutOrder = {
  items: { productId: string; quantity: number }[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes: string;
  };
};

// Stores that fetch from backend API
import { productService, orderService, adminUserService, adminProductService, adminOrderService } from "./api-service";

export const productStore = {
  getAll: async () => adminProductService.getAllProducts(),
  getById: async (id: string) => productService.getProductById(id),
};
export const orderStore = {
  getAll: async () => {
    // Try adminOrderService first if available
    if (typeof adminOrderService !== 'undefined' && adminOrderService.getAllOrders) {
      const orders = await adminOrderService.getAllOrders();
      // Remove legacy mapping from flat customer fields
      return orders;
    }
    // fallback for user vs admin
    return [];
  },
};
export const adminStore = {
  getAll: async () => adminUserService.getAllAdmins(),
};

export async function initializeData() {
  // Optionally prefetch and cache data here if needed
  // For now, this is a no-op since stores fetch live from backend
}
