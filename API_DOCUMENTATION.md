# Espressionist E-Commerce API Documentation

This document outlines the API endpoints for the Espressionist E-Commerce platform. It is intended as a guide for frontend-backend integration and should be updated by the backend team with precise details.

## User-Facing API Endpoints

---

### 1. Get All Products (for dynamic loading)

*   **Method & Path:** `GET /api/products` (Path assumption, frontend currently uses Thymeleaf model for `/products`)
*   **Description:** Retrieves a list of all available products. This might be used for more dynamic frontend scenarios or by other potential clients.
*   **Request (Frontend Perspective):**
    *   Path Parameters: None
    *   Query Parameters:
        *   `category` (optional, string, e.g., "COFFEE_AND_TEA"): Filter by product category.
        *   `search` (optional, string): Filter by search term in product name.
        *   `page` (optional, int): For pagination.
        *   `size` (optional, int): For pagination.
    *   Request Body: None
    *   Headers: None
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `200 OK`
    *   Success Response Body:
        ```json
        [
          {
            "id": "string_product_id_1",
            "name": "Espresso Blend",
            "description": "Rich and bold espresso.",
            "price": 12.99,
            "quantity": 50,
            "category": "COFFEE_AND_TEA",
            "imageUrl": "/api/products/string_product_id_1/image" 
            // Or direct image path if not using the image endpoint
          }
          // ... more products
        ]
        ```
        Or a paginated response structure:
        ```json
        {
          "content": [ /* array of product objects as above */ ],
          "pageable": { /* Spring Pageable details */ },
          "totalPages": 0,
          "totalElements": 0,
          // ... other pagination fields
        }
        ```
    *   Error Status Code(s): `500 Internal Server Error`
    *   Error Response Body: `{ "message": "Error retrieving products" }`
*   **Notes/Placeholders:**
    *   [Backend to confirm actual path if this API exists, and if it supports filtering/pagination.]
    *   [Backend to confirm exact Product DTO structure returned.]

---

### 2. Get Product Image

