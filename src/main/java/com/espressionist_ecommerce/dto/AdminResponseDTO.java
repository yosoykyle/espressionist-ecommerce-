package com.espressionist_ecommerce.dto;

import java.time.LocalDateTime;

public class AdminResponseDTO {
    private Long id;
    private String username;
    private boolean active;
    private LocalDateTime lastLoginAt;

    // Constructor
    public AdminResponseDTO(Long id, String username, boolean active, LocalDateTime lastLoginAt) {
        this.id = id;
        this.username = username;
        this.active = active;
        this.lastLoginAt = lastLoginAt;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public boolean isActive() {
        return active;
    }

    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void setLastLoginAt(LocalDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }
}
