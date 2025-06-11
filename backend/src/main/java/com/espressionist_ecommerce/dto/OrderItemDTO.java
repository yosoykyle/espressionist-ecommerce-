package com.espressionist_ecommerce.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemDTO {
    private Long id; // Not typically validated on input for creation

    @NotNull(message = "Product ID is required")
    private Long productId;

    // Name, price, image are often set server-side based on productId for integrity
    private String name;
    private BigDecimal price;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String image;
}
