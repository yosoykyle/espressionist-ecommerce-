# Customer Data Flow Documentation

This document outlines the data flow for key customer actions in the Espressionist Ecommerce application. It details the interactions between the frontend (Next.js) and backend (Java Spring Boot) systems.

## 1. Viewing Products

### a. Viewing Product List

*   **Frontend Journey:**
    1.  User navigates to the `/products` page (handled by `frontend/app/(customer)/products/page.tsx`).
    2.  A `useEffect` hook within the page component triggers a call to `productService.getAllProducts()` (defined in `frontend/lib/api-service.ts`).
    3.  This service function makes a `GET` request to the backend API endpoint: `/api/products`.
    4.  Upon receiving the product data, the frontend stores it in a state variable.
    5.  The page maps through the product list and renders each product using the `ProductCard` component (`frontend/components/product-card.tsx`).
    6.  Images for products are typically resolved using a path like `/uploads/products/{product.image}` which is handled by the backend's `ProductImageController`.

*   **Backend Process:**
    1.  The `GET /api/products` request is received by `ProductController.java` at the `getAllProducts()` method.
    2.  This controller method calls `productService.getAllActiveProducts()` from `ProductServiceImpl.java`.
    3.  `ProductServiceImpl` queries the database using `productRepository.findAll()`, filtering out any products marked as `archived == true`.
    4.  The list of `Product` entities is then mapped to a list of `ProductDTO` objects.
    5.  This list of `ProductDTO`s is serialized into a JSON array and returned in the HTTP response.

*   **Data Chronology & Format:**
    *   Frontend Request: `GET /api/products`
    *   Backend Response: `200 OK` with JSON body `List<ProductDTO>`
        ```json
        [
          {
            "id": 1,
            "name": "Espresso Blend",
            "price": 15.99,
            "category": "Coffee & Tea",
            "image": "espresso.jpg",
            "stock": 100,
            "description": "Rich and bold espresso.",
            "archived": false
          },
          // ... more products
        ]
        ```

### b. Viewing Product Details

*   **Frontend Journey:**
    1.  On the `/products` page, the user clicks on a `ProductCard`.
    2.  The `onClick` handler of `ProductCard` calls `setSelectedProduct(product)` within `frontend/app/(customer)/products/page.tsx`.
    3.  This updates a state variable, causing the `ProductDetailsDialog` component (`frontend/components/product-details-dialog.tsx`) to open and display the details of the selected product.
    4.  The data for the dialog is sourced from the product data already fetched when loading the product list. No new API call is made just to open the dialog.

*   **Backend Process:** (Not directly involved in displaying details in the dialog if data is pre-fetched, but `getProductById` is available and used by other parts like cart validation)
    1.  If a direct fetch were needed (e.g., deeplink or refresh on a product page if it existed), `productService.getProductById(id)` would be called.
    2.  This sends `GET /api/products/{id}`.
    3.  `ProductController.java` (`getProductById()` method) calls `productService.getProductById(id)` in `ProductServiceImpl.java`.
    4.  `ProductServiceImpl` fetches the product by ID using `productRepository.findById(id)`.
    5.  The `Product` entity is mapped to `ProductDTO` and returned as JSON.

*   **Data Chronology & Format (for `getProductById`):**
    *   Frontend Request: `GET /api/products/{id}`
    *   Backend Response: `200 OK` with JSON body `ProductDTO` or `404 Not Found`.
        ```json
        {
          "id": 1,
          "name": "Espresso Blend",
          "price": 15.99,
          // ... other fields
        }
        ```

## 2. Adding Products to Cart

*   **Frontend Journey:**
    1.  User clicks the "Add to Cart" button on a `ProductCard` or within the `ProductDetailsDialog`.
    2.  The `onAddToCart` handler (in `products/page.tsx` or `ProductDetailsDialog`) calls `addItem(product)` from the `useCart()` hook (context provided by `frontend/components/cart-provider.tsx`).
    3.  Inside `CartProvider`'s `addItem` function:
        *   It first calls `productService.getProductById(newItem.id)` to get the latest product data, especially current `stock` and `archived` status.
        *   If the product is available and not archived, and quantity doesn't exceed stock:
            *   If the item is already in the cart, its quantity is incremented.
            *   If it's a new item, it's added to the cart with quantity 1.
        *   The cart, which is an array of `CartItem` objects, is persisted to `localStorage`.
    4.  A toast notification confirms the action.

*   **Backend Process (for the `getProductById` call during `addItem`):**
    1.  `GET /api/products/{id}` is handled as described in "Viewing Product Details (b)". This is for validation, not for storing cart data on the backend at this stage.

