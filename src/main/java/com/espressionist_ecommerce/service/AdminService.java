package com.espressionist_ecommerce.service;

import com.espressionist_ecommerce.model.Admin;
import com.espressionist_ecommerce.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Admin createAdmin(Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(admin);
    }

    public Optional<Admin> getAdminByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public void deleteAdmin(Long id, String currentUsername) {
        adminRepository.findById(id).ifPresent(admin -> {
            if (admin.getUsername().equals(currentUsername)) {
                throw new RuntimeException("Cannot delete your own account");
            }
            adminRepository.deleteById(id);
        });
    }

    public Admin updateAdmin(Long id, Admin updatedAdmin, String currentUsername) {
        return adminRepository.findById(id)
            .map(admin -> {
                if (admin.getUsername().equals(currentUsername)) {
                    throw new RuntimeException("Cannot update your own account");
                }
                admin.setUsername(updatedAdmin.getUsername());
                if (updatedAdmin.getPassword() != null && !updatedAdmin.getPassword().trim().isEmpty()) {
                    admin.setPassword(passwordEncoder.encode(updatedAdmin.getPassword()));
                }
                return adminRepository.save(admin);
            })
            .orElseThrow(() -> new RuntimeException("Admin not found"));
    }
}