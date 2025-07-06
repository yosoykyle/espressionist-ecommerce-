# Product Requirements Document (PRD): Prevent Duplicate Products (Same Name and Category)

## 1. Introduction/Overview
Currently, the system allows admins to create multiple products with the same name and category, which can lead to confusion, inventory errors, and a cluttered product catalog. The goal of this feature is to prevent the creation (and update) of products that would result in duplicate name+category combinations.

## 2. Goals
- Prevent admins from creating a new product with the same name and category as an existing product.

## 3. User Stories
- As an admin, I want to be prevented from creating a product with the same name and category as an existing product so that the catalog remains clean and unambiguous.
- As an admin, I want to see a clear error message if I try to create or update a product to a duplicate name+category combination.

## 4. Functional Requirements
1. The system must check for existing products with the same name (case-insensitive, trimmed) and category before allowing creation of a new product.
2. The system must check for existing products with the same name and category before allowing updates to an existing product.
3. The check must ignore the current product when updating (i.e., allow updating a product if the name+category does not conflict with another product).
4. The check must be case-insensitive and ignore leading/trailing spaces in the name.
5. The system must display a clear error message to the admin if a duplicate is detected (e.g., "A product with this name and category already exists.").
6. The check must apply to all admin users who can create or update products.
7. The check must consider both active and archived products as potential duplicates (unless otherwise specified).

## 5. Non-Goals (Out of Scope)
- This feature will not prevent products with the same name in different categories.
- This feature will not merge or automatically resolve existing duplicates.
- This feature will not affect product deletion or archiving logic.

## 6. Design Considerations
- The error message should be shown inline in the product form dialog, near the name or category field.
- The "Create Product" or "Update Product" button should be disabled if a duplicate is detected (frontend), and the backend should also enforce this rule for data integrity.

## 7. Technical Considerations
- The frontend should check for duplicates using the list of products already loaded in the admin page, if available, to provide instant feedback.
- The backend must enforce the uniqueness constraint to prevent race conditions or bypasses (e.g., via API or concurrent requests).
- Consider adding a unique index on (name, category) in the database for robust enforcement.

## 8. Success Metrics
- No new duplicate products (same name and category) can be created via the admin panel or API.
- Admins receive clear, actionable feedback when attempting to create or update a duplicate.
- Reduction in support tickets or confusion related to duplicate products.

## 9. Open Questions
- Should archived products be considered when checking for duplicates? (Default: Yes, to prevent confusion if restored.)
- Should the check ignore punctuation or special characters in the name? (Default: No, only trim and case-insensitive.)
- Should the uniqueness constraint be enforced at the database level as well?

---

This PRD is intended for a junior developer and provides explicit, actionable requirements for implementing duplicate product prevention in the admin product management feature.
