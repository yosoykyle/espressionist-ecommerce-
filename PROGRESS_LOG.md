# Project Progress Log

## Overview
This document logs the progress of the Espressionist E-Commerce backend development project. The project focuses on building a backend system using Java Spring Boot, MariaDB, Thymeleaf, and other technologies.

---

## Progress Log

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

## Next Steps
- Implement repositories for database operations.
- Develop REST endpoints for product listing, checkout, and order tracking.
- Set up Spring Security for admin authentication.
- Integrate JavaMailSender for order confirmation emails.

---

## Notes
- Focus remains on backend functionality.
- Frontend will be minimal, using Thymeleaf for basic interaction.

---