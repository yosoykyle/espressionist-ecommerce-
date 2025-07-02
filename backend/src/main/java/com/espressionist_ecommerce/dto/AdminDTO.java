package com.espressionist_ecommerce.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * Purpose: Data Transfer Object for admin user information.
 * In simple terms, this class is used to transfer admin user data between different layers of the application.
 * It contains fields such as ID, username, email, role, and timestamps for created and updated records.
 * This DTO is typically used to send admin user details from the service layer to the controller layer.
 */
@Data
// This class is used to transfer admin data between layers of the application, such as from the service layer to the controller layer.
// It encapsulates the admin's details, including their ID, username, email, role, and timestamps.
public class AdminDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
    private Boolean archived;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String password; // Added for password update support
}
