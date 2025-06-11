package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.dto.AdminCreationRequestDTO;
import com.espressionist_ecommerce.dto.AdminDTO;
import com.espressionist_ecommerce.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.espressionist_ecommerce.dto.PasswordUpdateRequestDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin/api/admins")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<AdminDTO>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @PostMapping
    public ResponseEntity<AdminDTO> createAdmin(@Valid @RequestBody AdminCreationRequestDTO adminCreationRequestDTO) {
        AdminDTO createdAdmin = adminService.createAdmin(adminCreationRequestDTO);
        // Return 201 Created for successful creation
        return new ResponseEntity<>(createdAdmin, HttpStatus.CREATED);
    }

    @PatchMapping("/me/password")
    public ResponseEntity<Void> updateOwnPassword(@Valid @RequestBody PasswordUpdateRequestDTO passwordUpdateRequestDTO) {
        adminService.updateOwnPassword(passwordUpdateRequestDTO);
        return ResponseEntity.ok().build(); // Or ResponseEntity.noContent().build()
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminDTO> updateAdmin(@PathVariable Long id, @RequestBody AdminDTO adminDTO) {
        return ResponseEntity.ok(adminService.updateAdmin(id, adminDTO));
    }

    @PostMapping("/{id}/archive")
    public ResponseEntity<AdminDTO> archiveAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.archiveAdmin(id));
    }
}
