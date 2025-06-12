package com.espressionist_ecommerce.service.impl;

import com.espressionist_ecommerce.dto.AdminDTO;
import com.espressionist_ecommerce.dto.LoginRequestDTO;
import com.espressionist_ecommerce.dto.JwtResponse;
import com.espressionist_ecommerce.entity.Admin;
import com.espressionist_ecommerce.repository.AdminRepository;
import com.espressionist_ecommerce.security.JwtTokenUtil;
import com.espressionist_ecommerce.service.AuthService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService; // Spring's UserDetailsService
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService; // Injecting Spring's UserDetailsService
    private final JwtTokenUtil jwtTokenUtil;
    private final AdminRepository adminRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserDetailsService userDetailsService, // Spring's UserDetailsService
                           JwtTokenUtil jwtTokenUtil,
                           AdminRepository adminRepository,
                           ModelMapper modelMapper) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.adminRepository = adminRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional // Optional for login, but good if last login time or similar is updated
    public JwtResponse login(LoginRequestDTO loginRequestDTO) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(), loginRequestDTO.getPassword())
            );
        } catch (BadCredentialsException e) {
            // Consider a more specific, custom exception
            throw new RuntimeException("INVALID_CREDENTIALS", e);
        }

        // If authentication is successful, load UserDetails to generate token
        // CustomUserDetailsService will be invoked here
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequestDTO.getUsername());

        // Optional: Update last login time for the admin
        Admin admin = adminRepository.findByUsername(userDetails.getUsername()).orElse(null);
        if (admin != null) {
            admin.setLastLogin(java.time.LocalDateTime.now());
            adminRepository.save(admin);
        }

        final String token = jwtTokenUtil.generateToken(userDetails);
        return new JwtResponse(token);
    }

    @Override
    public void logout(String token) {
        // For stateless JWT, true server-side logout is complex.
        // Options:
        // 1. Do nothing: Client discards the token. This is the most common stateless approach.
        // 2. Token blocklisting: Maintain a list of invalidated tokens. Adds state.
        // For this implementation, we'll assume client-side token removal.
        // Logging can be added here if desired.
        System.out.println("User logged out. Token (if blocklisting implemented): " + token);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDTO getCurrentAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            // Or throw an exception if an admin must be authenticated
            return null;
        }

        String username = authentication.getName();
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated admin user not found in database: " + username));
        return modelMapper.map(admin, AdminDTO.class);
    }
}
