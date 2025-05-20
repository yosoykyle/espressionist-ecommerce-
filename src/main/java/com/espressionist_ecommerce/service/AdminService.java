package com.espressionist_ecommerce.service;

import com.espressionist_ecommerce.dto.AdminDTO;
import com.espressionist_ecommerce.exception.BusinessException;
import com.espressionist_ecommerce.exception.ResourceNotFoundException;
import com.espressionist_ecommerce.model.Admin;
import com.espressionist_ecommerce.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public List<Admin> getAllAdmins() {
        return adminRepository.findByArchivedFalse();
    }

    public Optional<Admin> getAdminByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    public Admin createAdmin(AdminDTO adminDTO) {
        validateNewAdmin(adminDTO);

        Admin admin = new Admin();
        admin.setUsername(adminDTO.getUsername());
        admin.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
        admin.setActive(adminDTO.isActive());
        admin.setArchived(false);

        return adminRepository.save(admin);
    }

    public Admin updateAdmin(Long id, AdminDTO adminDTO, String currentUsername) {
        Admin admin = adminRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        // Update username if provided and changed
        if (!admin.getUsername().equals(adminDTO.getUsername())) {
            validateUsername(adminDTO.getUsername());
            admin.setUsername(adminDTO.getUsername());
        }

        // Update password if provided
        if (adminDTO.getPassword() != null && !adminDTO.getPassword().isEmpty()) {
            if (!adminDTO.isPasswordConfirmed()) {
                throw new BusinessException("Password and confirmation do not match");
            }
            admin.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
        }

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

        // Soft delete by setting archived flag
        admin.setArchived(true);
        admin.setActive(false);
        adminRepository.save(admin);
    }

    public void recordLogin(String username) {
        adminRepository.findByUsername(username).ifPresent(admin -> {
            admin.recordLogin();
            adminRepository.save(admin);
        });
    }

    // public long countActiveAdmins() {
    //     return adminRepository.countByActiveTrue();
    // }

    @Transactional
    public void updateLastLoginTime(String email) {
        adminRepository.findByEmail(email).ifPresent(admin -> {
            admin.setLastLoginAt(LocalDateTime.now());
            adminRepository.save(admin);
        });
    }

    public boolean isLastActiveAdmin(Long adminId) {
        return countActiveAdmins() == 1 && 
               adminRepository.findById(adminId)
                   .map(Admin::isActive)
                   .orElse(false);
    }

    private void validateNewAdmin(AdminDTO adminDTO) {
        validateUsername(adminDTO.getUsername());

        if (adminDTO.getPassword() == null || adminDTO.getPassword().isEmpty()) {
            throw new BusinessException("Password is required for new admin");
        }

        if (!adminDTO.isPasswordConfirmed()) {
            throw new BusinessException("Password and confirmation do not match");
        }
    }

    private void validateUsername(String username) {
        if (adminRepository.existsByUsernameAndArchivedFalse(username)) {
            throw new BusinessException("Username already exists");
        }
    }

    private long countActiveAdmins() {
        return adminRepository.countByActiveIsTrueAndArchivedIsFalse();
    }
}