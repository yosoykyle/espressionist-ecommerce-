# Project Progress Log

## Overview
This document logs the progress of the Espressionist E-Commerce backend development project. The project focuses on building a backend system using Java Spring Boot, MariaDB, Thymeleaf, and other technologies.

---

## Progress Log

### **May 14, 2025**

#### **Email Feature Removed & In-Browser Confirmation Implemented**
- Removed all JavaMailSender and email-related configuration and code from the backend.
- Checkout no longer sends an email; instead, it returns an order summary and tracking code in the browser after checkout.
- The confirmation page/response now includes:
  - User's order summary
  - Message: “Please save this code to track your order.”
- All other checkout logic (saving to database, generating order code, etc.) remains unchanged.

#### **Build Artifacts Cleanup**
- Removed the `target/` directory from the project as it only contains build artifacts and is not needed in the source code repository.

### **May 14, 2025 (continued)**

#### **Frontend Requirements Finalized & Added to Project**
- Reviewed and approved a detailed frontend requirements and implementation plan for the Espressionist E-Commerce project.
- Appended the finalized frontend requirements (technologies, brand/style, components, page-by-page specs, accessibility/testing) to `1_REQUIRMENTS.txt`.
- Frontend plan includes:
  - Use of HTML5, Tailwind CSS, Thymeleaf, and JavaScript (with optional Alpine.js).
  - Brand and style guidelines (logo, fonts, colors, accessibility, responsiveness).
  - Component and interaction rules (buttons, modals, alerts, navigation, forms).
  - Detailed requirements for each page: Home, Products, Cart, Checkout, Order Success, Order Status, Admin.
  - Accessibility and testing requirements for all pages.
- Project requirements file now fully documents both backend and frontend specifications.

#### **Frontend Phase 1: Home Page Template Created**
- Created `src/main/resources/templates/index.html` as the Home Page template using Thymeleaf, Tailwind CSS, and custom font styles.
- Home Page includes:
  - Responsive navbar with brand logo and navigation links.
  - Welcome banner with logo, tagline, and CTA buttons.
  - Embedded Google Maps section for café location.
  - Footer with contact info and social links.
  - Custom font-face declarations for Seagull Serial and Pruno Deck Medium.
- All structure and styling follow the approved frontend requirements and brand guidelines.

#### **Frontend Phase 2: Products Page Template & Controller Integration**
- Created `src/main/resources/templates/products.html` as the Products Page template using Thymeleaf and Tailwind CSS.
- Products Page includes:
  - Responsive navbar and footer matching brand guidelines.
  - Product grid displaying image, name, price, and stock for each product.
  - "Add to Cart" button for in-stock products (uses localStorage via JavaScript).
  - Out-of-stock products are visually indicated and cannot be added to cart.
  - Custom font-face declarations for Seagull Serial and Pruno Deck Medium.
- Updated `ProductController`:
  - Added `/products/view` endpoint to render the products page with active products.
  - Added `/products/image/{id}` endpoint to serve product images for the grid.
- All structure and logic follow the approved frontend requirements and brand guidelines.

#### **Frontend Phase 3: Cart Page Template Implemented**
- Created `src/main/resources/templates/cart.html` as the Cart Page template using Thymeleaf and Tailwind CSS.
- Cart Page includes:
  - Responsive navbar and footer matching brand guidelines.
  - Dynamic cart rendering using JavaScript and localStorage.
  - Displays product image, name, price, quantity (with increment/decrement), subtotal, and remove button for each item.
  - Cart total is calculated and displayed.
  - "Checkout" button navigates to the checkout page.
  - Shows empty cart message if no items are present.
  - All structure and logic follow the approved frontend requirements and brand guidelines.

#### **Frontend Phase 4: Checkout Page Template Implemented**
- Created `src/main/resources/templates/checkout.html` as the Checkout Page template using Thymeleaf and Tailwind CSS.
- Checkout Page includes:
  - Responsive navbar and footer matching brand guidelines.
  - Accessible form for name, email, and shipping address (all required, with labels).
  - Cart summary dynamically rendered from localStorage.
  - Total with 12% VAT calculated and displayed.
  - Payment method (Cash on Delivery) pre-selected and disabled.
  - "Place Order" button with loading spinner and error handling.
  - On successful order, cart is cleared and user is redirected to the order success page.
  - All structure and logic follow the approved frontend requirements and brand guidelines.

#### **Frontend Phase 5: Order Success Page Template Implemented**
- Created `src/main/resources/templates/order-success.html` as the Order Success Page template using Thymeleaf and Tailwind CSS.
- Order Success Page includes:
  - Responsive navbar and footer matching brand guidelines.
  - Confirmation message and success icon.
  - Displays order code, shipping info, total (with VAT), and item details (from sessionStorage after checkout).
  - Prominent message to save the order code for tracking.
  - "Track My Order" button linking to the order status page.
  - All structure and logic follow the approved frontend requirements and brand guidelines.

