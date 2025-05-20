package com.espressionist_ecommerce.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double price;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    @PrePersist
    protected void onCreate() {
        if (product != null) {
            // Capture current product price at order time
            this.price = product.getPrice();

            // Validate stock availability
            if (product.getQuantity() < this.quantity) {
                throw new IllegalStateException("Insufficient stock for product: " + product.getName());
            }

            // Reduce product stock
            product.setQuantity(product.getQuantity() - this.quantity);
        }
    }

    // Helper method to validate quantity
    public void validateQuantity() {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        if (product != null && quantity > product.getQuantity()) {
            throw new IllegalArgumentException("Requested quantity exceeds available stock");
        }
    }

    // Method to calculate subtotal
    public double getSubtotal() {
        return price * quantity;
    }
}