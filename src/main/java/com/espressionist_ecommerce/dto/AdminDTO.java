package com.espressionist_ecommerce.dto;

import jakarta.validation.constraints.*;

public class AdminDTO {

    @NotBlank(message = "Username is required")
    @Pattern(regexp = "^[a-zA-Z0-9_-]{3,50}$", 
             message = "Username must be 3-50 characters and can only contain letters, numbers, underscores, and hyphens")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
             message = "Password must contain at least one uppercase letter, one lowercase letter, and one number")
    private String password;

    // For password confirmation during updates
    private String confirmPassword;

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    // Validate password confirmation
    public boolean isPasswordConfirmed() {
        return password != null && password.equals(confirmPassword);
    }
}