*   **Data Chronology & Format:**
    *   Client-side operation primarily.
    *   `localStorage` stores cart as a JSON string: `key: "espressionist-cart"`, `value: JSON.stringify(CartItem[])`.
        ```typescript
        interface CartItem {
          id: string;
          name: string;
          price: number;
          quantity: number;
          image: string;
          stock: number; // Current stock from backend
        }
        ```

## 3. Viewing the Cart

*   **Frontend Journey:**
    1.  User navigates to `/cart` (handled by `frontend/app/(customer)/cart/page.tsx`).
    2.  The `useCart()` hook retrieves the current cart items from `localStorage`.
    3.  The `CartPage` component also makes an initial `fetch("/api/products")` call (equivalent to `productService.getAllProducts()`) in a `useEffect` hook. This is to get the latest stock levels and availability for all products to compare against cart items and show warnings (e.g., if stock has decreased or a product became unavailable since it was added to the cart).
    4.  The page displays the cart items, quantities, and total price. Users can update quantities or remove items, which again interacts with the `CartProvider` and `localStorage`. Updates to quantity also re-validate against product stock using `productService.getProductById()`.

*   **Backend Process (for the `/api/products` call):**
    1.  `GET /api/products` is handled as described in "Viewing Product List (a)".

*   **Data Chronology & Format:**
    *   Cart data primarily from `localStorage`.
    *   Validation data from `GET /api/products`.

## 4. Checking Out Products

*   **Frontend Journey:**
    1.  From the `/cart` page, user clicks "Proceed to Checkout" and navigates to `/checkout` (handled by `frontend/app/(customer)/checkout/page.tsx`).
    2.  User fills in the shipping information form (name, email, address, etc.).
    3.  User clicks "Place Order". The `handleSubmit` function is triggered:
        *   Client-side form validation is performed.
        *   `validateStock()` function is called:
            *   It iterates through each item in the cart.
            *   For each item, it calls `productService.getProductById(item.id)` to fetch the latest stock information from the backend.
            *   If any product is unavailable, archived, or has insufficient stock, an error toast is shown, and checkout is halted.
        *   If stock validation passes, an `OrderRequestDTO`-like object is constructed with customer details and a list of items (product ID and quantity).
        *   `orderService.placeOrder(orderData)` (from `frontend/lib/api-service.ts`) is called.
        *   This makes a `POST` request to `/api/checkout` with the order data in the request body.
    4.  If the order is successful (HTTP 201 from backend):
        *   The response (which is an `OrderDTO`) is stored in `localStorage` under the key `"last-order"`.
        *   The cart is cleared using `clearCart()` from `CartProvider`.
        *   A success toast is displayed.
        *   User is redirected to `/order-success`.
    5.  If the order fails (e.g., HTTP 400, 409 due to stock conflict during backend processing, or 500):
        *   An error toast is displayed.

*   **Backend Process:**
    1.  The `POST /api/checkout` request is received by `OrderController.java` at the `placeOrder()` method, with the request body deserialized into an `OrderRequestDTO` object.
    2.  The controller calls `orderService.placeOrder(orderRequestDTO)` in `OrderServiceImpl.java`.
    3.  Inside `OrderServiceImpl.placeOrder()`:
        *   A new `Order` entity is created.
        *   Customer details from `OrderRequestDTO` are mapped to the `Order` entity.
        *   A unique order code (e.g., "ESP-1A2B3C") is generated using `generateShortOrderCode()`.
        *   Order status is set to `PENDING`. Order date is set to the current timestamp.
        *   The method iterates through each `OrderItemDTO` in the `orderRequestDTO.getItems()`:
            *   For each item, the corresponding `Product` entity is fetched from the database using `productRepository.findById(itemDTO.getProductId())`.
            *   **Critical Stock Check & Update (Transaction Advantage):**
                *   If the product is not found, or is archived, a `ResourceNotFoundException` or `IllegalStateException` is thrown.
                *   If `product.getStock() < itemDTO.getQuantity()`, an `IllegalArgumentException` (stock conflict) is thrown. This results in an HTTP 400/409 response.
                *   The product's stock is decremented: `product.setStock(product.getStock() - itemDTO.getQuantity())`.
                *   The updated `Product` entity is saved back to the database using `productRepository.save(product)`.
            *   A new `OrderItem` entity is created, populated with product details (name, price, image at the time of order), quantity, and linked to the parent `Order` and the `Product`.
        *   The list of created `OrderItem` entities is added to the `Order`.
        *   The `subtotal` is calculated by summing `price * quantity` for all items.
        *   VAT (Value Added Tax) is calculated (12% of subtotal).
        *   The `total` (subtotal + VAT) is calculated.
        *   The complete `Order` entity (including its `OrderItems`) is saved to the database using `orderRepository.save(order)`.
        *   An order confirmation email is sent to the customer's email address via `emailService.sendOrderConfirmation()`.
        *   The saved `Order` entity is mapped to an `OrderDTO`.
    4.  The `OrderDTO` is serialized into JSON and returned in the HTTP response with a `201 Created` status.