*   **Method & Path:** `GET /api/products/{id}/image`
*   **Description:** Retrieves the image for a specific product.
*   **Request (Frontend Perspective):**
    *   Path Parameters:
        *   `id` (string/long): The ID of the product.
    *   Query Parameters: None
    *   Request Body: None
    *   Headers: None (Accept header might be `image/*`)
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `200 OK`
    *   Success Response Body: Raw image data (e.g., `image/jpeg`, `image/png`).
    *   Error Status Code(s):
        *   `404 Not Found` (if product or image doesn't exist)
    *   Error Response Body (for 404, if JSON): `{ "message": "Product image not found" }`
*   **Notes/Placeholders:**
    *   [Backend to confirm content type and error handling for missing images (e.g., default image or 404).]

---

### 3. Checkout / Place Order

*   **Method & Path:** `POST /api/checkout`
*   **Description:** Submits a customer's order.
*   **Request (Frontend Perspective):**
    *   Path Parameters: None
    *   Query Parameters: None
    *   Request Body (JSON):
        ```json
        {
          "customerName": "John Doe",
          "customerEmail": "john.doe@example.com",
          "shippingAddress": "123 Main St, Anytown, USA",
          "items": [
            { "productId": "string_or_long_product_id_1", "quantity": 1 },
            { "productId": "string_or_long_product_id_2", "quantity": 2 }
          ]
        }
        ```
    *   Headers:
        *   `Content-Type: application/json`
        *   `X-CSRF-TOKEN`: [If CSRF protection is enabled for POST requests]
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `200 OK` or `201 Created`
    *   Success Response Body (JSON):
        ```json
        {
          "orderCode": "ESP-ORDER-12345",
          "message": "Order placed successfully!" 
          // ... other relevant order details if needed by frontend immediately
        }
        ```
    *   Error Status Code(s):
        *   `400 Bad Request` (e.g., validation errors, stock issues)
        *   `500 Internal Server Error`
    *   Error Response Body (JSON): `{ "message": "Error details, e.g., Item out of stock, Invalid input" }`
*   **Notes/Placeholders:**
    *   [Backend to confirm exact request DTO (`OrderCreateDTO`) and response DTO structure.]
    *   [Backend to detail validation error responses if specific field errors are returned.]
    *   [Backend to confirm CSRF token requirements.]

---

### 4. Get Order Details (for Order Success Page)

*   **Method & Path:** `GET /api/orders/{orderCode}`
*   **Description:** Retrieves details of a confirmed order, typically for the order success page.
*   **Request (Frontend Perspective):**
    *   Path Parameters:
        *   `orderCode` (string): The unique code of the order.
    *   Query Parameters: None
    *   Request Body: None
    *   Headers: None
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `200 OK`
    *   Success Response Body (JSON):
        ```json
        {
          "orderCode": "ESP-ORDER-12345",
          "customerName": "John Doe",
          "customerEmail": "john.doe@example.com",
          "shippingAddress": "123 Main St, Anytown, USA",
          "orderDate": "2023-10-26T10:30:00Z", // ISO 8601 format
          "status": "PENDING", // Or other status string/enum
          "items": [
            { 
              "product": { "name": "Espresso Blend" }, // Or just "productName"
              "name": "Espresso Blend", // Fallback if product object not nested
              "quantity": 1, 
              "price": 12.99 // Price per unit at time of order
            }
            // ... more items
          ],
          "subtotal": 12.99,
          "vat": 1.56, // (subtotal * 0.12)
          "totalWithVAT": 14.55
        }
        ```
    *   Error Status Code(s):
        *   `404 Not Found` (if order code is invalid or order doesn't exist)
        *   `500 Internal Server Error`
    *   Error Response Body (JSON): `{ "message": "Order not found" }`
*   **Notes/Placeholders:**
    *   [Backend to confirm the exact Order DTO structure returned, especially for items and product details within items.]
    *   [Backend to confirm date format for `orderDate`.]

---

### 5. Get Order Status (for Order Status Page)

*   **Method & Path:** `GET /api/order-status/{orderCode}`
*   **Description:** Retrieves the current status and summary of an order for tracking.
*   **Request (Frontend Perspective):**
    *   Path Parameters:
        *   `orderCode` (string): The unique code of the order.
    *   Query Parameters: None
    *   Request Body: None
    *   Headers: None
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `200 OK`
    *   Success Response Body (JSON): (Similar to `/api/orders/{orderCode}` but might be a more focused DTO)
        ```json
        {
          "orderCode": "ESP-ORDER-12345",
          "orderDate": "2023-10-26T10:30:00Z",
          "status": "PROCESSING", // e.g., PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
          "customerName": "John Doe", // Or a more focused shippingInfo object
          "customerEmail": "john.doe@example.com",
          "shippingAddress": "123 Main St, Anytown, USA",
          "items": [ // May or may not include full item details, TBD by backend
            { "name": "Espresso Blend", "quantity": 1, "price": 12.99 } 
          ],
          "totalWithVAT": 14.55 // Optional, but useful for confirmation
        }
        ```
    *   Error Status Code(s):
        *   `404 Not Found`
        *   `500 Internal Server Error`
    *   Error Response Body (JSON): `{ "message": "Order not found or error fetching status" }`
*   **Notes/Placeholders:**
    *   [Backend to confirm the exact Order Status DTO structure. Does it include all items or just a summary?]

---
---

## Admin API Endpoints

---

### 6. Admin Login

*   **Method & Path:** `POST /admin/login`
*   **Description:** Standard Spring Security login endpoint for admin users.
*   **Request (Frontend Perspective):**
    *   Path Parameters: None
    *   Query Parameters: None
    *   Request Body: `application/x-www-form-urlencoded` (standard form submission)
        *   `username`: (string)
        *   `password`: (string)
    *   Headers: `Content-Type: application/x-www-form-urlencoded`
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `302 Found` (redirect to `/admin/dashboard`)
    *   Success Response Body: None (redirect)
    *   Error Status Code(s): `302 Found` (redirect to `/admin/login?error`) or `401 Unauthorized` (depends on Spring Security config)
    *   Error Response Body: None (redirect)
*   **Notes/Placeholders:**
    *   This is typically handled by Spring Security. Documentation is for completeness.
    *   Actual error response (e.g., if a custom AuthenticationFailureHandler is used) might differ.

---

### 7. Admin Logout

*   **Method & Path:** `POST /logout`
*   **Description:** Standard Spring Security logout endpoint.
*   **Request (Frontend Perspective):**
    *   Path Parameters: None
    *   Query Parameters: None
    *   Request Body: None (or standard form submission if CSRF is by form)
    *   Headers: `X-CSRF-TOKEN`: [If CSRF protection is enabled]
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `302 Found` (redirect to `/admin/login?logout`)
    *   Success Response Body: None (redirect)
    *   Error Status Code(s): [Backend to confirm, if any specific errors]
    *   Error Response Body: [Backend to confirm]
*   **Notes/Placeholders:**
    *   This is typically handled by Spring Security.
    *   CSRF token handling is important here.

---

### 8. Get All Products (Admin)

*   **Method & Path:** `GET /admin/api/products` (Path assumption)
*   **Description:** Retrieves a list of all products for the admin panel (might include more details than user-facing API).
*   **Request (Frontend Perspective):**
    *   Path Parameters: None
    *   Query Parameters:
        *   `filter` (optional, string, e.g., "low_stock"): To filter products.
        *   `page`, `size` for pagination.
    *   Request Body: None
    *   Headers: None
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `200 OK`
    *   Success Response Body: Similar to user-facing `GET /api/products` but potentially with more fields (e.g., internal notes, full stock history if any).
        ```json
        [
          {
            "id": "string_product_id_1",
            "name": "Espresso Blend",
            "description": "Rich and bold espresso.",
            "price": 12.99,
            "quantity": 5, // Current stock
            "category": "COFFEE_AND_TEA",
            "archived": false,
            "image": "base64_string_or_image_id_or_null" // Or image path
            // ... other admin-specific fields
          }
        ]
        ```
    *   Error Status Code(s): `500 Internal Server Error`
    *   Error Response Body: `{ "message": "Error retrieving products" }`
*   **Notes/Placeholders:**
    *   [Backend to confirm if this API exists, its path, and if it supports filtering/pagination for admin.]
    *   [Backend to confirm exact Admin Product DTO structure.]
    *   Frontend `admin/products.html` currently seems to load products via Thymeleaf model.

---

### 9. Save Product (Create/Update)

*   **Method & Path:** `POST /admin/products/save`
*   **Description:** Creates a new product or updates an existing one.
*   **Request (Frontend Perspective):**
    *   Path Parameters: None
    *   Query Parameters: None
    *   Request Body: `multipart/form-data`
        *   `id` (string/long, optional for new, required for update)
        *   `name` (string)
        *   `price` (number)
        *   `quantity` (number)
        *   `category` (string, e.g., "COFFEE_AND_TEA")
        *   `description` (string, optional)
        *   `imageFile` (file, optional for update if image not changed)
    *   Headers:
        *   `Content-Type: multipart/form-data` (implicitly set by browser with FormData)
        *   `X-CSRF-TOKEN`: [If CSRF protection is enabled]
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `302 Found` (redirect to `/admin/products`) upon successful save (current behavior of HTML form submission). If changed to `fetch`, could be `200 OK` or `201 Created`.
    *   Success Response Body (if `fetch` and JSON):
        ```json
        {
          "id": "string_product_id",
          "name": "Updated Product Name",
          // ... other product fields
          "message": "Product saved successfully"
        }
        ```
    *   Error Status Code(s):
        *   `400 Bad Request` (validation errors)
        *   `500 Internal Server Error`
    *   Error Response Body (if `fetch` and JSON): `{ "message": "Validation error details or server error" }`
*   **Notes/Placeholders:**
    *   Frontend currently uses standard HTML form submission. If this is to become a `fetch` API, backend needs to return JSON and handle errors accordingly.
    *   [Backend to confirm DTO for product save, especially how `ProductCategory` enum is handled from string.]
    *   [Backend to detail validation error response structure if JSON is returned.]

---

### 10. Archive Product

*   **Method & Path:** `POST /admin/products/archive/{productId}`
*   **Description:** Archives (soft deletes) a product.
*   **Request (Frontend Perspective):**
    *   Path Parameters:
        *   `productId` (string/long)
    *   Query Parameters: None
    *   Request Body: None
    *   Headers: `X-CSRF-TOKEN`: [If CSRF protection is enabled]
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `200 OK` or `204 No Content`
    *   Success Response Body: Optional. Could be empty or a simple success message.
        ```json
        { "message": "Product archived successfully" } 
        ```
    *   Error Status Code(s):
        *   `404 Not Found` (if product ID is invalid)
        *   `500 Internal Server Error`
    *   Error Response Body (JSON): `{ "message": "Error details" }`
*   **Notes/Placeholders:**
    *   [Backend to confirm success status code and response body structure.]

---

### 11. Get All Orders (Admin)

*   **Method & Path:** `GET /admin/api/orders` (Path assumption)
*   **Description:** Retrieves a list of all customer orders for the admin panel.
*   **Request (Frontend Perspective):**
    *   Path Parameters: None
    *   Query Parameters: `page`, `size` for pagination, `status` (string, e.g., "PENDING") for filtering.
    *   Request Body: None
    *   Headers: None
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `200 OK`
    *   Success Response Body: Array of order objects, similar to `/api/orders/{orderCode}` but potentially with more admin-relevant fields.
        ```json
        [
          {
            "id": "string_order_id",
            "orderCode": "ESP-ORDER-12345",
            "customerName": "John Doe",
            "customerEmail": "john.doe@example.com",
            "orderDate": "2023-10-26T10:30:00Z",
            "totalWithVAT": 14.55,
            "shippingAddress": "123 Main St",
            "status": "PENDING"
            // ... other fields like items list if needed on this view directly
          }
        ]
        ```
    *   Error Status Code(s): `500 Internal Server Error`
    *   Error Response Body: `{ "message": "Error retrieving orders" }`
*   **Notes/Placeholders:**
    *   [Backend to confirm if this API exists, its path, and if it supports filtering/pagination.]
    *   [Backend to confirm exact Admin Order DTO structure.]
    *   Frontend `admin/orders.html` currently seems to load orders via Thymeleaf model.

---

### 12. Update Order Status

*   **Method & Path:** `POST /admin/orders/{orderId}/status`
*   **Description:** Updates the status of a specific order.
*   **Request (Frontend Perspective):**
    *   Path Parameters:
        *   `orderId` (string/long)
    *   Query Parameters: None
    *   Request Body (JSON):
        ```json
        { "status": "PROCESSING" } // New status string (e.g., PENDING, PROCESSING, SHIPPED, DELIVERED)
        ```
    *   Headers:
        *   `Content-Type: application/json`
        *   `X-CSRF-TOKEN`: [If CSRF protection is enabled]
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `200 OK`
    *   Success Response Body (JSON):
        ```json
        { 
          "message": "Order status updated successfully",
          "updatedOrder": { /* optional: full updated order object */ }
        }
        ```
    *   Error Status Code(s):
        *   `400 Bad Request` (invalid status value)
        *   `404 Not Found` (order ID invalid)
        *   `500 Internal Server Error`
    *   Error Response Body (JSON): `{ "message": "Error details" }`
*   **Notes/Placeholders:**
    *   [Backend to confirm expected status values and response structure.]

---

### 13. Archive Order

*   **Method & Path:** `POST /admin/orders/{orderId}/archive`
*   **Description:** Archives an order (soft delete, typically for delivered orders).
*   **Request (Frontend Perspective):**
    *   Path Parameters:
        *   `orderId` (string/long)
    *   Query Parameters: None
    *   Request Body: None
    *   Headers: `X-CSRF-TOKEN`: [If CSRF protection is enabled]
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `200 OK` or `204 No Content`
    *   Success Response Body: Optional.
        ```json
        { "message": "Order archived successfully" }
        ```
    *   Error Status Code(s):
        *   `404 Not Found`
        *   `400 Bad Request` (e.g., trying to archive an order that is not yet delivered)
        *   `500 Internal Server Error`
    *   Error Response Body (JSON): `{ "message": "Error details" }`
*   **Notes/Placeholders:**
    *   [Backend to confirm conditions under which an order can be archived.]

---

### 14. Get All Admin Users (Admin)

*   **Method & Path:** `GET /admin/api/users` (Path assumption)
*   **Description:** Retrieves a list of all admin users.
*   **Request (Frontend Perspective):**
    *   Path Parameters: None
    *   Query Parameters: `page`, `size` for pagination.
    *   Request Body: None
    *   Headers: None
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `200 OK`
    *   Success Response Body (JSON):
        ```json
        [
          {
            "id": "string_admin_id_1",
            "username": "ADMIN",
            "email": "admin@example.com",
            "name": "Main Admin",
            "isCurrentUser": true // Boolean, true if this user is the one making the request
            // Roles are assumed to be "ADMIN" for all, not explicitly listed per user for now
          }
        ]
        ```
    *   Error Status Code(s): `500 Internal Server Error`
    *   Error Response Body: `{ "message": "Error retrieving admin users" }`
*   **Notes/Placeholders:**
    *   [Backend to confirm if this API exists, its path, and pagination support.]
    *   [Backend to confirm exact Admin User DTO, especially `isCurrentUser` field inclusion.]
    *   Frontend `admin/users.html` currently seems to load users via Thymeleaf model.

---

### 15. Save Admin User (Create/Update)

*   **Method & Path:** `POST /admin/users/save`
*   **Description:** Creates a new admin user or updates an existing one.
*   **Request (Frontend Perspective):**
    *   Path Parameters: None
    *   Query Parameters: None
    *   Request Body: `application/x-www-form-urlencoded` (standard form submission)
        *   `id` (string/long, optional for new, required for update)
        *   `username` (string, required, cannot be changed on update)
        *   `email` (string, required)
        *   `name` (string, optional)
        *   `password` (string, required for new; optional for update - if blank, password not changed)
        *   `confirmPassword` (string, must match `password` if `password` is provided)
    *   Headers:
        *   `Content-Type: application/x-www-form-urlencoded`
        *   `X-CSRF-TOKEN`: [If CSRF protection is enabled]
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `302 Found` (redirect to `/admin/users`)
    *   Success Response Body: None (redirect)
    *   Error Status Code(s): `400 Bad Request` (validation errors, displayed on re-rendered form via Thymeleaf)
    *   Error Response Body: HTML page with error messages.
*   **Notes/Placeholders:**
    *   Frontend currently uses standard HTML form submission.
    *   [Backend to confirm DTO for admin user save and how password updates (or non-updates) are handled.]
    *   [Backend to detail validation error handling if this were a `fetch` API returning JSON.]

---

### 16. Delete Admin User

*   **Method & Path:** `POST /admin/users/delete/{userId}`
*   **Description:** Deletes an admin user.
*   **Request (Frontend Perspective):**
    *   Path Parameters:
        *   `userId` (string/long)
    *   Query Parameters: None
    *   Request Body: None
    *   Headers: `X-CSRF-TOKEN`: [If CSRF protection is enabled]
*   **Response (Frontend Expectation):**
    *   Success Status Code(s): `200 OK` or `204 No Content`
    *   Success Response Body: Optional.
        ```json
        { "message": "Admin user deleted successfully" }
        ```
    *   Error Status Code(s):
        *   `404 Not Found`
        *   `400 Bad Request` (e.g., trying to delete self, though frontend also prevents this)
        *   `500 Internal Server Error`
    *   Error Response Body (JSON): `{ "message": "Error details" }`
*   **Notes/Placeholders:**
    *   [Backend to confirm conditions for deletion (e.g., cannot delete the last admin).]

---

This outline should serve as a good starting point for the backend team to fill in the specific details.
