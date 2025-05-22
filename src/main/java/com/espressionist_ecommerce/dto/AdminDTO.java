package com.espressionist_ecommerce.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminDTO {
    @NotBlank(message = "Username is required")
    private String username;

    private String password;
    private String passwordConfirmation;
    private boolean active = true;

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

    public String getPasswordConfirmation() {
        return passwordConfirmation;
    }

    public void setPasswordConfirmation(String passwordConfirmation) {
        this.passwordConfirmation = passwordConfirmation;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isPasswordConfirmed() {
        if ((password == null || password.isBlank()) && (passwordConfirmation == null || passwordConfirmation.isBlank())) {
            return true;
        }
        return password != null && password.equals(passwordConfirmation);
    }
}