*   **Data Chronology & Format:**
    *   Frontend Request: `POST /api/checkout`
        *   Body: JSON representing `OrderRequestDTO`
            ```json
            {
              "customerName": "John Doe",
              "customerEmail": "john.doe@example.com",
              "customerPhone": "09123456789",
              "customerAddress": "123 Main St",
              "customerCity": "Anytown",
              "customerPostalCode": "12345",
              "customerNotes": "Leave at front door.",
              "items": [
                { "productId": 1, "quantity": 2 },
                { "productId": 3, "quantity": 1 }
              ]
            }
            ```
    *   Backend Response (Success): `201 Created` with JSON body `OrderDTO`
        ```json
        {
          "id": 101,
          "code": "ESP-XYZ123",
          "status": "PENDING",
          "date": "2023-10-27T10:30:00Z",
          "customer": {
            "name": "John Doe",
            "email": "john.doe@example.com",
            // ... other customer fields
          },
          "items": [
            { "productId": 1, "name": "Product A", "price": 10.00, "quantity": 2, "image": "a.jpg" },
            // ... other items
          ],
          "subtotal": 50.00,
          "vat": 6.00,
          "total": 56.00,
          "archived": false
        }
        ```
    *   Backend Response (Failure, e.g., stock issue): `400 Bad Request` or `409 Conflict` with an error message.

## 5. Receiving Order Success Confirmation

*   **Frontend Journey:**
    1.  After a successful checkout, the user is redirected to `/order-success` (handled by `frontend/app/(customer)/order-success/page.tsx`).
    2.  A `useEffect` hook in this page attempts to read the order data object that was stored in `localStorage` under the key `"last-order"` by the checkout page.
    3.  If data is found, it's parsed from JSON and displayed on the page (order code, items, total, customer info).
    4.  If no data is found in `localStorage` (e.g., user navigated directly to this page), they are typically redirected or shown a message.

*   **Backend Process:**
    *   No direct backend interaction on this page. Data is purely client-side from `localStorage`.

*   **Data Chronology & Format:**
    *   Data Source: `localStorage.getItem("last-order")` (JSON string of `OrderDTO`).

## 6. Tracking an Order using Tracking Code

*   **Frontend Journey:**
    1.  User navigates to `/order-status` (handled by `frontend/app/(customer)/order-status/page.tsx`).
    2.  The page displays an input field for the order code.
    3.  User enters their order code (e.g., "ESP-XYZ123") and clicks "Search".
    4.  The `handleSearch` function is triggered:
        *   It calls `orderService.getOrderStatus(orderCode)` (from `frontend/lib/api-service.ts`).
        *   This makes a `GET` request to the backend API endpoint: `/api/order-status/{orderCode}` (where `{orderCode}` is the entered code).
    5.  If the order is found (HTTP 200 from backend):
        *   The response (an `OrderDTO`) is stored in a state variable and displayed on the page.
    6.  If the order is not found (HTTP 404) or another error occurs:
        *   An error message is displayed.

*   **Backend Process:**
    1.  The `GET /api/order-status/{code}` request is received by `OrderController.java` at the `getOrderStatus()` method.
    2.  This controller method calls `orderService.getOrderByCode(code)` from `OrderServiceImpl.java` (note: the controller's `getOrderStatus` directly calls `getOrderByCode` in the service).
    3.  `OrderServiceImpl` queries the database using `orderRepository.findByCode(code)`.
    4.  If an `Order` entity with the given code exists, it's mapped to an `OrderDTO`. Customer details are manually mapped into a nested `CustomerDTO` within the `OrderDTO`.
    5.  The `OrderDTO` is serialized into JSON and returned in the HTTP response with a `200 OK` status.
    6.  If no order is found with that code, `OrderServiceImpl` throws a `ResourceNotFoundException`, which is handled by `GlobalExceptionHandler.java` to return an HTTP `404 Not Found` response.

*   **Data Chronology & Format:**
    *   Frontend Request: `GET /api/order-status/{orderCode}`
    *   Backend Response (Success): `200 OK` with JSON body `OrderDTO` (same format as in checkout success).
    *   Backend Response (Not Found): `404 Not Found` with an error message.
        ```json
        {
          "timestamp": "2023-10-27T12:00:00.000+00:00",
          "status": 404,
          "error": "Not Found",
          "message": "Order not found with code: ESP-INVALID",
          "path": "/api/order-status/ESP-INVALID"
        }
        ```
