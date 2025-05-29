# Espressionist E-Commerce Platform

## Overview/Description

The Espressionist E-Commerce Platform is a web application developed as a school project for a fictional business named "Espressionist," which specializes in coffee, art, and culture-related products. The platform includes a user-facing storefront for customers to browse products, manage their shopping cart, and place orders, as well as an admin panel for managing products, orders, and admin users.

## Technologies Used

*   **Backend:** Java 17, Spring Boot 3 (Spring MVC, Spring Data JPA, Spring Security)
*   **Database:** MySQL/MariaDB (intended to be run via Docker)
*   **Frontend Templating:** Thymeleaf
*   **Frontend Styling & JS:** HTML5, Tailwind CSS, Vanilla JavaScript
*   **Build Tool:** Apache Maven
*   **Containerization:** Docker (for the database)

## Features

### User-Facing

*   **Product Catalog:** Browse products with image previews, descriptions, and pricing.
*   **Search & Filtering:** Client-side search by product name and filter by product category.
*   **Shopping Cart:** Fully client-side managed shopping cart (add, update quantity, remove items).
*   **Checkout Process:** Simple checkout form with "Cash on Delivery" as the implied payment method.
*   **Order Confirmation:** Page displaying order success and details.
*   **Order Status Tracking:** Users can check their order status using their order code.
*   **Responsive Design:** User interface adapts to different screen sizes.

### Admin Panel (Login Required)

*   **Secure Admin Login:** Access to the admin panel is protected by credentials.
    *   Default Credentials: Username: `ADMIN`, Password: `Espressionist2025`
*   **Dashboard:** Overview of recent orders and product statistics, including a low-stock alert.
*   **Product Management:**
    *   Create, Read, Update, Delete (CRUD) operations for products.
    *   Image upload functionality for product visuals.
    *   Option to "Archive" products (soft delete).
*   **Order Management:**
    *   View list of all customer orders.
    *   Update order status (Pending, Processing, Shipped, Delivered).
    *   Archive delivered orders.
*   **Admin Account Management:**
    *   CRUD operations for admin users.
    *   Prevention of self-deletion for the currently logged-in admin user.

## Prerequisites

*   Java JDK 17 or later.
*   Apache Maven 3.6+ (or use the included Maven Wrapper `./mvnw`).
*   Docker Desktop (or Docker Engine and Docker Compose) for running the database.
*   A modern web browser (e.g., Chrome, Firefox, Edge, Safari).

## Setup and Installation

**1. Clone the Repository:**

```bash
git clone <repository-url>
cd <repository-directory>
```
(Replace `<repository-url>` with the actual URL and `<repository-directory>` with the folder name)

**2. Database Setup (MySQL/MariaDB via Docker):**

*   Ensure Docker is running on your system.
*   Navigate to the project root directory (where the `docker-compose.yml` file is located).
*   Run the following command to start the database container in detached mode:
    ```bash
    docker-compose up -d
    ```
*   **Database Configuration:**
    *   The application expects the database to be available at `jdbc:mysql://localhost:3306/espressionist_db`.
    *   Default credentials (as typically set in `docker-compose.yml` and `application.properties`):
        *   Username: `espuser`
        *   Password: `esppassword`
    *   Please verify these details in `src/main/resources/application.properties` and `docker-compose.yml` and adjust if they differ in your environment.

**3. Build the Application:**

*   Using the Maven Wrapper (recommended for consistent builds):
    ```bash
    ./mvnw clean install
    ```
*   Alternatively, if you have Maven installed globally and configured in your PATH:
    ```bash
    mvn clean install
    ```

**4. Configure Application (if necessary):**

*   Review `src/main/resources/application.properties`.
*   You might need to adjust settings like the server port (`server.port=8080` by default) or database connection details if you are not using the provided Docker setup or have different credentials.

## Running the Application

**1. Run the Spring Boot application:**

*   There are a few ways to run the application:
    *   **Using Maven Wrapper:**
        ```bash
        ./mvnw spring-boot:run
        ```
    *   **Using global Maven installation:**
        ```bash
        mvn spring-boot:run
        ```
    *   **Running the compiled JAR:**
        After building the project (`mvn clean install`), a JAR file is created in the `target/` directory.
        ```bash
        java -jar target/espressionist-ecommerce-0.0.1-SNAPSHOT.jar 
        ```
        (Note: Replace `espressionist-ecommerce-0.0.1-SNAPSHOT.jar` with the actual JAR file name if it differs.)

**2. Accessing the Application:**

*   **User-Facing Site:** Open your web browser and navigate to:
    `http://localhost:8080/` (or your configured port if changed from the default 8080).
*   **Admin Panel:** Access the admin section via:
    `http://localhost:8080/admin`
    *   **Default Admin Credentials:**
        *   Username: `ADMIN`
        *   Password: `Espressionist2025`

## Project Structure

*   `src/main/java/com/espressionist_ecommerce/`: Core Java backend code.
    *   `EspressionistEcommerceApplication.java`: Main Spring Boot application class.
    *   `config/`: Spring configuration (Security, MVC, etc.).
    *   `controller/`: Spring MVC controllers (handling web requests for user and admin).
    *   `dto/`: Data Transfer Objects.
    *   `exception/`: Custom exception classes.
    *   `model/`: JPA Entities representing database tables.
    *   `repository/`: Spring Data JPA repositories for database interaction.
    *   `service/`: Business logic and service layer.
*   `src/main/resources/`:
    *   `application.properties`: Spring Boot application configuration (database, server port, etc.).
    *   `static/`: Static frontend assets.
        *   `css/`: Custom CSS files (if any, though primarily uses Tailwind).
        *   `js/`: JavaScript files (`cart.js`, `ui.js`).
        *   `images/`: Static images used by the application.
    *   `templates/`: Thymeleaf HTML templates for server-side rendering.
        *   `layout/`: Main layout for user-facing pages.
        *   `admin/layout/`: Main layout for admin panel pages.
        *   Other HTML files for specific views.
*   `pom.xml`: Apache Maven project configuration file, defining dependencies and build settings.
*   `docker-compose.yml`: Docker Compose configuration for setting up and running the MySQL/MariaDB database container.
*   `README.md`: This file.

## API Documentation

API endpoint details and usage for operations like product image retrieval, checkout, and order status updates can be found in `API_DOCUMENTATION.md`. (Note: This file would need to be created separately if detailed API docs are required).

## Contributing

This is primarily a school project. However, contributions or suggestions are welcome. Please follow standard coding practices and submit pull requests for review if you wish to contribute.

---
*This README provides a general guide. Specific configurations or steps might vary slightly based on your local development environment.*
