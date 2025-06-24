package com.espressionist_ecommerce.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Purpose: DTO for updating the password of an admin user.
 * This class is used to encapsulate the data required to update an admin's password,
 * ensuring that both the current and new passwords are provided and validated before processing.
 */

@Data
/**
 * This class is used to transfer password update request data between layers of the application,
 * ensuring that the necessary information is available for processing the request.
 */
public class PasswordUpdateRequestDTO {
    /**
     * Current password of the admin user.
     * Must be provided to verify the user's identity before allowing a password change.
     */
    @NotBlank(message = "Current password is required")
    private String currentPassword;
    /**
     * New password for the admin user.
     * Must meet complexity requirements and be different from the current password.
     */
    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 100, message = "New password must be between 8 and 100 characters")
    private String newPassword;
}
