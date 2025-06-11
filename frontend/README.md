# espressionist - Frontend

A modern café website for espressionist, combining coffee culture with artistic expression. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🎨 About espressionist

espressionist is more than just a café – it's a community hub where coffee culture meets artistic expression in Santa Rosa, Philippines. Our website provides both customer-facing features and comprehensive admin management tools.

**Tagline**: *coffee. canvas. culture.*

## ✨ Features

### Customer Features
- **Product Catalog**: Browse coffee, tea, art merchandise, and gift sets
- **Shopping Cart**: Add items, manage quantities, and real-time stock validation
- **Order Placement**: Secure checkout with customer information
- **Order Tracking**: Track order status using order codes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Admin Features
- **Dashboard**: Overview of products, orders, revenue, and admin statistics
- **Product Management**: Create, edit, archive products with image uploads
- **Order Management**: View, update order status, and manage customer orders
- **Admin Management**: Manage administrator accounts and permissions
- **Real-time Updates**: Live data synchronization across all admin panels

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Data Storage**: localStorage (with API service layer for future backend integration)
- **State Management**: React Context API
- **Form Handling**: React Hook Form patterns
- **Notifications**: Custom toast system

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd espressionist-frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages & Routes

### Public Routes
- `/` - Homepage with café information and features
- `/products` - Product catalog with search and filtering
- `/cart` - Shopping cart management
- `/checkout` - Order placement form
- `/order-success` - Order confirmation page
- `/order-status` - Order tracking by code

### Admin Routes
- `/admin` - Admin login page
- `/admin/dashboard` - Admin dashboard with statistics
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/admins` - Administrator management

## 🔐 Admin Access

**Demo Credentials:**
- Username: `admin`
- Password: `password`

## 🏗 Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── order-status/      # Order tracking
│   ├── order-success/      # Order confirmation
│   ├── products/          # Product catalog
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── admin-layout.tsx  # Admin panel layout
│   ├── cart-provider.tsx # Shopping cart context
│   ├── navbar.tsx        # Main navigation
│   └── footer.tsx        # Site footer
├── lib/                  # Utilities and services
│   ├── api-service.ts    # API abstraction layer
│   ├── data-store.ts     # localStorage data management
│   └── utils.ts          # Utility functions
└── hooks/                # Custom React hooks
    └── use-toast.ts      # Toast notifications
\`\`\`

## 🎨 Design System

### Brand Colors
- **Primary Orange**: `#f56401` - Main brand color
- **Beige**: `#f5f5dc` - Secondary background color
- **Typography**: Inter font family

### Component Library
Built with shadcn/ui components:
- Buttons, Cards, Forms, Dialogs
- Navigation, Badges, Alerts
- Data tables and layouts

## 💾 Data Management

Currently uses localStorage for data persistence with a service layer architecture:

### Data Models
- **Products**: Name, price, category, stock, description, images
- **Orders**: Customer info, items, status, totals, tracking codes
- **Admins**: Username, email, role, permissions, status

### API Service Layer
Designed for easy backend integration:
- User-facing services (products, orders)
- Admin services (authentication, management)
- Future Spring Boot API endpoints documented

## 🔄 Future Backend Integration

The frontend is architected for seamless Spring Boot backend integration:

