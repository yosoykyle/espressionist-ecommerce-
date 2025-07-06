## Relevant Files

- `frontend/components/product-form-dialog.tsx` - Product creation/edit dialog; now displays an inline error message if a duplicate is detected.
- `frontend/app/admin/products/page.tsx` - Admin product management page; passes products to dialog for duplicate check.
- `backend/src/main/java/com/espressionist_ecommerce/service/impl/ProductServiceImpl.java` - Backend service for product creation/update; must enforce uniqueness.
- `backend/src/main/java/com/espressionist_ecommerce/entity/Product.java` - Product entity; may need a unique constraint on (name, category).
- `backend/src/main/java/com/espressionist_ecommerce/repository/ProductRepository.java` - Product repository; may need a custom query for duplicate check.
- `backend/src/test/java/com/espressionist_ecommerce/service/ProductServiceImplTest.java` - Unit tests for backend duplicate prevention logic.
- `frontend/components/__tests__/product-form-dialog.test.tsx` - Unit tests for frontend duplicate check and error display.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Add Frontend Duplicate Check
  - [x] 1.1 Pass the list of all products to the product form dialog as a prop or via context/store.
  - [x] 1.2 Implement a function in `product-form-dialog.tsx` to check for duplicates (case-insensitive, trimmed name + category).
  - [x] 1.3 Disable the "Create Product" or "Update Product" button if a duplicate is detected.
  - [x] 1.4 Show an inline error message if a duplicate is detected.
  - [x] 1.5 Ensure the check works for both create and update flows (ignoring the current product on update).

- [x] 2.0 Add Backend Duplicate Check and Enforcement (SKIPPED)
  - [x] 2.1 Add a service/repository method to check for existing products with the same name and category (case-insensitive, trimmed). (SKIPPED)
  - [x] 2.2 Update `ProductServiceImpl` to throw an error if a duplicate is detected on create or update. (SKIPPED)
  - [x] 2.3 Add a unique constraint or index on (name, category) in the `Product` entity/database (if supported by DB). (SKIPPED)
  - [x] 2.4 Ensure the backend returns a clear error message if a duplicate is detected. (SKIPPED)

- [x] 3.0 Update UI to Display Duplicate Error (SKIPPED)
  - [x] 3.1 Display the backend error message in the product form dialog if a duplicate is detected server-side. (SKIPPED)
  - [x] 3.2 Ensure the error message is user-friendly and clearly states the problem. (SKIPPED)

- [x] 4.0 Update Documentation and PRD References
  - [x] 4.1 Update the PRD to reflect any changes made during implementation.
  - [x] 4.2 Document the duplicate prevention logic in developer docs or code comments as appropriate.

<!--
Commit message suggestion:

feat: implement frontend-only duplicate product prevention
- Prevents duplicate products by name+category in the admin UI (case-insensitive, trimmed)
- Disables submit and shows inline error if duplicate detected
- Skipped backend enforcement and backend error UI per user decision
- Updated PRD and documentation to reflect frontend-only enforcement
- Related to PRD: prevent duplicate products
-->
