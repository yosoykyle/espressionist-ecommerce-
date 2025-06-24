package com.espressionist_ecommerce.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * Purpose: Represents an item in an order, linking a product to an order with details like name, price, quantity, and image.
 * 
 * This entity is used to store information about each product included in an order, allowing for detailed order management
 * and reporting.
 */
@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    // Unique identifier for the order item
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Foreign key to the associated order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    // Foreign key to the associated product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    // Name of the product at the time of order, allowing for historical accuracy
    @Column(nullable = false)
    private String name;
    // Price of the product at the time of order, allowing for historical accuracy
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    // Quantity of the product ordered
    @Column(nullable = false)
    private Integer quantity;
    // Image URL of the product at the time of order, allowing for historical accuracy
    private String image;
}
