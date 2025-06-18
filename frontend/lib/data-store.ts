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
  role: "Super Admin" | "Manager" | "Staff"
  password?: string
  archived?: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

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
      // Map flat customer fields to nested customer object for each order
      return orders.map(order => ({
        ...order,
        customer: order.customer || {
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          address: order.customerAddress,
          city: order.customerCity,
          postalCode: order.customerPostalCode,
          notes: order.customerNotes,
        },
      }));
    }
    // fallback for user vs admin
    return orderService.getAllOrders ? orderService.getAllOrders() : [];
  },
};
export const adminStore = {
  getAll: async () => adminUserService.getAllAdmins(),
};

export async function initializeData() {
  // Optionally prefetch and cache data here if needed
  // For now, this is a no-op since stores fetch live from backend
}
