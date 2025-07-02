# Comprehensive Data Flow: Espressionist Ecommerce System

This document explains, in simple terms and with analogies, how data moves through the entire system—from the frontend to the backend and back again. Each layer, folder, and key file is described so you can understand the journey of a single request.

---

## Analogy: The Restaurant
Imagine your app is a restaurant:
- **Frontend** is the customer and the waiter.
- **Backend** is the kitchen, chef, and manager.
- **Database** is the pantry/storage.

A customer (user) places an order (request), the waiter (frontend) brings it to the kitchen (backend), the chef (service) prepares it, the manager (security/config) checks if the order is allowed, and the pantry (database) provides the ingredients (data). The finished dish (response) is sent back to the customer.

---

## 1. Frontend (Customer & Waiter)
**Folder:** `frontend/`

- **`app/`**: Pages and UI for customers and admins. Example: `app/(customer)/products/page.tsx` shows products.
- **`components/`**: Reusable UI parts (Navbar, ProductCard, etc.).
- **`lib/api-service.ts`**: The main waiter! Sends requests to the backend for data (products, orders, login, etc.).
- **`lib/fetch-wrapper.ts`**: Handles authenticated requests, logs out on errors.
- **`lib/data-store.ts`**: Defines data shapes (Product, Order, Admin, etc.).

**How it works:**
- User clicks a button or loads a page.
- The page/component calls a function in `api-service.ts`.
- `api-service.ts` uses `fetch` or `fetchWithAuth` to send a request to the backend.

---

## 2. Backend (Kitchen, Chef, Manager)
**Folder:** `backend/src/main/java/com/espressionist_ecommerce/`

### a. Controller Layer (Kitchen Counter)
**Folder:** `controller/`
- Files: `ProductController.java`, `OrderController.java`, `AdminController.java`, etc.
- **Role:** Receives requests from the frontend, decides what needs to be done, and sends the order to the chef (service).

### b. Security Layer (Manager at the Door)
**Folder:** `security/`
- Files: `JwtRequestFilter.java`, `JwtTokenUtil.java`, `JwtAuthenticationEntryPoint.java`, `CustomUserDetailsService.java`
- **Role:** Checks if the customer is allowed in (valid token), skips check for public endpoints (menu, login, etc.).

### c. Config Layer (Restaurant Rules)
**Folder:** `config/`
- Files: `WebConfig.java`, `SecurityConfig.java`, `ModelMapperConfig.java`, `AdminDataSeeder.java`
- **Role:** Sets up CORS, security, and other rules for the whole restaurant.

### d. Service Layer (Chef)
**Folder:** `service/` and `service/impl/`
- Files: `ProductService.java`, `OrderService.java`, `AuthService.java`, `ProductServiceImpl.java`, etc.
- **Role:** Prepares the data, applies business logic, and coordinates with the pantry (repository).

### e. Repository Layer (Pantry/Storage)
**Folder:** `repository/`
- Files: `ProductRepository.java`, `OrderRepository.java`, `AdminRepository.java`, etc.
- **Role:** Fetches and saves data to the database.

### f. Entity Layer (Ingredients)
**Folder:** `entity/`
- Files: `Product.java`, `Order.java`, `Admin.java`, etc.
- **Role:** Defines what data looks like in the database.

### g. DTO Layer (Order Slips)
**Folder:** `dto/`
- Files: `ProductDTO.java`, `OrderDTO.java`, `LoginRequestDTO.java`, etc.
- **Role:** Defines what data is sent to/from the frontend (never exposes raw ingredients/entities directly).

### h. Exception Layer (Problem Solver)
**Folder:** `exception/`
- Files: `GlobalExceptionHandler.java`, `ResourceNotFoundException.java`, etc.
- **Role:** Handles errors and sends friendly messages back to the frontend.

---

## 3. The Journey: Step by Step
1. **User Action:** User clicks "Order" on the frontend.
2. **API Call:** `api-service.ts` sends a request to `/api/checkout`.
3. **Security Check:** `JwtRequestFilter.java` checks if the endpoint needs a token.
4. **Controller:** `OrderController.java` receives the request.
5. **Service:** `OrderServiceImpl.java` processes the order, checks business rules.
6. **Repository:** `OrderRepository.java` saves the order to the database.
7. **Entity:** `Order.java` defines how the order is stored.
8. **DTO:** `OrderDTO.java` shapes the response data.
9. **Controller:** Sends the response back to the frontend.
10. **Frontend:** Receives the data and updates the UI.

---

## 4. Summary Table
| Layer         | Folder         | Example File(s)                  | Role/Analogy                |
|---------------|---------------|----------------------------------|-----------------------------|
| Frontend      | frontend/      | app/, components/, api-service.ts| Customer & Waiter           |
| Controller    | controller/    | ProductController.java           | Kitchen Counter             |
| Security      | security/      | JwtRequestFilter.java            | Manager at the Door         |
| Config        | config/        | SecurityConfig.java              | Restaurant Rules            |
| Service       | service/impl/  | ProductServiceImpl.java          | Chef                        |
| Repository    | repository/    | ProductRepository.java           | Pantry/Storage              |
| Entity        | entity/        | Product.java                     | Ingredients                 |
| DTO           | dto/           | ProductDTO.java                  | Order Slip                  |
| Exception     | exception/     | GlobalExceptionHandler.java      | Problem Solver              |

---

## 5. Key Points
- **Frontend** is the user interface and sends requests.
- **Backend** is organized in layers for security, logic, and data.
- **Each layer has a clear job, like a restaurant team.**
- **Data flows from frontend → backend layers → database → backend → frontend.**

You can use this document to explain your codebase in a code review or defense. If you get stuck, just remember the restaurant analogy!
