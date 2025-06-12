# Prompt for Frontend Update: Align with Secured Backend API

**Objective:**
Update the frontend application to correctly integrate with the recently secured and modified backend API. The primary goals are to implement JWT-based authentication for all necessary API calls, adjust the login/logout flow, and ensure all frontend services correctly interact with the backend endpoints according to their new security policies and response structures.

**Background:**
The backend API has undergone security enhancements. Most admin-related endpoints and several user-facing order processing endpoints now require JWT Bearer token authentication. The login endpoint (`POST /admin/login`) now returns a `JwtResponse` containing the token, instead of full admin details directly.

**Key Tasks & Files to Update (Frontend):**

1.  **Implement JWT Handling & Storage:**
    *   **Files:** Primarily `frontend/lib/api-service.ts` (specifically `authService`), and potentially a new utility module for token storage (e.g., `frontend/lib/auth-utils.ts` or similar).
    *   **Details:**
        *   Modify `authService.login` to:
            *   Expect a `JwtResponse` (e.g., `{ jwttoken: "your_jwt_here" }`) from `POST /admin/login`.
            *   Securely store the received JWT (e.g., in `localStorage` or `sessionStorage`).
        *   Implement `authService.logout` to clear the stored JWT.
        *   Implement `authService.isLoggedIn` to check for the presence and validity (optional: basic check for existence) of the stored JWT.
        *   Implement `authService.getCurrentAdmin`: This should now fetch the stored JWT, and if present, make an authenticated `GET` request to the backend's `/admin/me` endpoint to retrieve the `AdminDTO`.
        *   Create a helper function (perhaps in `api-service.ts` or `auth-utils.ts`) that can be used by other services to retrieve the current JWT for inclusion in API request headers.

2.  **Add JWT Authorization Header to API Calls:**
    *   **Files:** `frontend/lib/api-service.ts` (all service modules like `adminProductService`, `adminOrderService`, `adminUserService`, and parts of `orderService`).
    *   **Details:** Modify all functions that call secured backend endpoints to:
        *   Retrieve the stored JWT.
        *   Add an `Authorization: Bearer <token>` header to the `fetch` request.
        *   **Endpoints requiring this (non-exhaustive, refer to backend `SecurityConfig` and previous analysis):**
            *   All endpoints under `/admin/**` (e.g., product creation/update, order status update, admin user management).
            *   `POST /api/checkout` (`orderService.placeOrder`)
            *   `GET /api/orders/{orderCode}` (`orderService.getOrderByCode`)
            *   `GET /api/order-status/{orderCode}` (`orderService.getOrderStatus`)

3.  **Adapt to API Response Changes:**
    *   **Files:** `frontend/lib/api-service.ts`
    *   **Details:**
        *   `authService.login`: Already covered in point 1.
        *   `adminUserService.deleteAdmin`: Backend now returns the updated `AdminDTO` instead of a boolean. Frontend should adapt to check for a successful HTTP status (200 OK) or use the returned DTO.

4.  **Review and Enhance Error Handling:**
    *   **Files:** `frontend/lib/api-service.ts`
    *   **Details:**
        *   The backend now returns structured error messages for validation failures (HTTP 400 from `GlobalExceptionHandler`). Update frontend error handling to parse and potentially display these messages.
        *   Handle HTTP 401 (Unauthorized) and 403 (Forbidden) errors more gracefully, perhaps by redirecting to login if a token is missing or invalid.

**Relevant Backend Files for Reference (No changes needed in backend for this prompt, but useful for context):**

*   `backend/src/main/java/com/espressionist_ecommerce/config/SecurityConfig.java` (Defines which paths are secured)
*   `backend/src/main/java/com/espressionist_ecommerce/controller/AuthController.java` (Shows `login` returning `JwtResponse` and `/admin/me` endpoint)
*   `backend/src/main/java/com/espressionist_ecommerce/controller/OrderController.java` (Shows new security on checkout/order lookup)
*   `backend/src/main/java/com/espressionist_ecommerce/dto/JwtResponse.java`
*   `backend/src/main/java/com/espressionist_ecommerce/dto/AdminDTO.java`
*   `backend/src/main/java/com/espressionist_ecommerce/exception/GlobalExceptionHandler.java` (Shows structure of validation error responses)

**Testing Considerations:**
*   Thoroughly test all admin functionalities after implementing JWT handling.
*   Test user-facing order placement and order status lookups to ensure they work correctly with the new authentication requirements.
*   Test login and logout flows.
*   Verify that accessing secured pages/actions without being logged in redirects to login or shows an appropriate error.
```
