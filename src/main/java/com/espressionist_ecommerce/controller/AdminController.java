package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.dto.AdminDTO;
import com.espressionist_ecommerce.dto.AdminResponseDTO;
// Removed: import com.espressionist_ecommerce.exception.BusinessException;
import com.espressionist_ecommerce.model.Admin;
import com.espressionist_ecommerce.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Helper method to convert Admin to AdminResponseDTO
    private AdminResponseDTO convertToAdminResponseDTO(Admin admin) {
        if (admin == null) {
            return null;
        }
        return new AdminResponseDTO(
                admin.getId(),
                admin.getUsername(),
                admin.isActive(),
                admin.getLastLoginAt());
    }

    @GetMapping("/list")
    public ResponseEntity<List<AdminResponseDTO>> getAllAdmins() {
        List<AdminResponseDTO> adminResponseDTOs = adminService.getAllAdmins().stream()
                .map(this::convertToAdminResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(adminResponseDTOs);
    }

    @PostMapping("/create")
    public ResponseEntity<AdminResponseDTO> createAdmin(@Valid @RequestBody AdminDTO adminDTO) {
        Admin admin = adminService.createAdmin(adminDTO);
        return ResponseEntity.ok(convertToAdminResponseDTO(admin));
        // Removed try-catch for BusinessException, will be handled by GlobalExceptionHandler
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AdminResponseDTO> updateAdmin(
            @PathVariable Long id,
            @Valid @RequestBody AdminDTO adminDTO,
            Authentication authentication) {
        Admin admin = adminService.updateAdmin(id, adminDTO, authentication.getName());
        return ResponseEntity.ok(convertToAdminResponseDTO(admin));
        // Removed try-catch for BusinessException, will be handled by GlobalExceptionHandler
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id, Authentication authentication) {
        adminService.deleteAdmin(id, authentication.getName());
        return ResponseEntity.noContent().build();
        // Removed try-catch for BusinessException, will be handled by GlobalExceptionHandler
    }

    @GetMapping("/current")
    public ResponseEntity<AdminResponseDTO> getCurrentAdmin(Authentication authentication) {
        return adminService.getAdminByUsername(authentication.getName())
                .map(this::convertToAdminResponseDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}