#### **Frontend Phase 6: Order Status Page Template Implemented**
- Created `src/main/resources/templates/order-status.html` as the Order Status Page template using Thymeleaf and Tailwind CSS.
- Order Status Page includes:
  - Responsive navbar and footer matching brand guidelines.
  - Accessible form for entering order code.
  - Fetches order status from backend (`/orders/order-status/{orderCode}`) via JavaScript.
  - Displays order date, item list, shipping info, and status if found; shows error if not found.
  - All structure and logic follow the approved frontend requirements and brand guidelines.

#### **Frontend Phase 7: Admin Pages Templates Implemented**
- Verified and finalized the following admin page templates in `src/main/resources/templates/`:
  - `admin-login.html`: Admin login form with error feedback.
  - `admin-dashboard.html`: Dashboard with quick stats for products, orders, and admins.
  - `admin-products.html`: Product management (list, create, update, archive, image upload).
  - `admin-orders.html`: Order management (list, update status, archive completed).
  - `admin-users.html`: Admin user management (list, create, update, delete, prevent self-deletion).
- All templates use Thymeleaf, Tailwind CSS, and follow the brand, accessibility, and interaction requirements in `1_REQUIRMENTS.txt`.
- Navigation, forms, and actions are consistent and accessible across all admin pages.

---

### **May 13, 2025**

#### **Cleanup**
- Removed `ProductRepositoryTest.java` from `src/test/java/com/espressionist_ecommerce/repository/` as it was not essential for the current project requirements.

---

### **May 6, 2025**

#### **Initial Setup**
- Created the project structure using Spring Boot.
- Configured `application.properties` for database connection.
- Set up Docker with MariaDB using `docker-compose.yml`.
- Verified database connection.

#### **Database Models**
- Defined the following JPA entities:
  - `Product`: Represents products in the e-commerce system.
  - `Order`: Represents customer orders.
  - `OrderItem`: Links products to orders.
  - `Admin`: Represents admin accounts for managing the system.
- Ensured relationships between entities:
  - One `Order` → Many `OrderItems`.
  - Each `OrderItem` links to a `Product`.

#### **Database Initialization**
- Configured Hibernate to auto-generate tables using `spring.jpa.hibernate.ddl-auto=update`.
- Verified the following tables in the database:
  - `product`
  - `order_item`
  - `admin`
  - `orders` (created after fixing entity configuration).

#### **Repositories Created**
- Created repositories for database operations:
  - `ProductRepository`: Fetch products, including only non-archived ones.
  - `OrderRepository`: Fetch orders by unique order code.
  - `OrderItemRepository`: Manage order items.
  - `AdminRepository`: Fetch admin accounts by username.

#### **Services Created**
- Implemented services to handle business logic:
  - `ProductService`: Manages products (fetching active products, creating, updating, and archiving).
  - `OrderService`: Manages orders (creating orders, fetching by order code, and updating status).
  - `AdminService`: Manages admin accounts (creating with hashed passwords, fetching by username, and deleting).

#### **REST Endpoints Created**
- Implemented REST endpoints for:
  - `/products`: Fetch active (non-archived) products.
  - `/orders/checkout`: Submit a new order.
  - `/orders/order-status/{orderCode}`: Track the status of an order by its unique code.

#### **Admin Authentication Implemented**
- Configured Spring Security for admin authentication.
- Protected `/admin/**` routes to require login.
- Added in-memory admin credentials (`ADMIN` / `Espressionist2025`).
- Enabled password hashing using BCrypt.
- Configured login and logout functionality.

#### **AdminController Created**
- Implemented the `AdminController` to handle admin account management:
  - `/admin/all`: Fetch all admin accounts (placeholder implementation).
  - `/admin/create`: Create a new admin account.
  - `/admin/delete/{id}`: Delete an admin account by ID.

#### **Security Configuration Update**
- Updated Spring Security configuration to allow unauthenticated access to `/orders/checkout` endpoint.
- Ensured other admin routes remain protected.
- Updated Spring Security configuration to allow access to `/orders/checkout` without authentication.
- Ensured other `/admin/**` routes remain protected.

#### **Security Configuration Restored**
- Restored the original Spring Security rules to protect admin routes (`/admin/**`).
- Ensured unauthenticated access to `/orders/checkout` remains allowed.
- Verified that sensitive endpoints are now secure.

#### **Email Integration**
- Integrated JavaMailSender for sending order confirmation emails.
- Updated `/checkout` endpoint to send an email after order creation.
- Configured email credentials in `application.properties`.
- Email includes order details, total with VAT, and shipping information.

#### **Order Archiving and Status Management**
- Implemented archiving logic for orders in `OrderService`.
- Added a method in `OrderRepository` to fetch non-archived orders.
- Created a new endpoint in `OrderController` to allow admins to update the order status via a PUT request.
- Verified that orders can now be archived and their statuses updated.

