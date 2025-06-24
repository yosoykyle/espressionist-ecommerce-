package com.espressionist_ecommerce.dto;

/**
 * Purpose: Data Transfer Object for customer information in orders.
 */
import lombok.Data;

@Data
/**
 * This class is used to transfer customer data between layers of the application, such as from the service layer to the controller layer.
 * It encapsulates the customer's details, including their name, email, phone number, address, city, postal code, and any additional notes.
 */
public class CustomerDTO {
    private String name;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String postalCode;
    private String notes;
}
