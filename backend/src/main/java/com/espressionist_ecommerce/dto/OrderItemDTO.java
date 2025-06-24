package com.espressionist_ecommerce.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

/**
 * Purpose: Data Transfer Object for order item data exchanged between backend and frontend.
 * This class represents an item in an order, including product details and quantity.
 */

@Data
/**
 * This class is used to transfer order item data between layers of the application, such as from the server to the client.
 * It encapsulates all the necessary information about an item in an order, including its ID, product details, and quantity.
 */
public class OrderItemDTO {
    private Long id; 
    /**
     * Product ID is required to identify the product in the order item.
     * It is often set server-side based on the product catalog to ensure integrity.
     */
    @NotNull(message = "Product ID is required")
    private Long productId;
    // Product name is required to display the product details in the order item.
    private String name;
    private BigDecimal price;
    /**
     * Quantity is required to specify the number of items in the order.
     * It must be a positive integer.
     */
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    private String image;
}
