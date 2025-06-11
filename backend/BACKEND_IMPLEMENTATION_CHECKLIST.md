# Espressionist Café Backend Implementation Checklist

This checklist is based on the frontend requirements and documentation. Follow each step to ensure a robust, scalable, and secure backend that integrates seamlessly with the Next.js frontend.

---

## 1. Project Setup
- [x] Initialize Spring Boot project (Maven)
- [x] Add dependencies: Spring Web, Spring Data JPA, Spring Security, Validation, MariaDB, JWT, Lombok, ModelMapper
- [x] Set up Docker Compose for MariaDB
- [x] Configure `application.properties` for DB, JWT, file uploads, and CORS

## 2. Database Schema & Entities
- [x] Create JPA entities:
    - [x] Product
    - [x] Order
    - [x] OrderItem
    - [x] Admin
- [x] Ensure all fields and relationships match the frontend and README

## 3. Repositories
- [x] Create Spring Data JPA repositories:
    - [x] ProductRepository
    - [x] OrderRepository
    - [x] OrderItemRepository
    - [x] AdminRepository

## 4. DTOs & Mappers
- [x] Define DTOs for API requests/responses:
    - [x] ProductDTO
    - [x] OrderDTO
    - [x] OrderRequestDTO
    - [x] AdminDTO
- [x] Set up ModelMapper or manual mapping

## 5. Service Layer
- [x] Implement business logic services:
    - [x] ProductService
    - [x] OrderService
    - [x] AdminService
    - [x] AuthService
- [x] Handle validation, stock checks, order code generation, etc.

## 6. Controllers (REST API)
- [x] Public Endpoints:
    - [x] GET `/api/products` — List products
    - [x] GET `/api/products/{id}` — Product details
    - [x] GET `/api/products/{id}/image` — Product image
    - [x] POST `/api/checkout` — Place order
    - [x] GET `/api/orders/{code}` — Get order by code
    - [x] GET `/api/order-status/{code}` — Track order
- [x] Admin Endpoints (JWT protected):
    - [x] POST `/admin/login` — Admin login
    - [x] POST `/admin/logout` — Admin logout
    - [x] GET `/admin/api/products/all` — All products (including archived)
    - [x] POST `/admin/api/products` — Create product
    - [x] PUT `/admin/api/products/{id}` — Update product
    - [x] POST `/admin/api/products/{id}/archive` — Archive product
    - [x] POST `/admin/api/products/{id}/restore` — Restore product
    - [x] GET `/admin/api/orders` — All orders
    - [x] PUT `/admin/api/orders/{id}/status` — Update order status
    - [x] POST `/admin/api/orders/{id}/archive` — Archive order
    - [x] GET `/admin/api/admins` — List admins
    - [x] POST `/admin/api/admins` — Create admin
    - [x] PUT `/admin/api/admins/{id}` — Update admin
    - [x] POST `/admin/api/admins/{id}/archive` — Archive admin

## 7. Security
- [x] Configure Spring Security
    - [x] JWT authentication for admin endpoints
    - [x] Password hashing (BCrypt)
    - [x] Role-based access control
- [x] Implement login endpoint to issue JWTs

## 8. File Uploads
- [x] Support image uploads for products (store file paths in DB, files in `/static` or cloud storage)

## 9. Configuration
- [x] Set up `application.properties` for DB, JWT, file upload, and CORS
- [x] Configure logging and error handling

## 10. Testing & Validation
- [x] Write unit and integration tests for services and controllers
- [ ] Test all endpoints with the frontend

## 11. Deployment
- [ ] Use Docker Compose for local development (MariaDB)
- [ ] Prepare for production deployment (environment variables, SSL, etc.)

---

**Use this checklist as your implementation guide. Mark each item as complete as you progress.**
