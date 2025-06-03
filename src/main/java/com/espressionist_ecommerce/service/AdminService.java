package com.espressionist_ecommerce.service;

import com.espressionist_ecommerce.dto.AdminDTO;
import com.espressionist_ecommerce.exception.BusinessException;
import com.espressionist_ecommerce.exception.ResourceNotFoundException;
import com.espressionist_ecommerce.model.Admin;
import com.espressionist_ecommerce.repository.AdminRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class AdminService {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    public AdminService(AdminRepository adminRepository, BCryptPasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<Admin> getAllAdmins() {
        return adminRepository.findByArchivedFalse();
    }

    @Transactional(readOnly = true)
    public Optional<Admin> getAdminByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    public Admin createAdmin(AdminDTO adminDTO) {
        validateNewAdmin(adminDTO);

        Admin admin = new Admin();
        admin.setUsername(adminDTO.getUsername().toLowerCase()); // Store username in lowercase
        admin.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
        admin.setActive(adminDTO.isActive());
        admin.setArchived(false);
        admin.setLoginAttempts(0);
        admin.setLastLoginAt(null);

        logger.info("Creating new admin user: {}", adminDTO.getUsername());
        return adminRepository.save(admin);
    }

    public Admin updateAdmin(Long id, AdminDTO adminDTO, String currentUsername) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        // Prevent changing username if it already exists
        if (!admin.getUsername().equals(adminDTO.getUsername().toLowerCase())) {
            validateUsername(adminDTO.getUsername());
            admin.setUsername(adminDTO.getUsername().toLowerCase());
        }

        // Only update password if provided
        if (adminDTO.getPassword() != null && !adminDTO.getPassword().isEmpty()) {
            if (!adminDTO.isPasswordConfirmed()) {
                throw new BusinessException("Password and confirmation do not match");
            }
            validatePassword(adminDTO.getPassword());
            admin.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
        }

        // Update active status with additional checks
        if (admin.isActive() != adminDTO.isActive()) {
            validateStatusChange(admin, adminDTO.isActive(), currentUsername);
            admin.setActive(adminDTO.isActive());
        }

        logger.info("Updating admin user: {}", admin.getUsername());
        return adminRepository.save(admin);
    }

    public void deleteAdmin(Long id, String currentUsername) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        // Prevent self-deletion
        if (admin.getUsername().equals(currentUsername)) {
            throw new BusinessException("Cannot delete your own account");
        }

        // Prevent deleting the last active admin
        if (admin.isActive() && countActiveAdmins() <= 1) {
            throw new BusinessException("Cannot delete the last active admin");
        }

        // Soft delete
        admin.setArchived(true);
        admin.setActive(false);
        logger.info("Soft deleting admin user: {}", admin.getUsername());
        adminRepository.save(admin);
    }

    @Transactional
    public void updateLastLoginTime(String username) {
        adminRepository.findByUsername(username.toLowerCase()).ifPresent(admin -> {
            admin.setLastLoginAt(LocalDateTime.now());
            admin.setLoginAttempts(0); // Reset login attempts on successful login
            adminRepository.save(admin);
            logger.info("Updated last login time for admin: {}", username);
        });
    }

    @Transactional
    public void incrementLoginAttempts(String username) {
        adminRepository.findByUsername(username.toLowerCase()).ifPresent(admin -> {
            admin.setLoginAttempts(admin.getLoginAttempts() + 1);
            if (admin.getLoginAttempts() >= MAX_LOGIN_ATTEMPTS) {
                admin.setActive(false);
                logger.warn("Admin account {} locked due to excessive login attempts", username);
            }
            adminRepository.save(admin);
        });
    }

    private void validateNewAdmin(AdminDTO adminDTO) {
        validateUsername(adminDTO.getUsername());
        if (!adminDTO.isPasswordConfirmed()) {
            throw new BusinessException("Password and confirmation do not match");
        }
        validatePassword(adminDTO.getPassword());
    }

    private void validateUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new BusinessException("Username is required");
        }
        
        String lowercaseUsername = username.toLowerCase();
        if (adminRepository.findByUsername(lowercaseUsername).isPresent()) {
            throw new BusinessException("Username already exists");
        }
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw new BusinessException("Password must be at least 8 characters long");
        }

        if (!password.matches(".*[A-Z].*")) {
            throw new BusinessException("Password must contain at least one uppercase letter");
        }

        if (!password.matches(".*[a-z].*")) {
            throw new BusinessException("Password must contain at least one lowercase letter");
        }

        if (!password.matches(".*\\d.*")) {
            throw new BusinessException("Password must contain at least one number");
        }

        if (!password.matches(".*[@$!%*?&].*")) {
            throw new BusinessException("Password must contain at least one special character (@$!%*?&)");
        }
    }

    private void validateStatusChange(Admin admin, boolean newStatus, String currentUsername) {
        if (admin.getUsername().equals(currentUsername) && !newStatus && countActiveAdmins() <= 1) {
            throw new BusinessException("Cannot deactivate the last active admin");
        }
    }

    private long countActiveAdmins() {
        return adminRepository.countByActiveTrue();
    }
}