package com.espressionist_ecommerce.dto;

/**
 * Purpose: Data Transfer Object for login requests containing username and password.
 */

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
