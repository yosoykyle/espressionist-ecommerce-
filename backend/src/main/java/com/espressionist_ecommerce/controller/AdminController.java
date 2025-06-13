package com.espressionist_ecommerce.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.espressionist_ecommerce.dto.AdminCreationRequestDTO;
import com.espressionist_ecommerce.dto.AdminDTO;
import com.espressionist_ecommerce.service.AdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

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
        try {
            AdminDTO createdAdmin = adminService.createAdmin(adminCreationRequestDTO);
            return new ResponseEntity<>(createdAdmin, HttpStatus.CREATED);
        } catch (ResponseStatusException e) {
            // Forward the error as is (already has status and message)
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error: " + e.getMessage());
        }
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
