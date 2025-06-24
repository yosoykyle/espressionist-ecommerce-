package com.espressionist_ecommerce.service.impl;
import com.espressionist_ecommerce.dto.LoginRequestDTO;
import com.espressionist_ecommerce.dto.JwtResponse;
import com.espressionist_ecommerce.entity.Admin;
import com.espressionist_ecommerce.repository.AdminRepository;
import com.espressionist_ecommerce.security.JwtTokenUtil;
import com.espressionist_ecommerce.service.AuthService;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Purpose: Implementation of AuthService, handling authentication operations such as login, logout, and retrieving the current admin.
 * Provides methods to authenticate users, generate JWT tokens, and manage user sessions.
 */
@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;// Spring's AuthenticationManager for handling authentication
    private final UserDetailsService userDetailsService; // Injecting Spring's UserDetailsService
    private final JwtTokenUtil jwtTokenUtil;    // Utility for JWT token generation and validation
    private final AdminRepository adminRepository; // Repository for accessing Admin data
    private final ModelMapper modelMapper;// ModelMapper for converting between entity and DTO objects

    // Constructor for AuthServiceImpl
    // Injects dependencies such as AuthenticationManager, UserDetailsService, JwtTokenUtil, AdminRepository, and ModelMapper.
    // This constructor is used by Spring to create an instance of AuthServiceImpl with the required dependencies.
    // The @Autowired annotation is not needed here as Spring will automatically inject these dependencies based on type.   
    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserDetailsService userDetailsService,
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
    @Transactional
    // Handles user login by authenticating credentials and generating a JWT token.
    // If authentication fails, it throws a RuntimeException with a message indicating invalid credentials.
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
        // For this implementation, we'll assume client-side token removal.
        // Logging can be added here if desired.
        System.out.println("User logged out. Token (if blocklisting implemented): " + token);
    }
    @Override
    // Retrieves the currently authenticated admin's details.
    // It checks the SecurityContext for the current authentication and maps the Admin entity to AdminDTO
    public com.espressionist_ecommerce.dto.AdminDTO getCurrentAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String username = authentication.getName();
        Admin admin = adminRepository.findByUsername(username).orElse(null);
        if (admin == null) {
            return null;
        }
        return modelMapper.map(admin, com.espressionist_ecommerce.dto.AdminDTO.class);
    }
}
