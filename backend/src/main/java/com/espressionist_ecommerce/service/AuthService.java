package com.espressionist_ecommerce.service;

/**
 * Purpose: Service interface for authentication operations such as login, logout, and retrieving the current admin.
 */

import com.espressionist_ecommerce.dto.AdminDTO;
import com.espressionist_ecommerce.dto.LoginRequestDTO;
import com.espressionist_ecommerce.dto.JwtResponse;

public interface AuthService {
    JwtResponse login(LoginRequestDTO loginRequestDTO);
    void logout(String token); // Basic logout, actual stateless JWT logout is complex
    AdminDTO getCurrentAdmin();
}
