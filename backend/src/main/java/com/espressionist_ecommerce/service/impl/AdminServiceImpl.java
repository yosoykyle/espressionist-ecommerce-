package com.espressionist_ecommerce.service.impl;

import com.espressionist_ecommerce.dto.AdminCreationRequestDTO;
import com.espressionist_ecommerce.dto.AdminDTO;
import com.espressionist_ecommerce.entity.Admin;
import com.espressionist_ecommerce.repository.AdminRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.espressionist_ecommerce.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {
    private final AdminRepository adminRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    // Updated constructor to be explicitly defined for PasswordEncoder injection
    public AdminServiceImpl(AdminRepository adminRepository, ModelMapper modelMapper, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<AdminDTO> getAllAdmins() {
        return adminRepository.findAll().stream()
                .map(admin -> modelMapper.map(admin, AdminDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public AdminDTO createAdmin(AdminCreationRequestDTO adminCreationRequestDTO) {
        Admin admin = new Admin();
        admin.setUsername(adminCreationRequestDTO.getUsername());
        admin.setEmail(adminCreationRequestDTO.getEmail());
        // Password encoding
        admin.setPassword(passwordEncoder.encode(adminCreationRequestDTO.getPassword()));
        // Role conversion - ensure Admin.Role enum can handle this string
        // It's generally safer to have a method or check for valid role strings
        try {
            admin.setRole(Admin.Role.valueOf(adminCreationRequestDTO.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            // Handle invalid role string, e.g., throw a specific exception
            // For now, rethrowing as a runtime exception or setting a default
            // This should be improved with proper error handling (e.g., custom validation exception)
            throw new RuntimeException("Invalid role: " + adminCreationRequestDTO.getRole(), e);
        }
        admin.setArchived(false); // Default for new admins

        admin = adminRepository.save(admin);
        return modelMapper.map(admin, AdminDTO.class);
    }

    @Override
    public AdminDTO updateAdmin(Long id, AdminDTO adminDTO) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found")); // Consider custom exception
        admin.setUsername(adminDTO.getUsername());
        admin.setEmail(adminDTO.getEmail());
        // Assuming role updates are handled carefully and validated if necessary
        // Passwords are not updated via this method for security (use a dedicated change password flow)
        try {
            admin.setRole(Admin.Role.valueOf(adminDTO.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + adminDTO.getRole(), e);
        }
        admin.setArchived(Boolean.TRUE.equals(adminDTO.getArchived()));
        admin.setLastLogin(adminDTO.getLastLogin()); // Consider if this should be settable via API
        admin = adminRepository.save(admin);
        return modelMapper.map(admin, AdminDTO.class);
    }

    @Override
    public AdminDTO archiveAdmin(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        admin.setArchived(true);
        admin = adminRepository.save(admin);
        return modelMapper.map(admin, AdminDTO.class);
    }
}
