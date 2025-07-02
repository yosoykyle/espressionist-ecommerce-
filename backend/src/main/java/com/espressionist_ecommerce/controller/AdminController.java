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

/**
 * AdminController handles requests related to admin user management.
 * It provides endpoints for creating, updating, archiving, and restoring admin users.
 * In simple terms, this class is used to manage admin users in the application.
 * It allows the creation of new admin users, updating existing ones, archiving (deactivating) admin users,
 * and restoring archived admin users.
 */

public class AdminController {
    // Service for handling admin user operations
    private final AdminService adminService;
    // Retrieves all admin users
    @GetMapping
    public ResponseEntity<List<AdminDTO>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }
    // Creates a new admin user
    @PostMapping
    public ResponseEntity<AdminDTO> createAdmin(@Valid @RequestBody AdminCreationRequestDTO adminCreationRequestDTO) {
        try {
            // Validate the request DTO
            AdminDTO createdAdmin = adminService.createAdmin(adminCreationRequestDTO);
            // Return the created admin with HTTP 201 Created status
            return new ResponseEntity<>(createdAdmin, HttpStatus.CREATED);
        // Catch specific exceptions to provide meaningful error message
        } catch (ResponseStatusException e) {
            // Forward the exception to the client with appropriate status
            throw e;
        // Catch any other unexpected exceptions
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error: " + e.getMessage());
        }
    }
    // Updates an existing admin user
    @PutMapping("/{id}")
    public ResponseEntity<AdminDTO> updateAdmin(@PathVariable Long id, @RequestBody AdminDTO adminDTO) {
        return ResponseEntity.ok(adminService.updateAdmin(id, adminDTO));
    }
    // Archives an admin user
    @PostMapping("/{id}/archive")
    public ResponseEntity<AdminDTO> archiveAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.archiveAdmin(id));
    }
    // Restores an archived admin user
    @PostMapping("/{id}/restore")
    public ResponseEntity<AdminDTO> restoreAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.restoreAdmin(id));
    }
}
