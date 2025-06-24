package com.espressionist_ecommerce.service.impl;
import java.util.List;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.espressionist_ecommerce.dto.AdminCreationRequestDTO;
import com.espressionist_ecommerce.dto.AdminDTO;
import com.espressionist_ecommerce.entity.Admin;
import com.espressionist_ecommerce.repository.AdminRepository;
import com.espressionist_ecommerce.service.AdminService;

/**
 * Purpose: Implementation of AdminService, handling CRUD operations for admin users.
 * Provides methods to create, update, archive, restore, and retrieve admin users.
 */

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
    // Retrieves all admins, mapping them to AdminDTOs
    public List<AdminDTO> getAllAdmins() {
        return adminRepository.findAll().stream()
                .map(admin -> modelMapper.map(admin, AdminDTO.class))
                .collect(Collectors.toList());
    }
    @Override
    // Creates a new admin from the provided AdminCreationRequestDTO
    // Maps the user-friendly role to the Admin.Role enum
    public AdminDTO createAdmin(AdminCreationRequestDTO adminCreationRequestDTO) {
        Admin admin = new Admin();
        admin.setUsername(adminCreationRequestDTO.getUsername());
        admin.setEmail(adminCreationRequestDTO.getEmail());
        admin.setPassword(passwordEncoder.encode(adminCreationRequestDTO.getPassword()));
        // Map user-friendly role to enum
        String roleString = adminCreationRequestDTO.getRole().replace(" ", "_").toUpperCase();
        try {
            admin.setRole(Admin.Role.valueOf(roleString));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + adminCreationRequestDTO.getRole(), e);
        }
        admin.setArchived(false);
        admin = adminRepository.save(admin);
        return modelMapper.map(admin, AdminDTO.class);
    }
    @Override
    // Updates an existing admin's details
    public AdminDTO updateAdmin(Long id, AdminDTO adminDTO) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        admin.setUsername(adminDTO.getUsername());
        admin.setEmail(adminDTO.getEmail());
        try {
            admin.setRole(Admin.Role.valueOf(adminDTO.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + adminDTO.getRole(), e);
        }
        admin.setArchived(Boolean.TRUE.equals(adminDTO.getArchived()));
        admin.setLastLogin(adminDTO.getLastLogin()); 
        admin = adminRepository.save(admin);
        return modelMapper.map(admin, AdminDTO.class);
    }
    @Override
    // Retrieves a specific admin by ID, mapping to AdminDTO
    public AdminDTO archiveAdmin(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        admin.setArchived(true);
        admin = adminRepository.save(admin);
        return modelMapper.map(admin, AdminDTO.class);
    }
    @Override
    // Restores an archived admin by ID, mapping to AdminDTO
    public AdminDTO restoreAdmin(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        admin.setArchived(false);
        admin = adminRepository.save(admin);
        return modelMapper.map(admin, AdminDTO.class);
    }
    @Override
    // Updates the password for the currently authenticated admin
    // This method is not implemented yet, as per the original request
    public void updateOwnPassword(com.espressionist_ecommerce.dto.PasswordUpdateRequestDTO passwordUpdateRequestDTO) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
