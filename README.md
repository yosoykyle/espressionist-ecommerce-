# Espressionist Ecommerce Site: Developer Documentation

## Project Context
This project was created by:
- **Baluyot, Kyle F.**
- **Maniquiz, Stephanie C.**
- **Tizon, Kandy R.**

We are 2nd year BSIT Section 1 (BSIT 2-1) students at Polytechnic University of the Philippines, San Pedro Campus, for the year 2025. This project is submitted as our finals for the subject **Object Oriented Programming** under **Prof. Esmasin, John Christian Cartegena**.

---

## System Overview
Espressionist Ecommerce is a full-stack web application designed to provide a seamless online shopping experience for users and robust management tools for administrators. The system is built using modern technologies:
- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)
- **Backend:** Java Spring Boot
- **Database:** MariaDB (via Docker)

---

## Features & Requirements

### User-Facing Features
- **List of Items:** Users can browse a catalog of products with images and details.
- **Cart Feature:** Add, update, and remove items from a shopping cart.
- **Checkout:** Secure checkout process for placing orders.
- **Payment:** (Stub/placeholder) Payment step included in checkout flow.
- **Order Status:** Users can view the status of their orders.
- **Shipping Details:** Users provide and review shipping information during checkout.
- **Tax Calculation:** Taxes are calculated and displayed at checkout.

### Admin Features
- **Inventory Management:** Admins can add, edit, and remove products from inventory.
- **Customer Management:** View and manage customer information and orders.
- **Admin Management:** Manage admin accounts and permissions.

---

## Technology Stack

### Frontend
- **Next.js**: React-based framework for server-side rendering and routing.
- **TypeScript**: Type-safe JavaScript for robust development.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **React Context & Custom Hooks**: For state management and UI logic.

### Backend
- **Java Spring Boot**: RESTful API, business logic, and security.
- **Spring Security**: Authentication and authorization.
- **JPA/Hibernate**: ORM for database access.
- **JWT**: JSON Web Tokens for secure authentication.

### Database
- **MariaDB**: Relational database, managed via Docker Compose for easy setup.

---

## Project Structure
- See `BACKEND_README.md` and `FRONTEND_README.md` for detailed structure, setup, and development instructions for each part of the system.

---

## Developer Notes
- The system is modular and follows best practices for maintainability and scalability.
- All business logic is separated from presentation and data layers.
- The codebase is well-documented and organized for easy onboarding of new developers.

---

## Getting Started
1. **Clone the repository.**
2. **Follow the setup instructions in the backend and frontend manuals.**
3. **Start the backend and database, then the frontend.**
4. **Access the site at `http://localhost:3000` (frontend) and API at `http://localhost:8080` (backend).**

---

## User & Admin UI Navigation Flow

### General User (Customer) UI Flow
- **Landing/Home Page:**
  - Users are greeted with a product listing grid or featured items.
  - Navigation: Main navbar with links to Products, Cart, and (if logged in) Orders.
- **Product Details:**
  - Clicking a product opens a detailed view with images, description, price, and Add to Cart button.
- **Cart:**
  - Cart icon in the navbar shows the number of items; clicking it opens the cart page.
  - Users can update quantities or remove items directly in the cart UI.
  - Checkout button is prominent.
- **Checkout:**
  - Multi-step form or single page for entering shipping details, reviewing order, and seeing tax calculation.
  - Payment step is included (stub/placeholder UI).
- **Order Success:**
  - After checkout, users see a confirmation page with order summary and a link to track order status.
- **Order Status:**
  - Accessible from the navbar or order confirmation; shows a timeline or status updates for each order.

### Admin UI Flow
- **Accessing Admin Panel:**
  - Admins click an "Admin Login" link in the navbar or go directly to `/admin`.
- **Admin Login:**
  - Simple login form for admin credentials.
- **Admin Dashboard:**
  - Navigation with links to Dashboard, Products, Orders, Customers, and Admins.
  - Dashboard shows quick stats (orders, sales, inventory).
- **Inventory Management:**
  - Products page lists all products in a table/grid with edit and delete actions.
  - Add Product button opens a modal or form for new products.
- **Order Management:**
  - Orders page lists all orders with status, customer, and actions to update status or view details.
- **Customer Management:**
  - Customers page lists all users with order history and contact info.
- **Admin Management:**
  - Admins page lists all admin users with options to add, edit, or remove.

**Navigation Summary:**
- Customers use the main navbar for navigation (Products, Cart, Orders).
- Admins use a sidebar in the admin panel for management sections.
- UI is responsive and mobile-friendly, with clear calls to action and feedback for all major actions.

---

## Contact
For questions or support, contact any of the project authors or your instructor.
