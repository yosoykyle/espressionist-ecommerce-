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

    @Override
    public void updateOwnPassword(com.espressionist_ecommerce.dto.PasswordUpdateRequestDTO passwordUpdateRequestDTO) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
