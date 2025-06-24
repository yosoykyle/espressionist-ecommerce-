package com.espressionist_ecommerce.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

/**
 * Purpose: Data Transfer Object for order request data exchanged between backend and frontend.
 * This class represents the details required to place an order, including customer information and items in the order.
 */

@Data
/**
 * This class is used to transfer order request data between layers of the application, such as from the server to the client.
 * It encapsulates all the necessary information about an order, including customer details and items in the order.
 */
public class OrderRequestDTO {
    /**
     * Customer name is required to identify the person placing the order.
     * It is often used for communication and shipping purposes.
     */
    @NotBlank(message = "Customer name is required")
    private String customerName;
    /**
     * Customer email is required for order confirmation and communication.
     * It must be a valid email format.
     */
    @NotBlank(message = "Customer email is required")
    @Email(message = "Customer email should be valid")
    private String customerEmail;
    /**
     * Customer phone is required for order confirmation and communication.
     */
    @NotBlank(message = "Customer phone is required")
    private String customerPhone;
    /**
     * Customer address is required for order delivery.
     */
    @NotBlank(message = "Customer address is required")
    private String customerAddress;
    /**
     * Customer city is required for order delivery.
     */
    @NotBlank(message = "Customer city is required")
    private String customerCity;
    /**
     * Customer postal code is required for order delivery.
     */
    @NotBlank(message = "Customer postal code is required")
    private String customerPostalCode;
    /**
     * Customer notes is optional and can be used to provide additional information or instructions regarding the order.
     */
    private String customerNotes; // Optional
    /**
     * List of items in the order.
     * Each item must be valid and contain necessary details such as product ID, name, price, and quantity.
     */
    @NotEmpty(message = "Order must contain at least one item")
    @Valid // This will trigger validation for each OrderItemDTO in the list
    private List<OrderItemDTO> items;
}