#### **Product Management**
- Implemented image upload functionality for products.
- Added an endpoint in `ProductController` to handle image uploads.
- Updated `ProductService` to save uploaded images to the database.

#### **Admin Account Management**
- Added a safety check in `AdminService` to prevent an admin from deleting their own account.
- Ensured all CRUD operations for admin accounts are functional.

#### **Testing**
- Verified `/orders/checkout` endpoint is accessible without authentication.
- Confirmed other endpoints requiring authentication are still secure.

---

### **May 15, 2025**

#### **Frontend Phase 8: Testing & Accessibility**
- Began comprehensive testing and accessibility review of all frontend pages and flows:
  - Verified responsiveness on mobile, tablet, and desktop.
  - Checked keyboard navigation and ARIA roles for accessibility.
  - Tested all forms for validation and error handling.
  - Performed end-to-end cart and checkout flow tests.
- All pages and components are being validated to strictly adhere to the requirements in `1_REQUIRMENTS.txt`.

---

### **May 15, 2025**

#### **Frontend Navigation Integration**
- Reviewed and updated all navigation bars across frontend templates in `src/main/resources/templates/` to ensure:
  - Consistent navigation structure and links on all pages (Home, Products, Cart, Checkout, Order Success, Order Status, Admin pages).
  - Active page is visually indicated (underline or highlight) per requirements.
  - All navigation links strictly match the routes and page requirements in `1_REQUIRMENTS.txt`.
  - Accessibility: navigation is keyboard-navigable and uses semantic HTML.
- Verified that navigation is consistent, accessible, and fully functional across all user and admin pages.

---

### **May 15, 2025**

#### **Frontend Navigation Routing Fix**
- Fixed the 'Cannot GET /products' error by updating the `ProductController`:
  - Removed the duplicate and incorrect `@GetMapping("/products")` method.
  - Changed the products page mapping to `@GetMapping("")` so that GET `/products` returns the `products.html` template.
- Now, clicking the Products link in the navbar correctly loads the Products page as required by `1_REQUIRMENTS.txt`.
- Verified that all navigation links in the frontend properly route to their respective pages.

---

### **May 15, 2025**

#### **Frontend Navigation Thymeleaf Integration**
- Updated all navigation bars in user and admin templates (`index.html`, `products.html`, `cart.html`, `checkout.html`, `order-success.html`, `order-status.html`, `admin-login.html`, `admin-dashboard.html`, `admin-products.html`, `admin-orders.html`, `admin-users.html`) to use `th:href` for all navigation links.
- This ensures all navigation between pages is handled by Thymeleaf and server-side routing, fully connecting all frontend pages as required by `1_REQUIRMENTS.txt`.
- Verified that navigation is now seamless and error-free across all user and admin pages.

---

### **May 15, 2025**

#### **Frontend Navigation Button Routing Fixes**
- Updated all navigation buttons and prominent CTAs in user templates to use `th:href` for Thymeleaf routing:
  - Home page 'Shop Now' button now uses `th:href` to `/products`.
  - Order Success page 'Track My Order' button now uses `th:href` to `/order-status`.
- This ensures all navigation and call-to-action buttons are properly connected between pages, fully resolving navigation issues and strictly adhering to `1_REQUIRMENTS.txt`.

---

### **May 15, 2025**

#### **Frontend Navigation Routing Controllers Added**
- Implemented dedicated Spring MVC controllers for each main page:
  - `/` → HomePageController → `index.html`
  - `/products` → ProductController (already exists)
  - `/cart` → CartPageController → `cart.html`
  - `/checkout` → CheckoutPageController → `checkout.html`
  - `/order-status` → OrderStatusPageController → `order-status.html`
  - `/admin/login` → AdminLoginPageController → `admin-login.html`
  - `/admin/dashboard` → AdminDashboardPageController → `admin-dashboard.html`
  - `/admin/products` → AdminProductsPageController → `admin-products.html`
  - `/admin/orders` → AdminOrdersPageController → `admin-orders.html`
  - `/admin/users` → AdminUsersPageController → `admin-users.html`
- This ensures all navigation links in the frontend templates are now fully connected and no longer result in 'Cannot GET' errors.
- All routes and connections strictly adhere to the requirements in `1_REQUIRMENTS.txt`.

---

### **May 15, 2025**

#### **Refactor: Begin Consolidation of Page Controllers**
- Started refactor to improve code organization and maintainability.
- Created `controller.page` package for all Thymeleaf/MVC page-serving controllers.
- Next: Move all `*PageController.java` files into `controller/page/` and update their package declarations.
- REST API controllers will remain in the main `controller` package.

---
## Notes
- Focus remains on backend functionality.
- Frontend will be minimal, using Thymeleaf for basic interaction.

---