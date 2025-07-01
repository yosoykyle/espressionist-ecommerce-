# Espressionist Ecommerce Frontend Manual

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Setup & Installation](#setup--installation)
4. [Configuration](#configuration)
5. [Running the Frontend](#running-the-frontend)
6. [Key Folders & Responsibilities](#key-folders--responsibilities)
7. [Common Development Tasks](#common-development-tasks)
8. [Troubleshooting & Tips](#troubleshooting--tips)

---

## Overview
The Espressionist Ecommerce frontend is a modern web application built with Next.js and TypeScript. It provides the user interface for both customers and administrators, handling navigation, state management, and API communication with the backend.

---

## Project Structure
Below is the main structure of the `frontend` folder, focusing on the `/app` and `/lib` directories and their subfolders. Only the first file or folder in each subfolder is shown for brevity. Each entry includes a short description:

```text
frontend/
├── app/                        # Main application routes and layouts
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout for the app
│   ├── (customer)/             # Customer-facing pages
│   │   ├── cart/               # Shopping cart page(s)
│   │   │   └── page.tsx        # Cart page
│   │   ├── checkout/           # Checkout process page(s)
│   │   │   └── page.tsx        # Checkout page
│   │   ├── layout.tsx          # Layout for customer section
│   │   ├── order-status/       # Order status tracking
│   │   │   └── loading.tsx     # Loading state for order status
│   │   ├── order-success/      # Order success confirmation
│   │   │   └── page.tsx        # Order success page
│   │   └── products/           # Product listing and details
│   │       └── loading.tsx     # Loading state for products
│   └── admin/                  # Admin dashboard and management
│       ├── admins/             # Admin user management
│       │   └── loading.tsx     # Loading state for admin users
│       ├── dashboard/          # Admin dashboard overview
│       │   └── page.tsx        # Dashboard page
│       ├── layout.tsx          # Layout for admin section
│       ├── loading.tsx         # Loading state for admin section
│       ├── orders/             # Order management
│       │   └── loading.tsx     # Loading state for orders
│       ├── page.tsx            # Main admin page
│       └── products/           # Product management
│           └── loading.tsx     # Loading state for admin products
|── components/      # Reusable UI and layout components
│   └── ui/          # UI primitives and widgets (buttons, dialogs, etc.)
├── hooks/           # Custom React hooks for state and utilities
├── lib/                        # Utility libraries and API communication
│   ├── api-service.ts          # Handles API requests to the backend
│   ├── data-store.ts           # State management utilities
│   └── utils.ts                # General utility functions
├── public/          # Static assets (images, icons, etc.)
├── styles/          # Global and modular CSS files
```

---

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation Steps
1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

---

## Configuration
- **API Endpoints:**
  - Update API URLs in `lib/api-service.ts` as needed to match your backend.
- **Environment Variables:**
  - Create a `.env.local` file for any runtime configuration (e.g., NEXT_PUBLIC_API_URL).
- **Styling:**
  - Global styles are in `app/globals.css`.

---

## Running the Frontend
- **Start the development server:**
  ```bash
  npm run dev
  # or
  yarn dev
  ```
- The app will be available at `http://localhost:3000` by default.

---

## Key Folders & Responsibilities
- **app/**: Main application routes and layouts for both customer and admin interfaces.
  - **(customer)/**: Customer-facing pages (cart, checkout, products, order status, etc.).
  - **admin/**: Admin dashboard, product and order management, admin user management.
- **lib/**: Utility libraries and API communication.
  - **api-service.ts**: Handles API requests to the backend.
  - **data-store.ts**: State management utilities.
  - **utils.ts**: General utility functions.

---

## Common Development Tasks
- **Add a new page:** Create a new folder or file in the appropriate section of `app/`.
- **Update API logic:** Edit or extend `lib/api-service.ts`.
- **Change global styles:** Edit `app/globals.css`.
- **Add new utilities:** Add to `lib/utils.ts` or create a new file in `lib/`.

---

## Troubleshooting & Tips
- **Build fails?**
  - Ensure Node.js is installed and up to date.
  - Delete `node_modules/` and `package-lock.json` (or `yarn.lock`), then reinstall dependencies.
- **API errors?**
  - Check that the backend is running and API URLs are correct in `lib/api-service.ts`.
- **Styling not updating?**
  - Restart the dev server after major changes to Tailwind or global CSS.
- **Environment variables not working?**
  - Make sure to restart the dev server after editing `.env.local`.

---

## Contact & Support
For questions or support, please contact the project maintainer or your team lead.
