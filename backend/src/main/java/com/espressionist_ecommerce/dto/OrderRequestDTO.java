package com.espressionist_ecommerce.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDTO {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Customer email should be valid")
    private String customerEmail;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    @NotBlank(message = "Customer address is required")
    private String customerAddress; // Renamed from deliveryAddress for consistency with Order entity

    @NotBlank(message = "Customer city is required")
    private String customerCity;

    @NotBlank(message = "Customer postal code is required")
    private String customerPostalCode;

    private String customerNotes; // Optional

    @NotEmpty(message = "Order must contain at least one item")
    @Valid // This will trigger validation for each OrderItemDTO in the list
    private List<OrderItemDTO> items;
}
