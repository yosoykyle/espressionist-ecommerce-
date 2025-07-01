# Espressionist Ecommerce Backend Manual

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Setup & Installation](#setup--installation)
4. [Configuration](#configuration)
5. [Running the Backend](#running-the-backend)
6. [Testing](#testing)
7. [Key Packages & Responsibilities](#key-packages--responsibilities)
8. [Common Development Tasks](#common-development-tasks)
9. [Troubleshooting & Tips](#troubleshooting--tips)

---

## Overview
The Espressionist Ecommerce backend is a Java Spring Boot application that powers the business logic, API endpoints, authentication, and data persistence for the platform. It is designed for maintainability, security, and scalability.

---

## Project Structure
Below is the full structure of the `backend` folder, with concise descriptions for each main folder and file:

```text
backend/
├── .mvn/                         # Maven wrapper support files
├── BACKEND_README.md             # This manual
├── docker-compose.yml            # Docker Compose config for local MariaDB database
├── logs/                         # Application log files
│   └── espressionist.log         # Main log file (generated at runtime)
├── mvnw, mvnw.cmd                # Maven wrapper scripts (run Maven without installing it)
├── pom.xml                       # Maven project configuration (dependencies, plugins, Java version)
├── src/                          # Source code root
│   ├── main/                     # Main application code
│   │   ├── java/                 # Java source code
│   │   │   └── com/
│   │   │       └── espressionist_ecommerce/
│   │   │           ├── EspressionistEcommerceApplication.java  # Main Spring Boot application entry point
│   │   │           ├── config/      # App, security, and web configuration
│   │   │           │   ├── AdminDataSeeder.java         # Seeds initial admin data
│   │   │           │   ├── ModelMapperConfig.java       # Configures object mapping
│   │   │           │   ├── SecurityConfig.java          # Security setup (auth, roles)
│   │   │           │   └── WebConfig.java               # Web config (CORS, etc.)
│   │   │           ├── controller/  # REST API controllers
│   │   │           │   ├── AdminController.java             # Admin management endpoints
│   │   │           │   ├── AdminOrderController.java        # Admin order operations
│   │   │           │   ├── AdminProductController.java      # Admin product operations
│   │   │           │   ├── AuthController.java              # Authentication endpoints
│   │   │           │   ├── OrderController.java             # Customer order endpoints
│   │   │           │   ├── ProductController.java           # Product listing/details
│   │   │           │   ├── ProductImageController.java      # Product image retrieval
│   │   │           │   └── ProductImageUploadController.java# Product image uploads
│   │   │           ├── dto/         # Data Transfer Objects (API request/response)
│   │   │           │   ├── AdminCreationRequestDTO.java     # Data for creating admins
│   │   │           │   ├── AdminDTO.java                    # Admin DTO
│   │   │           │   ├── CustomerDTO.java                 # Customer DTO
│   │   │           │   ├── JwtResponse.java                 # JWT response structure
│   │   │           │   ├── LoginRequestDTO.java             # Login request data
│   │   │           │   ├── OrderDTO.java                    # Order DTO
│   │   │           │   ├── OrderItemDTO.java                # Order item DTO
│   │   │           │   ├── OrderRequestDTO.java             # Order creation request
│   │   │           │   ├── PasswordUpdateRequestDTO.java    # Password update request
│   │   │           │   └── ProductDTO.java                  # Product DTO
│   │   │           ├── entity/      # JPA entities (database models)
│   │   │           │   ├── Admin.java                       # Admin entity
│   │   │           │   ├── Order.java                       # Order entity
│   │   │           │   ├── OrderItem.java                   # Order item entity
│   │   │           │   └── Product.java                     # Product entity
│   │   │           ├── exception/   # Global and custom exception handling
│   │   │           │   ├── GlobalExceptionHandler.java       # Handles API exceptions
│   │   │           │   └── ResourceNotFoundException.java    # Exception for missing resources
│   │   │           ├── repository/  # Spring Data JPA repositories
│   │   │           │   ├── AdminRepository.java              # Admin data access
│   │   │           │   ├── OrderItemRepository.java          # Order item data access
│   │   │           │   ├── OrderRepository.java              # Order data access
│   │   │           │   └── ProductRepository.java            # Product data access
│   │   │           ├── security/    # Security and JWT utilities
│   │   │           │   ├── CustomUserDetailsService.java     # Loads user details for auth
│   │   │           │   ├── JwtAuthenticationEntryPoint.java  # Handles unauthorized access
│   │   │           │   ├── JwtRequestFilter.java             # JWT filter/validation
│   │   │           │   └── JwtTokenUtil.java                 # JWT utility functions
│   │   │           └── service/     # Business logic services
│   │   │               ├── AdminService.java                 # Admin business logic
│   │   │               ├── AuthService.java                  # Auth business logic
│   │   │               ├── OrderService.java                 # Order business logic
│   │   │               ├── ProductService.java               # Product business logic
│   │   │               └── impl/                             # Service implementations
│   │   │                   ├── AdminServiceImpl.java         # Implements admin business logic
│   │   │                   ├── AuthServiceImpl.java          # Implements authentication logic
│   │   │                   ├── OrderServiceImpl.java         # Implements order business logic
│   │   │                   └── ProductServiceImpl.java       # Implements product business logic
│   │   └── resources/               # Application config files
│   │       ├── application.properties   # Main app configuration
│   │       └── logback-spring.xml      # Logging configuration
│   └── test/                      # Test code
│       └── java/
│           ├── com/
│           └── com_espressionist_ecommerce/
├── target/                        # Build output (auto-generated by Maven)
│   ├── classes/
│   ├── generated-sources/
│   ├── generated-test-sources/
│   ├── maven-status/
│   ├── surefire-reports/          # Test reports
│   └── test-classes/
├── uploads/                       # Uploaded files
│   └── products/                  # Uploaded product images
└── [Help                          # (Unusual folder, check if needed)
```

---

## Setup & Installation

### Prerequisites
- Java 17 or higher
- Maven (or use the provided wrapper scripts)
- Docker (for running the database locally)

### Installation Steps
1. **Clone the repository** and navigate to the backend directory.
2. **Configure environment** (see Configuration section).
3. **Build the project:**
   - On Windows:
     ```powershell
     .\mvnw.cmd clean install
     ```
   - On Linux/Mac:
     ```bash
     ./mvnw clean install
     ```

---

## Configuration

- **Database:**
  - The backend uses MariaDB. You can run it locally using Docker Compose:
    ```powershell
    docker-compose up
    ```
  - Default credentials and database name are set in `docker-compose.yml`.
  - Update `src/main/resources/application.properties` for DB connection, port, or credentials as needed.

- **Application Properties:**
  - `src/main/resources/application.properties` contains all main configuration (DB, server port, etc.).

- **Logging:**
  - Logging is configured in `src/main/resources/logback-spring.xml`.
  - Log files are written to `logs/espressionist.log`.

---

## Running the Backend

- **Start the database** (if not already running):
  ```powershell
  docker-compose up
  ```
- **Run the backend:**
  - On Windows:
    ```powershell
    .\mvnw.cmd spring-boot:run
    ```
  - On Linux/Mac:
    ```bash
    ./mvnw spring-boot:run
    ```
- The backend will be available at `http://localhost:8080` by default.

---

## Testing

- To run all backend tests:
  ```powershell
  .\mvnw.cmd test
  ```
- Test reports are generated in `target/surefire-reports/`.

---

## Key Packages & Responsibilities

- **config/**: Application, security, and web configuration.
- **controller/**: REST API endpoints for admin, products, orders, authentication, and image management.
- **dto/**: Data Transfer Objects for requests and responses.
- **entity/**: JPA entities representing database tables.
- **exception/**: Global exception handling and custom exceptions.
- **repository/**: Interfaces for database CRUD operations using Spring Data JPA.
- **security/**: Security configuration, JWT utilities, and user details service.
- **service/**: Business logic for admin, authentication, order, and product management.
- **service/impl/**: Concrete implementations of service interfaces.

---

## Common Development Tasks

- **Change database settings:** Edit `src/main/resources/application.properties`.
- **Add a new API endpoint:** Create a new controller or add to an existing one in `controller/`.
- **Add a new entity/model:** Add a new class in `entity/` and a corresponding repository in `repository/`.
- **Change logging:** Edit `logback-spring.xml` in `src/main/resources/`.
- **Add business logic:** Implement or update services in `service/` and `service/impl/`.
- **Update dependencies:** Edit `pom.xml`.

---

## Troubleshooting & Tips

- **Build fails?**
  - Ensure Java 17+ is installed and set as your JAVA_HOME.
  - Delete the `target/` directory and rebuild.
- **Database connection issues?**
  - Make sure MariaDB is running (via Docker Compose or your own instance).
  - Check credentials in `application.properties` and `docker-compose.yml`.
- **Port conflicts?**
  - Change the server port in `application.properties` (e.g., `server.port=8081`).
- **Logs not appearing?**
  - Check `logs/espressionist.log` and logback configuration.
- **Tests not running?**
  - Ensure the database is up if tests require DB access.

---

## Contact & Support
For questions or support, please contact the project maintainer or your team lead.
