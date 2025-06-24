package com.espressionist_ecommerce.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Purpose: Entity class representing a Product in the e-commerce system, including details such as name, price, category, stock, and description.
 */
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    // Unique identifier for the product
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Name of the product
    @Column(nullable = false)
    private String name;
    // Price of the product
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    // Category of the product
    @Column(nullable = false)
    private String category; // Allowed values: "Coffee & Tea", "Art & Merch", "Gift Set", "Gear"
    // Image URL of the product
    private String image;
    // Stock quantity of the product
    @Column(nullable = false)
    private Integer stock;
    // Description of the product, allowing for longer text
    @Column(columnDefinition = "TEXT")
    private String description;
    // Indicates whether the product is archived, default is false
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean archived = false;
    // Timestamps for creation and last update
    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;
    // Timestamp for the last update
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    // Version field for optimistic locking to prevent concurrent updates
    @Version
    private Long version; // For optimistic locking
}
