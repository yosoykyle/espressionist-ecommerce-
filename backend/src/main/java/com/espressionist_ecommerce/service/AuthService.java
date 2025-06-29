package com.espressionist_ecommerce.service;
import com.espressionist_ecommerce.dto.AdminDTO;
import com.espressionist_ecommerce.dto.JwtResponse;
import com.espressionist_ecommerce.dto.LoginRequestDTO;
// Purpose: Service interface for handling authentication operations, including login, logout, and retrieving current admin details.
public interface AuthService {
    JwtResponse login(LoginRequestDTO loginRequestDTO); // Authenticates an admin and returns a JWT response containing the token and admin details
    void logout(String token); // No-op for stateless JWT; client removes token. Server does not track or invalidate JWTs.
    AdminDTO getCurrentAdmin(); // Retrieves the currently authenticated admin's details
    // Purpose: Retrieves the currently authenticated admin's details, typically used for displaying user information in
}
