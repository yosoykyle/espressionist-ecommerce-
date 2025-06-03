package com.espressionist_ecommerce.dto;

import com.espressionist_ecommerce.validation.Groups;
import jakarta.validation.constraints.*;

public class AdminDTO {
    @NotBlank(message = "Username is required", groups = {Groups.OnCreate.class, Groups.OnUpdate.class})
    @Size(min = 4, max = 20, message = "Username must be between 4 and 20 characters", groups = {Groups.OnCreate.class, Groups.OnUpdate.class})
    @Pattern(regexp = "^[a-zA-Z0-9_-]*$", message = "Username can only contain letters, numbers, underscores and hyphens", groups = {Groups.OnCreate.class, Groups.OnUpdate.class})
    private String username;

    @NotBlank(message = "Password is required", groups = {Groups.OnCreate.class, Groups.OnPasswordUpdate.class})
    @Size(min = 8, message = "Password must be at least 8 characters long", groups = {Groups.OnCreate.class, Groups.OnPasswordUpdate.class})
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$", 
            message = "Password must contain at least one digit, one lowercase, one uppercase, and one special character", 
            groups = {Groups.OnCreate.class, Groups.OnPasswordUpdate.class})
    private String password;

    @NotBlank(message = "Password confirmation is required", groups = {Groups.OnCreate.class, Groups.OnPasswordUpdate.class})
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
        if (password == null && passwordConfirmation == null) {
            return true;
        }
        return password != null && password.equals(passwordConfirmation);
    }
}