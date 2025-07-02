# Espressionist Ecommerce: All-in-One Codebase Guide

---

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

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Comprehensive Data Flow (with Analogy)](#comprehensive-data-flow-with-analogy)
4. [Setup & Installation](#setup--installation)
5. [Configuration](#configuration)
6. [Running the System](#running-the-system)
7. [Testing](#testing)
8. [Key Folders, Layers & Responsibilities](#key-folders-layers--responsibilities)
9. [Common Development Tasks](#common-development-tasks)
10. [Troubleshooting & Tips](#troubleshooting--tips)
11. [Contact & Support](#contact--support)

---

## Overview
The Espressionist Ecommerce system is a full-stack web application. The **frontend** is built with Next.js and TypeScript, providing the user interface for customers and admins. The **backend** is a Java Spring Boot application, handling business logic, API endpoints, authentication, and data persistence. The system is designed for maintainability, security, and scalability.

---

## Project Structure

### Backend
```text
backend/
├── src/main/java/com/espressionist_ecommerce/
│   ├── EspressionistEcommerceApplication.java  # Main Spring Boot entry point
│   ├── config/      # App, security, and web configuration
│   ├── controller/  # REST API controllers
│   ├── dto/         # Data Transfer Objects (API request/response)
│   ├── entity/      # JPA entities (database models)
│   ├── exception/   # Global and custom exception handling
│   ├── repository/  # Spring Data JPA repositories
│   ├── security/    # Security and JWT utilities
│   └── service/     # Business logic services
│       └── impl/    # Service implementations
├── resources/       # Application config files
├── logs/            # Application log files
├── uploads/         # Uploaded files
```

### Frontend
```text
frontend/
├── app/         # Main application routes and layouts
├── components/  # Reusable UI and layout components
├── hooks/       # Custom React hooks
├── lib/         # Utility libraries and API communication
├── public/      # Static assets
├── styles/      # Global and modular CSS files
```

---

## Comprehensive Data Flow (with Analogy)

### Analogy: The Restaurant
- **Frontend** is the customer and the waiter.
- **Backend** is the kitchen, chef, and manager.
- **Database** is the pantry/storage.

A customer (user) places an order (request), the waiter (frontend) brings it to the kitchen (backend), the chef (service) prepares it, the manager (security/config) checks if the order is allowed, and the pantry (database) provides the ingredients (data). The finished dish (response) is sent back to the customer.

### 1. Frontend (Customer & Waiter)
- **`app/`**: Pages and UI for customers and admins.
- **`components/`**: Reusable UI parts (Navbar, ProductCard, etc.).
- **`lib/api-service.ts`**: The main waiter! Sends requests to the backend for data (products, orders, login, etc.).
- **`lib/fetch-wrapper.ts`**: Handles authenticated requests, logs out on errors.
- **`lib/data-store.ts`**: Defines data shapes (Product, Order, Admin, etc.).

**How it works:**
- User clicks a button or loads a page.
- The page/component calls a function in `api-service.ts`.
- `api-service.ts` uses `fetch` or `fetchWithAuth` to send a request to the backend.

### 2. Backend (Kitchen, Chef, Manager)
#### a. Controller Layer (Kitchen Counter)
- **Folder:** `controller/`
- **Role:** Receives requests from the frontend, decides what needs to be done, and sends the order to the chef (service).

#### b. Security Layer (Manager at the Door)
- **Folder:** `security/`
- **Role:** Checks if the customer is allowed in (valid token), skips check for public endpoints (menu, login, etc.).

#### c. Config Layer (Restaurant Rules)
- **Folder:** `config/`
- **Role:** Sets up CORS, security, and other rules for the whole restaurant.

#### d. Service Layer (Chef)
- **Folder:** `service/` and `service/impl/`
- **Role:** Prepares the data, applies business logic, and coordinates with the pantry (repository).

#### e. Repository Layer (Pantry/Storage)
- **Folder:** `repository/`
- **Role:** Fetches and saves data to the database.

#### f. Entity Layer (Ingredients)
- **Folder:** `entity/`
- **Role:** Defines what data looks like in the database.

#### g. DTO Layer (Order Slips)
- **Folder:** `dto/`
- **Role:** Defines what data is sent to/from the frontend (never exposes raw ingredients/entities directly).

#### h. Exception Layer (Problem Solver)
- **Folder:** `exception/`
- **Role:** Handles errors and sends friendly messages back to the frontend.

### 3. The Journey: Step by Step
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

### 4. Summary Table
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

### 5. Key Points
- **Frontend** is the user interface and sends requests.
- **Backend** is organized in layers for security, logic, and data.
- **Each layer has a clear job, like a restaurant team.**
- **Data flows from frontend → backend layers → database → backend → frontend.**

---

## Setup & Installation

### Backend
- **Java 17+**, Maven, Docker (for DB)
- Clone repo, configure environment, build with `mvnw.cmd clean install` (Windows) or `./mvnw clean install` (Linux/Mac)
- Start DB: `docker-compose up`
- Run backend: `mvnw.cmd spring-boot:run` or `./mvnw spring-boot:run`

### Frontend
- **Node.js v18+**, npm
- `cd frontend`, `npm install`, `npm run dev`

---

## Configuration
- **Backend:**
  - DB: MariaDB via Docker Compose, config in `application.properties`
  - Logging: `logback-spring.xml`
- **Frontend:**
  - API URLs in `lib/api-service.ts`
  - Env vars in `.env.local`

---

## Running the System
- Start DB: `docker-compose up`
- Start backend: `mvnw.cmd spring-boot:run`
- Start frontend: `npm run dev`

---

## Testing
- Backend: `mvnw.cmd test` (reports in `target/surefire-reports/`)

---

## Key Folders, Layers & Responsibilities
- **config/**: App, security, and web configuration.
- **controller/**: REST API endpoints for admin, products, orders, authentication, and image management.
- **dto/**: Data Transfer Objects for requests and responses.
- **entity/**: JPA entities representing database tables.
- **exception/**: Global exception handling and custom exceptions.
- **repository/**: Interfaces for database CRUD operations using Spring Data JPA.
- **security/**: Security configuration, JWT utilities, and user details service.
- **service/**: Business logic for admin, authentication, order, and product management.
- **service/impl/**: Concrete implementations of service interfaces.
- **frontend/app/**: Main application routes and layouts for both customer and admin interfaces.
- **frontend/lib/**: Utility libraries and API communication.

---

## Common Development Tasks
- **Backend:**
  - Change DB settings: Edit `application.properties`
  - Add API endpoint: Create or update controller in `controller/`
  - Add entity/model: Add to `entity/` and `repository/`
  - Add business logic: Update `service/` and `service/impl/`
- **Frontend:**
  - Add page: Create in `app/`
  - Update API logic: Edit `lib/api-service.ts`
  - Change styles: Edit `app/globals.css`

---

## Troubleshooting & Tips
- **Build fails?**
  - Backend: Check Java version, delete `target/`, rebuild
  - Frontend: Check Node.js version, delete `node_modules/`, reinstall
- **DB issues?**
  - Ensure MariaDB is running, check credentials
- **API errors?**
  - Check backend is running, API URLs are correct
- **Styling not updating?**
  - Restart frontend dev server
- **Env vars not working?**
  - Restart frontend dev server after editing `.env.local`

---

## Contact & Support
For questions or support, contact the project maintainer or your team lead.