### Planned API Endpoints
\`\`\`
# User APIs
GET /api/products
POST /api/checkout
GET /api/order-status/{code}

# Admin APIs
POST /admin/login
GET /admin/api/products
POST /admin/products/save
GET /admin/api/orders
POST /admin/orders/{id}/status
\`\`\`

### Integration Steps
1. Replace localStorage calls with fetch() requests
2. Add JWT authentication handling
3. Implement proper error handling
4. Add form validation matching backend rules

## 🧪 Development

### Available Scripts
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
\`\`\`

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Component-based architecture

## 📦 Key Dependencies

\`\`\`json
{
  "next": "^15.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.0.0",
  "@radix-ui/react-*": "Various UI primitives",
  "lucide-react": "^0.400.0",
  "class-variance-authority": "^0.7.0"
}
\`\`\`

## 🌟 Features in Detail

### Shopping Cart
- Real-time stock validation
- Persistent cart across sessions
- Quantity management with stock limits
- Price calculations with VAT

### Order Management
- Unique order code generation
- Status tracking (Pending → Processing → Shipped → Delivered)
- Customer information management
- Order history and archiving

### Admin Dashboard
- Real-time statistics
- Product inventory management
- Order status updates
- User role management

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interfaces
- Optimized images and performance

## 🔒 Security Considerations

- Client-side validation (to be complemented with server-side)
- XSS prevention through React's built-in protections
- Input sanitization
- Secure admin authentication flow

## 🚀 Deployment

### Build for Production
\`\`\`bash
npm run build
npm run start
\`\`\`

### Environment Variables
\`\`\`env
# Future backend integration
NEXT_PUBLIC_API_URL=https://api.espressionist.ph
NEXT_PUBLIC_ADMIN_URL=https://admin.espressionist.ph
\`\`\`

## 📞 Contact & Support

- **Location**: 109 Rizal Blvd, Santa Rosa, Philippines
- **Phone**: 0995 965 9332
- **Email**: espressionist.ph@gmail.com
- **Instagram**: [@espressionist.ph](https://www.instagram.com/espressionist.ph)
- **Facebook**: [espressionist.ph](https://www.facebook.com/espressionist.ph)

## 📄 License

This project is proprietary software for espressionist café.

---

**Built with ❤️ for the espressionist community**

---

## 🔄 Spring Boot Backend Integration

This frontend is designed to seamlessly integrate with a Java Spring Boot backend using MariaDB/MySQL database. The following documentation provides comprehensive instructions for implementing the backend.

### Backend Architecture

The application follows a standard three-tier architecture:
- **Frontend**: React/Next.js application (this repository)
- **Backend**: Spring Boot REST API with JWT authentication
- **Database**: MariaDB/MySQL running in Docker container

### Database Schema

Spring Boot will automatically create the following tables using JPA annotations:

#### Products Table
\`\`\`sql
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    stock INT NOT NULL DEFAULT 0,
    description TEXT,
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
\`\`\`

#### Orders Table
\`\`\`sql
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_city VARCHAR(100) NOT NULL,
    customer_postal_code VARCHAR(20) NOT NULL,
    customer_notes TEXT,
    subtotal DECIMAL(10,2) NOT NULL,
    vat DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
\`\`\`

#### Order Items Table
\`\`\`sql
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    image VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
\`\`\`

#### Admins Table
\`\`\`sql
CREATE TABLE admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Super Admin', 'Manager', 'Staff') NOT NULL,
    archived BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
\`\`\`

### API Endpoints

#### Public Endpoints (Customer-facing)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/api/products` | Get all active products | - | `Product[]` |
| GET | `/api/products/{id}` | Get product by ID | - | `Product` |
| GET | `/api/products/{id}/image` | Get product image | - | Image file |
| POST | `/api/checkout` | Place an order | `OrderRequest` | `Order` |
| GET | `/api/orders/{code}` | Get order by code | - | `Order` |
| GET | `/api/order-status/{code}` | Get order status | - | `Order` |

#### Admin Endpoints (Protected)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| POST | `/admin/login` | Admin login | `{ username, password }` | JWT token |
| POST | `/admin/logout` | Admin logout | - | Success message |
| GET | `/admin/api/products/all` | Get all products (including archived) | - | `Product[]` |
| POST | `/admin/api/products` | Create product | `Product` | `Product` |
| PUT | `/admin/api/products/{id}` | Update product | `Product` | `Product` |
| POST | `/admin/api/products/{id}/archive` | Archive product | - | `Product` |
| POST | `/admin/api/products/{id}/restore` | Restore product | - | `Product` |
| GET | `/admin/api/orders` | Get all orders | - | `Order[]` |
| PUT | `/admin/api/orders/{id}/status` | Update order status | `{ status: String }` | `Order` |
| POST | `/admin/api/orders/{id}/archive` | Archive order | - | `Order` |
| GET | `/admin/api/admins` | Get all admins | - | `Admin[]` |
| POST | `/admin/api/admins` | Create admin | `Admin` | `Admin` |
| PUT | `/admin/api/admins/{id}` | Update admin | `Admin` | `Admin` |
| POST | `/admin/api/admins/{id}/archive` | Archive admin | - | `Admin` |

### Spring Boot Project Structure

