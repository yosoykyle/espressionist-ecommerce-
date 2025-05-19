package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.model.Admin;
import com.espressionist_ecommerce.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/all")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        List<Admin> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(@Valid @RequestBody AdminDTO adminDTO) {
        try {
            // Check password validation
            if (!adminDTO.isPasswordConfirmed()) {
                throw new BusinessException("Password and confirmation do not match");
            }

            Admin admin = new Admin();
            admin.setUsername(adminDTO.getUsername());
            admin.setPassword(adminDTO.getPassword());
            admin.setActive(true);

            Admin createdAdmin = adminService.createAdmin(admin);
            return ResponseEntity.ok(createdAdmin);
        } catch (BusinessException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateAdmin(
            @PathVariable Long id,
            @Valid @RequestBody AdminDTO adminDTO,
            Authentication authentication) {
        try {
            String currentUsername = authentication.getName();

            // Check password validation if password is being updated
            if (adminDTO.getPassword() != null && !adminDTO.getPassword().isEmpty()
                    && !adminDTO.isPasswordConfirmed()) {
                throw new BusinessException("Password and confirmation do not match");
            }

            Admin updatedAdmin = adminService.updateAdmin(id, adminDTO, currentUsername);
            return ResponseEntity.ok(updatedAdmin);
        } catch (BusinessException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id, Authentication authentication) {
        String currentUsername = authentication.getName();
        try {
            adminService.deleteAdmin(id, currentUsername);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}