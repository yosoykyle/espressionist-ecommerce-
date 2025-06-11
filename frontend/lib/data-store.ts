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
