package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.dto.AdminDTO;
import com.espressionist_ecommerce.dto.LoginRequestDTO;
import com.espressionist_ecommerce.dto.AdminDTO;
import com.espressionist_ecommerce.dto.LoginRequestDTO;
import com.espressionist_ecommerce.dto.JwtResponse;
import com.espressionist_ecommerce.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; // Added this import
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin") // Base path for admin-related authentication
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login") // Full path: /admin/login
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        JwtResponse jwtResponse = authService.login(loginRequestDTO);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/logout") // Full path: /admin/logout
    public ResponseEntity<String> logout(@RequestHeader(name = "Authorization", required = false) String token) {
        if (token != null && token.startsWith("Bearer ")) {
            authService.logout(token.replace("Bearer ", ""));
        }
        // Even if no token or invalid token, logout can be considered successful on client-side
        return ResponseEntity.ok("Logged out successfully");
    }

}
