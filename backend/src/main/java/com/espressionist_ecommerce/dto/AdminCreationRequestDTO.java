package com.espressionist_ecommerce.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Purpose: DTO for creating a new admin user, including validation for required fields.
 * This class is used to encapsulate the data required to create a new admin user,
 * ensuring that all necessary fields are provided and validated before processing.
 */

@Data
public class AdminCreationRequestDTO {
    /**
     * Username of the admin user.
     * Must be between 3 and 50 characters long.
     */
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    /**
     * Email address of the admin user.
     * Must be a valid email format.
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    /**
     * Role of the admin user.
     * Must be one of the predefined roles.
     */
    @NotBlank(message = "Role is required")
    // Further validation for specific role values can be done via a custom validator or in the service layer
    private String role;
    /**
     * Password of the admin user.
     * Must be between 8 and 100 characters long.
     */
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    // Consider adding @Pattern for complexity if needed, e.g.,
    // @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).*$",
    //          message = "Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and no whitespace")
    private String password;
}
