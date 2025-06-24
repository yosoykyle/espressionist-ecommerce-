package com.espressionist_ecommerce.service;
import com.espressionist_ecommerce.dto.AdminDTO;
import com.espressionist_ecommerce.dto.JwtResponse;
import com.espressionist_ecommerce.dto.LoginRequestDTO;
// Purpose: Service interface for handling authentication operations, including login, logout, and retrieving current admin details.
public interface AuthService {
    JwtResponse login(LoginRequestDTO loginRequestDTO);
    void logout(String token); // No-op for stateless JWT; client removes token. Server does not track or invalidate JWTs.
    AdminDTO getCurrentAdmin();
}
