package com.espressionist_ecommerce.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


/**
 * Purpose: Entity class representing an Order in the e-commerce system, including details such as customer information, order status, and financial totals.
 */


@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    // Unique identifier for the order
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Unique code for the order
    @Column(nullable = false, unique = true)
    private String code;
    // Status of the order, using an enum for better readability and maintainability
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
    // Date and time when the order was placed
    @Column(nullable = false)
    private LocalDateTime date;
    // Customer information associated with the order
    @Column(name = "customer_name", nullable = false)
    private String customerName;
    // Customer email address
    @Column(name = "customer_email", nullable = false)
    private String customerEmail;
    // Customer phone number
    @Column(name = "customer_phone", nullable = false)
    private String customerPhone;
    // Customer address, allowing for longer text
    @Column(name = "customer_address", nullable = false, columnDefinition = "TEXT")
    private String customerAddress;
    // Customer city
    @Column(name = "customer_city", nullable = false)
    private String customerCity;
    // Customer postal code
    @Column(name = "customer_postal_code", nullable = false)
    private String customerPostalCode;
    // Additional notes from the customer, allowing for longer text
    @Column(name = "customer_notes", columnDefinition = "TEXT")
    private String customerNotes;
    // Financial details of the order
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    // Shipping cost associated with the order
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal vat;
    // Total amount for the order, including subtotal and shipping costs
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;
    // Flag indicating whether the order is archived, defaulting to false
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean archived = false;
    // List of items in the order, mapped to the OrderItem entity
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    // Timestamps for creation and last update of the order
    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;
    // Timestamp for the last update of the order
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    // --- Shipping Fee fields (persisted at order time) ---
    @Column(name = "shipping_fee_total", precision = 10, scale = 2)
    private BigDecimal shippingFeeTotal;
    /**
     * Enum representing the possible statuses of an order.
     * This improves code readability and maintainability by using descriptive names.
     */
    public enum OrderStatus {
        PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    }
}
