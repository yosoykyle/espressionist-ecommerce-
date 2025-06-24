# Espressionist Ecommerce System: Technology Overview

## Overview
This document provides a high-level summary of the technologies and tools used in the Espressionist Ecommerce system, covering both backend and frontend stacks.

---

## Backend Technologies
- **Language:** Java 17+
- **Framework:** Spring Boot 3.x
- **Build Tool:** Maven (with Maven Wrapper)
- **Database:** MariaDB (managed via Docker Compose)
- **ORM:** Spring Data JPA (Hibernate)
- **Security:** Spring Security, JWT (JSON Web Tokens)
- **Object Mapping:** ModelMapper
- **Testing:** JUnit, Spring Boot Test, Spring Security Test
- **Logging:** Logback
- **Containerization:** Docker (for database and local development)

---

## Frontend Technologies
- **Language:** TypeScript
- **Framework:** Next.js 15 (React-based)
- **Styling:** Tailwind CSS, PostCSS
- **Component Library:** shadcn/ui (custom and reusable UI components)
- **State Management:** React Context, custom hooks
- **API Communication:** REST (via custom API service in `lib/`)
- **Build Tool:** Next.js built-in tooling
- **Package Management:** npm

---

## Shared & Supporting Tools
- **Version Control:** Git
- **Configuration:** Environment variables (`.env.local`), application properties, and Docker Compose YAML
- **Type Checking:** TypeScript (frontend), Java (backend)
- **Testing:** JUnit (backend), built-in Next.js/React testing (frontend, if enabled)
- **Static Assets:** Served from `frontend/public/`

---

## Folder Structure Highlights
- `backend/` — Java Spring Boot backend
- `frontend/` — Next.js/TypeScript frontend
- `docker-compose.yml` — Database and service orchestration

---

## How the Stack Works Together
- The **frontend** (Next.js) communicates with the **backend** (Spring Boot) via RESTful API endpoints.
- The **backend** persists data in a **MariaDB** database, managed locally with Docker Compose.
- Both projects use modern, type-safe languages and are designed for scalability and maintainability.

---

## Contact
For more details, see the respective backend and frontend manuals or contact the project maintainer.