\`\`\`
src/
├── main/
│   ├── java/
│   │   └── com/espressionist/cafe/
│   │       ├── EspressonistCafeApplication.java
│   │       ├── config/
│   │       │   ├── SecurityConfig.java
│   │       │   ├── JwtConfig.java
│   │       │   └── CorsConfig.java
│   │       ├── entity/
│   │       │   ├── Product.java
│   │       │   ├── Order.java
│   │       │   ├── OrderItem.java
│   │       │   └── Admin.java
│   │       ├── repository/
│   │       │   ├── ProductRepository.java
│   │       │   ├── OrderRepository.java
│   │       │   ├── OrderItemRepository.java
│   │       │   └── AdminRepository.java
│   │       ├── service/
│   │       │   ├── ProductService.java
│   │       │   ├── OrderService.java
│   │       │   ├── AdminService.java
│   │       │   └── AuthService.java
│   │       ├── controller/
│   │       │   ├── ProductController.java
│   │       │   ├── OrderController.java
│   │       │   ├── AdminProductController.java
│   │       │   ├── AdminOrderController.java
│   │       │   ├── AdminController.java
│   │       │   └── AuthController.java
│   │       ├── dto/
│   │       │   ├── ProductDTO.java
│   │       │   ├── OrderDTO.java
│   │       │   ├── OrderRequestDTO.java
│   │       │   └── AdminDTO.java
│   │       └── security/
│   │           ├── JwtAuthenticationEntryPoint.java
│   │           ├── JwtRequestFilter.java
│   │           └── JwtTokenUtil.java
│   └── resources/
│       ├── application.properties
│       └── data.sql (optional initial data)
\`\`\`

### Docker Configuration

#### docker-compose.yml
\`\`\`yaml
services:
  db:
    image: mariadb:latest
    container_name: espressionist_db
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: espressionist_ecommerce
      MYSQL_USER: espressionist_user
      MYSQL_PASSWORD: yourpassword
    ports:
      - "3306:3306"
    volumes:
      - espressionist_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
volumes:
  espressionist_data:
\`\`\`

### Spring Boot Dependencies

Add these dependencies to your `pom.xml`:

\`\`\`xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Database -->
    <dependency>
        <groupId>org.mariadb.jdbc</groupId>
        <artifactId>mariadb-java-client</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>

    <!-- Utilities -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.modelmapper</groupId>
        <artifactId>modelmapper</artifactId>
        <version>3.1.1</version>
    </dependency>
</dependencies>
\`\`\`

### Key Entity Examples

#### Product.java
\`\`\`java
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(nullable = false)
    private String category;
    
    private String image;
    
    @Column(nullable = false)
    private Integer stock;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private boolean archived = false;
    
    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
\`\`\`

#### Order.java
\`\`\`java
@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String code;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.Pending;
    
    @Column(nullable = false)
    private LocalDateTime date;
    
    @Column(name = "customer_name", nullable = false)
    private String customerName;
    
    @Column(name = "customer_email", nullable = false)
    private String customerEmail;
    
    @Column(name = "customer_phone", nullable = false)
    private String customerPhone;
    
    @Column(name = "customer_address", nullable = false, columnDefinition = "TEXT")
    private String customerAddress;
    
    @Column(name = "customer_city", nullable = false)
    private String customerCity;
    
    @Column(name = "customer_postal_code", nullable = false)
    private String customerPostalCode;
    
    @Column(name = "customer_notes", columnDefinition = "TEXT")
    private String customerNotes;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal vat;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;
    
    private boolean archived = false;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    
    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum OrderStatus {
        Pending, Processing, Shipped, Delivered, Cancelled
    }
}
\`\`\`

### Application Configuration

#### application.properties
\`\`\`properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/espressionist?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=espressionist
spring.datasource.password=espressionist
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5InnoDBDialect
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=espressonistSecretKey2024
jwt.expiration=86400

# Server Configuration
server.port=8080

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Logging
logging.level.com.espressionist.cafe=DEBUG
logging.level.org.springframework.security=DEBUG
\`\`\`

### Frontend Integration Steps

To integrate the frontend with the Spring Boot backend:

1. **Update Environment Variables**
   \`\`\`env
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8080
   \`\`\`

2. **Modify API Service Layer**
   Replace localStorage operations in `lib/api-service.ts` with actual HTTP requests to the Spring Boot endpoints.

3. **Add JWT Token Handling**
   \`\`\`typescript
   // Add to api-service.ts
   const getAuthHeaders = () => {
     const token = localStorage.getItem('admin-token');
     return token ? { 'Authorization': `Bearer ${token}` } : {};
   };
   \`\`\`

4. **Update Product Service**
   \`\`\`typescript
   export const productService = {
     getAllProducts: async (): Promise<Product[]> => {
       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
       if (!response.ok) throw new Error('Failed to fetch products');
       return response.json();
     },
     // ... other methods
   };
   \`\`\`

5. **Update Admin Services**
   \`\`\`typescript
   export const adminProductService = {
     getAllProducts: async (): Promise<Product[]> => {
       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/api/products/all`, {
         headers: getAuthHeaders()
       });
       if (!response.ok) throw new Error('Failed to fetch products');
       return response.json();
     },
     // ... other methods
   };
   \`\`\`

### Development Workflow

1. **Start MariaDB Container**
   \`\`\`bash
   docker-compose up mariadb -d
   \`\`\`

2. **Run Spring Boot Application**
   \`\`\`bash
   cd backend
   ./mvnw spring-boot:run
   \`\`\`

3. **Run Frontend Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Access Applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:3306

### Production Deployment

For production deployment:

1. **Build and Deploy with Docker**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

2. **Environment Variables**
   Set production environment variables for database connection, JWT secret, and API URLs.

3. **SSL/HTTPS Configuration**
   Configure SSL certificates for both frontend and backend in production.

### Security Considerations

- JWT tokens for admin authentication
- CORS configuration for frontend-backend communication
- Input validation and sanitization
- SQL injection prevention through JPA
- Password encryption using BCrypt
- Rate limiting for API endpoints

This backend integration maintains the same user experience while providing a robust, scalable, and secure foundation for the Espressionist Café application.
