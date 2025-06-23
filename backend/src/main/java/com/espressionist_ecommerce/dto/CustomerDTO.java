package com.espressionist_ecommerce.dto;

import lombok.Data;

@Data
public class CustomerDTO {
    private String name;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String postalCode;
    private String notes;
}
