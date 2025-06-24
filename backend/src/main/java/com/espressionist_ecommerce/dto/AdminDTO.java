package com.espressionist_ecommerce.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * Purpose: Data Transfer Object for admin user information.
 */
@Data
public class AdminDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
    private Boolean archived;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
