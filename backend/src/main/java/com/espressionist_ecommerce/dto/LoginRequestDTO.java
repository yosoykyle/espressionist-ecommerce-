package com.espressionist_ecommerce.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Purpose: Data Transfer Object for login requests, including validation for required fields.
 * This class is used to encapsulate the data required for user login, ensuring that all necessary fields are provided and validated before processing.
 */

@Data
// This class is used to transfer login data between layers of the application, such as from the client to the server.
// It encapsulates the username and password that are required for user authentication.
public class LoginRequestDTO {
    /**
     * Username of the user attempting to log in.
     * Must not be blank.
     */
    @NotBlank(message = "Username is required")
    private String username;
    /**
     * Password of the user attempting to log in.
     * Must not be blank.
     */
    @NotBlank(message = "Password is required")
    private String password;
}
