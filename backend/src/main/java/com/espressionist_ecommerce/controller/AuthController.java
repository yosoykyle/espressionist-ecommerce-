package com.espressionist_ecommerce.controller;
import com.espressionist_ecommerce.dto.AdminDTO;
import com.espressionist_ecommerce.dto.LoginRequestDTO;
import com.espressionist_ecommerce.dto.JwtResponse;
import com.espressionist_ecommerce.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Purpose: Handles authentication-related API requests such as login, logout, and retrieving the current admin.
@RestController
@RequestMapping("/admin")
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
    @GetMapping("/me") // Full path: /admin/me
    public ResponseEntity<AdminDTO> getCurrentAdmin(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        AdminDTO adminDTO = authService.getCurrentAdmin();
        if (adminDTO == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(adminDTO);
    }

}
