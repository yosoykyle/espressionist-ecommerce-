package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.dto.AdminDTO;
import com.espressionist_ecommerce.exception.BusinessException;
import com.espressionist_ecommerce.model.Admin;
import com.espressionist_ecommerce.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/list")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(@Valid @RequestBody AdminDTO adminDTO) {
        try {
            Admin admin = adminService.createAdmin(adminDTO);
            return ResponseEntity.ok(admin);
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
            Admin admin = adminService.updateAdmin(id, adminDTO, authentication.getName());
            return ResponseEntity.ok(admin);
        } catch (BusinessException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id, Authentication authentication) {
        try {
            adminService.deleteAdmin(id, authentication.getName());
            return ResponseEntity.noContent().build();
        } catch (BusinessException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentAdmin(Authentication authentication) {
        return adminService.getAdminByUsername(authentication.getName())
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}