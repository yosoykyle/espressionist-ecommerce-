# Admin as Super-Admin Data Flow Documentation

This document outlines the data flow for key admin and super-admin actions in the Espressionist Ecommerce application. It details interactions between the frontend (Next.js) and backend (Java Spring Boot), including authentication and data management.

## I. Authentication

### 1. Admin Login

*   **Frontend Trigger:** Admin enters credentials on `/admin` (login page: `frontend/app/admin/page.tsx`) and submits the form.
*   **Frontend Action:**
    1.  `handleLogin` function is called.
    2.  `authService.login(username, password)` (from `frontend/lib/api-service.ts`) is invoked.
    3.  This makes a `POST` request to `/admin/login` with `{ username, password }` in the request body.
    4.  If successful (backend returns JWT):
        *   The JWT is stored in `localStorage`.
        *   `authService.getCurrentAdmin()` is called (`GET /admin/me`) to fetch admin details (e.g., for role checks, welcome message).
        *   If the admin account is `archived`, a message is shown, JWT is cleared, and login is effectively denied.
        *   User is redirected to `/admin/dashboard`.
    5.  If login fails (invalid credentials or other error), an error toast is displayed.
*   **Backend Process:**
    1.  `POST /admin/login` is handled by `AuthController.java` (`login()` method).
    2.  `authService.login(loginRequestDTO)` (backend's `AuthService`) is called.
    3.  This service authenticates the admin against stored credentials (likely hashed passwords, using Spring Security's `AuthenticationManager`).
    4.  If authentication is successful, a JWT is generated using `JwtTokenUtil.java`.
    5.  The admin's `lastLogin` timestamp might be updated.
    6.  A `JwtResponse` (containing the token and possibly some basic user info) is returned.
*   **Data Chronology & Format:**
    *   Frontend Request: `POST /admin/login`
        *   Body: `LoginRequestDTO`
            ```json
            { "username": "admin_user", "password": "password123" }
            ```
    *   Backend Response (Success): `200 OK` with `JwtResponse`
        ```json
        { "jwttoken": "eyJh...", "username": "admin_user", "role": "SUPER_ADMIN" }
        ```
    *   Backend Response (Failure): `401 Unauthorized` or other error status.

### 2. Admin Logout

*   **Frontend Trigger:** Admin clicks the "Logout" button (typically in `AdminLayout.tsx`).
*   **Frontend Action:**
    1.  `authService.logout()` is called.
    2.  JWT is removed from `localStorage`.
    3.  User is redirected to `/admin` (login page).
    4.  An optional `POST /admin/logout` request might be sent to the backend (though `api-service.ts` doesn't explicitly show this for logout, `AuthController` has an endpoint).
*   **Backend Process (if `/admin/logout` is called):**
    1.  `POST /admin/logout` is handled by `AuthController.java` (`logout()` method).
    2.  `authService.logout(token)` could potentially invalidate the token on the server-side if a token blacklist is maintained (not evident if implemented here).
    3.  Returns a success message.
*   **Data Chronology & Format:**
    *   Primarily a client-side `localStorage` operation.
    *   Optional Frontend Request: `POST /admin/logout` (with Authorization header)
    *   Backend Response: `200 OK` with message like `"Logged out successfully"`.

### 3. Get Current Admin Details

*   **Frontend Trigger:** After login, or when `AdminLayout` mounts, to personalize UI or perform role checks.
*   **Frontend Action:**
    1.  `authService.getCurrentAdmin()` is called.
    2.  This makes a `GET` request to `/admin/me`, including the JWT in the `Authorization: Bearer <token>` header.
*   **Backend Process:**
    1.  `GET /admin/me` is handled by `AuthController.java` (`getCurrentAdmin()` method).
    2.  Spring Security (via `JwtRequestFilter.java`) validates the JWT from the header.
    3.  If valid, `authService.getCurrentAdmin()` (backend) retrieves the currently authenticated admin's details (e.g., from Spring Security context or by re-fetching from DB based on username in token).
    4.  The admin details are mapped to `AdminDTO` and returned.
*   **Data Chronology & Format:**
    *   Frontend Request: `GET /admin/me` (Authorization header with JWT)
    *   Backend Response (Success): `200 OK` with `AdminDTO`
        ```json
        { "id": 1, "username": "admin_user", "email": "admin@example.com", "role": "SUPER_ADMIN", "archived": false, "lastLogin": "..." }
        ```
    *   Backend Response (Failure/No Auth): `401 Unauthorized`.

## II. Product Management

*(Assumes admin is logged in and JWT is sent with all requests)*

### 1. View All Products (Admin View)

*   **Frontend Trigger:** Navigating to `/admin/products` (`frontend/app/admin/products/page.tsx`).
*   **Frontend Action:**
    1.  `loadProducts()` calls `productStore.getAll()`, which in turn calls `adminProductService.getAllProducts()`.
    2.  This makes a `GET` request to `/admin/api/products/all`.
    3.  Response (list of `Product` DTOs) is stored in state and displayed in a table.
    4.  UI allows toggling a filter to show active or archived products.
*   **Backend Process:**
    1.  `GET /admin/api/products/all` is handled by `AdminProductController.java` (`getAllProducts()` method).
    2.  Calls `productService.getAllProducts()` (backend's `ProductService`). This implementation fetches all products, including archived ones.
    3.  Entities are mapped to `ProductDTO`s and returned.
*   **Data Chronology & Format:**
    *   Frontend Request: `GET /admin/api/products/all` (with JWT)
    *   Backend Response: `200 OK` with `List<ProductDTO>` (includes `archived` status).

### 2. Create Product

*   **Frontend Trigger:** Admin clicks "Add Product" on `/admin/products`, opening `ProductFormDialog.tsx`. Admin fills form and submits.
*   **Frontend Action:**
    1.  `ProductFormDialog`'s save handler calls `adminProductService.saveProduct(productData)` (where `productData` does not have an `id`).
    2.  This makes a `POST` request to `/admin/api/products` with product data.
    3.  If image is provided, `adminProductService.uploadProductImage(productId, file)` is called after product creation/update (see section 4).
*   **Backend Process:**
    1.  `POST /admin/api/products` is handled by `AdminProductController.java` (`createProduct()` method).
    2.  Requires appropriate role (e.g., "SUPER_ADMIN", "MANAGER" - enforced by Spring Security).
    3.  Calls `productService.createProduct(productDTO)`.
    4.  A new `Product` entity is created, saved, mapped to `ProductDTO`, and returned.
*   **Data Chronology & Format:**
    *   Frontend Request: `POST /admin/api/products` (with JWT)
        *   Body: `ProductDTO` (without `id`, `createdAt`, `updatedAt`)
    *   Backend Response: `201 Created` with created `ProductDTO` (including new `id`).

### 3. Update Product

*   **Frontend Trigger:** Admin clicks "Edit" for a product on `/admin/products`, opening `ProductFormDialog.tsx` pre-filled. Admin modifies data and submits.
*   **Frontend Action:**
    1.  `ProductFormDialog`'s save handler calls `adminProductService.saveProduct(productData)` (where `productData` includes the product `id`).
    2.  This makes a `PUT` request to `/admin/api/products/{id}` with product data.
*   **Backend Process:**
    1.  `PUT /admin/api/products/{id}` is handled by `AdminProductController.java` (`updateProduct()` method).
    2.  Requires appropriate role.
    3.  Calls `productService.updateProduct(id, productDTO)`.
    4.  The existing `Product` entity is fetched, updated, saved, mapped to `ProductDTO`, and returned.
*   **Data Chronology & Format:**
    *   Frontend Request: `PUT /admin/api/products/{id}` (with JWT)
        *   Body: `ProductDTO` (with `id` and fields to update)
    *   Backend Response: `200 OK` with updated `ProductDTO`.

### 4. Upload Product Image

*   **Frontend Trigger:** Inside `ProductFormDialog`, when creating or editing a product, admin selects an image file.
*   **Frontend Action:**
    1.  After the product is saved (created/updated via `saveProduct`), if an image file was selected, `adminProductService.uploadProductImage(productId, file)` is called.
    2.  This makes a `POST` request to `/admin/api/products/upload-image` as `multipart/form-data`, containing `productId` and the `file`.
*   **Backend Process:**
    1.  `POST /admin/api/products/upload-image` is handled by `ProductImageUploadController.java` (`uploadProductImage()` method).
    2.  Requires appropriate role.
    3.  Calls `productService.uploadProductImage(productId, file)`.
    4.  The file is saved to the server's filesystem (e.g., `uploads/products/`).
    5.  The `Product` entity's `image` field is updated with the filename.
    6.  The updated `Product` is saved and returned as `ProductDTO`.
*   **Data Chronology & Format:**
    *   Frontend Request: `POST /admin/api/products/upload-image` (with JWT, as `multipart/form-data`)
        *   Form Data: `productId: <ID>`, `file: <binary_data>`
    *   Backend Response: `200 OK` with updated `ProductDTO` (containing the new `image` filename).

### 5. Archive Product

*   **Frontend Trigger:** Admin clicks "Archive" icon for an active product on `/admin/products`.
*   **Frontend Action:**
    1.  `handleArchiveToggle(product)` calls `adminProductService.archiveProduct(product.id, true)`.
    2.  This makes a `POST` request to `/admin/api/products/{id}/archive`.
*   **Backend Process:**
    1.  `POST /admin/api/products/{id}/archive` is handled by `AdminProductController.java` (`archiveProduct()` method).
    2.  Requires appropriate role.
    3.  Calls `productService.archiveProduct(id)`.
    4.  Sets `archived = true` on the `Product` entity and saves it.
    5.  Returns the updated `ProductDTO`.
*   **Data Chronology & Format:**
    *   Frontend Request: `POST /admin/api/products/{id}/archive` (with JWT)
    *   Backend Response: `200 OK` with updated `ProductDTO` (`archived: true`).

### 6. Restore Product

*   **Frontend Trigger:** Admin clicks "Restore" icon for an archived product on `/admin/products` (when "Show Archived" is active).
*   **Frontend Action:**
    1.  `handleArchiveToggle(product)` calls `adminProductService.archiveProduct(product.id, false)` (Note: frontend service uses `archiveProduct` with a boolean, which maps to correct backend endpoint).
    2.  This makes a `POST` request to `/admin/api/products/{id}/restore`.
*   **Backend Process:**
    1.  `POST /admin/api/products/{id}/restore` is handled by `AdminProductController.java` (`restoreProduct()` method).
    2.  Requires appropriate role.
    3.  Calls `productService.restoreProduct(id)`.
    4.  Sets `archived = false` on the `Product` entity and saves it.
    5.  Returns the updated `ProductDTO`.
*   **Data Chronology & Format:**
    *   Frontend Request: `POST /admin/api/products/{id}/restore` (with JWT)
    *   Backend Response: `200 OK` with updated `ProductDTO` (`archived: false`).

## III. Order Management

*(Assumes admin is logged in and JWT is sent with all requests)*

### 1. View All Orders

*   **Frontend Trigger:** Navigating to `/admin/orders` (`frontend/app/admin/orders/page.tsx`).
*   **Frontend Action:**
    1.  `loadOrders()` calls `orderStore.getAll()`, which in turn calls `adminOrderService.getAllOrders()`.
    2.  This makes a `GET` request to `/admin/api/orders`.
    3.  Response (list of `Order` DTOs) is stored in state and displayed. Filters for status/archived are available.
*   **Backend Process:**
    1.  `GET /admin/api/orders` is handled by `AdminOrderController.java` (`getAllOrders()` method).
    2.  Calls `orderService.getAllOrders()`.
    3.  Entities are mapped to `OrderDTO`s and returned.
*   **Data Chronology & Format:**
    *   Frontend Request: `GET /admin/api/orders` (with JWT)
    *   Backend Response: `200 OK` with `List<OrderDTO>`.

### 2. Update Order Status

*   **Frontend Trigger:** Admin views order details (in `OrderDetailsDialog.tsx` from `/admin/orders`) and changes its status using a dropdown.
*   **Frontend Action:**
    1.  `onStatusChange` handler calls `adminOrderService.updateOrderStatus(orderId, newStatus)`.
    2.  This makes a `PUT` request to `/admin/api/orders/{id}/status?status=NEW_STATUS`.
*   **Backend Process:**
    1.  `PUT /admin/api/orders/{id}/status` is handled by `AdminOrderController.java` (`updateOrderStatus()` method).
    2.  Requires appropriate role (e.g., "SUPER_ADMIN", "MANAGER").
    3.  Calls `orderService.updateOrderStatus(id, status)`.
    4.  The `Order` entity's status is updated, and an email notification might be sent to the customer (as seen in `OrderServiceImpl`).
    5.  The updated `Order` is saved and returned as `OrderDTO`.
*   **Data Chronology & Format:**
    *   Frontend Request: `PUT /admin/api/orders/{id}/status?status=PROCESSING` (with JWT)
    *   Backend Response: `200 OK` with updated `OrderDTO`.

### 3. Archive/Restore Order

*   **Frontend Trigger:** An action within `OrderDetailsDialog` or a dedicated button on the orders list (not explicitly shown but service exists).
*   **Frontend Action:**
    1.  Calls `adminOrderService.archiveOrder(orderId, isArchivingBoolean)`.
    2.  This makes a `POST` request to `/admin/api/orders/{id}/archive?archived=BOOLEAN_VALUE`.
*   **Backend Process:**
    1.  `POST /admin/api/orders/{id}/archive` is handled by `AdminOrderController.java` (`archiveOrder()` method).
    2.  Requires appropriate role.
    3.  Calls `orderService.archiveOrder(id, archivedBoolean)`.
    4.  The `Order` entity's `archived` flag is updated.
    5.  The updated `Order` is saved and returned as `OrderDTO`.
*   **Data Chronology & Format:**
    *   Frontend Request: `POST /admin/api/orders/{id}/archive?archived=true` (with JWT)
    *   Backend Response: `200 OK` with updated `OrderDTO`.

## IV. Admin User Management

*(Assumes current admin is "SUPER_ADMIN" and JWT is sent)*

### 1. View All Admins

*   **Frontend Trigger:** Navigating to `/admin/admins` (`frontend/app/admin/admins/page.tsx`).
*   **Frontend Action:**
    1.  `loadAdmins()` calls `adminStore.getAll()`, which calls `adminUserService.getAllAdmins()`.
    2.  This makes a `GET` request to `/admin/api/admins`.
    3.  Response (list of `Admin` DTOs) is displayed.
*   **Backend Process:**
    1.  `GET /admin/api/admins` is handled by `AdminController.java` (`getAllAdmins()` method).
    2.  Requires "SUPER_ADMIN" role (enforced by Spring Security).
    3.  Calls `adminService.getAllAdmins()`.
    4.  Entities mapped to `AdminDTO`s and returned.
*   **Data Chronology & Format:**
    *   Frontend Request: `GET /admin/api/admins` (with JWT)
    *   Backend Response: `200 OK` with `List<AdminDTO>`.

### 2. Create Admin

*   **Frontend Trigger:** Super Admin clicks "Add Admin" on `/admin/admins`, opening `AdminFormDialog.tsx`. Form is filled and submitted.
*   **Frontend Action:**
    1.  `AdminFormDialog` save handler calls `adminUserService.saveAdmin(adminData)` (no `id`).
    2.  This makes a `POST` request to `/admin/api/admins` with admin data (username, email, password, role).
*   **Backend Process:**
    1.  `POST /admin/api/admins` is handled by `AdminController.java` (`createAdmin()` method).
    2.  Requires "SUPER_ADMIN" role.
    3.  Input `AdminCreationRequestDTO` is validated.
    4.  Calls `adminService.createAdmin(adminCreationRequestDTO)`. Password will be hashed before saving.
    5.  New `Admin` entity saved, mapped to `AdminDTO`, and returned.
*   **Data Chronology & Format:**
    *   Frontend Request: `POST /admin/api/admins` (with JWT)
        *   Body: `AdminCreationRequestDTO` (e.g., `{ "username": "new_admin", "email": "new@adm.com", "password": "securePassword", "role": "MANAGER" }`)
    *   Backend Response: `201 Created` with created `AdminDTO`.

### 3. Update Admin

*   **Frontend Trigger:** Super Admin clicks "Edit" for an admin on `/admin/admins`, opening `AdminFormDialog.tsx`. Data is modified and submitted.
*   **Frontend Action:**
    1.  `AdminFormDialog` save handler calls `adminUserService.saveAdmin(adminData)` (with `id`).
    2.  This makes a `PUT` request to `/admin/api/admins/{id}`. Password field might be optional or handled specially (e.g., "leave blank to keep unchanged").
*   **Backend Process:**
    1.  `PUT /admin/api/admins/{id}` is handled by `AdminController.java` (`updateAdmin()` method).
    2.  Requires "SUPER_ADMIN" role.
    3.  Calls `adminService.updateAdmin(id, adminDTO)`. If password is provided and not empty, it's hashed and updated.
    4.  Existing `Admin` entity updated, saved, mapped to `AdminDTO`, and returned.
*   **Data Chronology & Format:**
    *   Frontend Request: `PUT /admin/api/admins/{id}` (with JWT)
        *   Body: `AdminDTO` (fields to update, password handling is key)
    *   Backend Response: `200 OK` with updated `AdminDTO`.

### 4. Archive Admin

*   **Frontend Trigger:** Super Admin clicks "Archive" (Trash icon) for an admin on `/admin/admins`.
*   **Frontend Action:**
    1.  `handleArchive(admin)` sets state for `ConfirmDialog`.
    2.  On confirmation, `confirmArchive()` calls `adminUserService.deleteAdmin(admin.id)`. (Note: `deleteAdmin` in frontend service maps to archive endpoint).
    3.  This makes a `POST` request to `/admin/api/admins/{id}/archive`.
*   **Backend Process:**
    1.  `POST /admin/api/admins/{id}/archive` is handled by `AdminController.java` (`archiveAdmin()` method).
    2.  Requires "SUPER_ADMIN" role. Cannot archive self.
    3.  Calls `adminService.archiveAdmin(id)`. Sets `archived = true`.
    4.  Updated `Admin` entity saved, mapped to `AdminDTO`, returned.
*   **Data Chronology & Format:**
    *   Frontend Request: `POST /admin/api/admins/{id}/archive` (with JWT)
    *   Backend Response: `200 OK` with updated `AdminDTO` (`archived: true`).

### 5. Restore Admin

*   **Frontend Trigger:** Super Admin clicks "Restore" icon for an archived admin on `/admin/admins`.
*   **Frontend Action:**
    1.  `handleRestore(admin)` sets state for `ConfirmDialog`.
    2.  On confirmation, `confirmRestore()` calls `adminUserService.restoreAdmin(admin.id)`.
    3.  This makes a `POST` request to `/admin/api/admins/{id}/restore`.
*   **Backend Process:**
    1.  `POST /admin/api/admins/{id}/restore` is handled by `AdminController.java` (`restoreAdmin()` method).
    2.  Requires "SUPER_ADMIN" role.
    3.  Calls `adminService.restoreAdmin(id)`. Sets `archived = false`.
    4.  Updated `Admin` entity saved, mapped to `AdminDTO`, returned.
*   **Data Chronology & Format:**
    *   Frontend Request: `POST /admin/api/admins/{id}/restore` (with JWT)
    *   Backend Response: `200 OK` with updated `AdminDTO` (`archived: false`).

## V. Dashboard Data

*   **Frontend Trigger:** Navigating to `/admin/dashboard` (`frontend/app/admin/dashboard/page.tsx`).
*   **Frontend Action:**
    1.  `useEffect` hook calls `initializeData()` from `lib/data-store.ts`.
    2.  `initializeData()` calls:
        *   `productStore.getAll()` (which calls `adminProductService.getAllProducts()`) -> `GET /admin/api/products/all`
        *   `orderStore.getAll()` (which calls `adminOrderService.getAllOrders()`) -> `GET /admin/api/orders`
        *   `adminStore.getAll()` (which calls `adminUserService.getAllAdmins()`) -> `GET /admin/api/admins`
    3.  The data fetched from these API calls is stored in client-side stores (using `zustand` or similar, as implied by `productStore`, etc.).
    4.  The dashboard page then reads from these client-side stores to calculate and display statistics (total products, total orders, active admins, revenue from delivered orders).
*   **Backend Process:**
    *   Handles the three separate `GET` requests as described in their respective sections (II.1, III.1, IV.1).
    *   No single dedicated API endpoint for aggregated dashboard statistics.
*   **Data Chronology & Format:**
    *   Multiple `GET` requests as detailed above.
    *   Calculations for stats are performed client-side based on the fetched data.

## VI. Admin Roles and Permissions Summary

This section summarizes the capabilities of different admin roles based on observations from the frontend UI logic and the backend API structure. The backend `SecurityConfig.java` allows any authenticated admin access to `/admin/api/**` endpoints, implying that more granular permission checks (distinguishing between roles for specific actions) are handled within the backend service methods and/or mirrored in the frontend for UI purposes.

The defined roles in `Admin.java` entity are: `SUPER_ADMIN`, `MANAGER`, `STAFF`.

### 1. `SUPER_ADMIN`

*   **Authentication:**
    *   Can log in and log out.
    *   Can view their own admin details.
*   **Product Management:**
    *   Full CRUD access: View all (active/archived), create, update, upload images, archive, and restore products.
*   **Order Management:**
    *   Full access: View all orders, update order statuses, archive, and restore orders.
*   **Admin User Management:**
    *   Full CRUD access: View all admin users (active/archived), create new admins (can assign any role), update existing admins (role, password, details), archive, and restore admin users.
    *   Constraint: Cannot archive their own account.
*   **Dashboard:**
    *   Can view all dashboard statistics (derived from full data access).

### 2. `MANAGER`

*   **Authentication:**
    *   Can log in and log out.
    *   Can view their own admin details.
*   **Product Management:**
    *   Full CRUD access: View all (active/archived), create, update, upload images, archive, and restore products. (Based on frontend checks like `currentAdmin.role === "MANAGER"` in `products/page.tsx`).
*   **Order Management:**
    *   Full access: View all orders, update order statuses, archive, and restore orders. (Based on frontend checks like `currentAdmin.role === "MANAGER"` in `orders/page.tsx` for status updates).
*   **Admin User Management:**
    *   No access to manage other admin accounts. Frontend UI for admin management is typically restricted.
*   **Dashboard:**
    *   Can view dashboard statistics (derived from their access to product and order data).

### 3. `STAFF`

*   **Authentication:**
    *   Can log in and log out.
    *   Can view their own admin details.
*   **Product Management:**
    *   Likely Read-Only: Can view all products (active/archived).
    *   No CUD access (Create, Update, Delete/Archive, Image Upload), as frontend checks for these actions typically require `SUPER_ADMIN` or `MANAGER`.
*   **Order Management:**
    *   Likely Read-Only: Can view all orders.
    *   No access to update order status or archive/restore orders, as frontend checks require `SUPER_ADMIN` or `MANAGER`.
*   **Admin User Management:**
    *   No access to manage other admin accounts.
*   **Dashboard:**
    *   Can view dashboard statistics (derived from their read-only access to product and order data).

**Note on Permission Enforcement:**
*   **Frontend:** UI elements (buttons, forms) are conditionally rendered or disabled based on the logged-in admin's role by checking `currentAdmin.role`. This provides a user-friendly experience but is not the primary security mechanism.
*   **Backend (SecurityConfig.java):** Ensures that only authenticated users can access any of the `/admin/api/**` routes. It does not perform fine-grained role checks for specific sub-paths or HTTP methods within this block.
*   **Backend (Service Layer):** It is standard practice and highly expected that individual service methods (e.g., in `AdminServiceImpl.java`, `ProductServiceImpl.java`) perform the actual fine-grained role checks before executing sensitive operations (e.g., checking if the authenticated user has `SUPER_ADMIN` role before allowing creation of another admin). This is the authoritative source of security.
