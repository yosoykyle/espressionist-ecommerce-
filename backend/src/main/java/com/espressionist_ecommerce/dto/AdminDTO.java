package com.espressionist_ecommerce.dto;

import lombok.Data;
import java.time.LocalDateTime;

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
