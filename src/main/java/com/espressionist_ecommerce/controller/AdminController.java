package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.model.Admin;
import com.espressionist_ecommerce.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> createAdmin(@RequestBody Admin admin) {
        if (admin.getUsername() == null || admin.getUsername().trim().isEmpty() ||
            admin.getPassword() == null || admin.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }
        try {
            Admin createdAdmin = adminService.createAdmin(admin);
            return ResponseEntity.ok(createdAdmin);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id, @RequestBody Admin admin, Authentication authentication) {
        String currentUsername = authentication.getName();
        try {
            Admin updatedAdmin = adminService.updateAdmin(id, admin, currentUsername);
            return ResponseEntity.ok(updatedAdmin);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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