package com.espressionist_ecommerce.service;
import com.espressionist_ecommerce.dto.AdminDTO;
import java.util.List;
import com.espressionist_ecommerce.dto.AdminCreationRequestDTO;
import com.espressionist_ecommerce.dto.PasswordUpdateRequestDTO;
// Purpose: Service interface for managing admin operations, including CRUD, archiving, restoring, and password updates.
public interface AdminService {
    List<AdminDTO> getAllAdmins(); // Retrieves all admin users as a list of AdminDTOs
    AdminDTO createAdmin(AdminCreationRequestDTO adminCreationRequestDTO); // Creates a new admin user from the provided AdminCreationRequestDTO
    AdminDTO updateAdmin(Long id, AdminDTO adminDTO); // Updates an existing admin's details based on the provided AdminDTO
    AdminDTO archiveAdmin(Long id); // Archives an admin user by setting their archived status to true
    AdminDTO restoreAdmin(Long id); // Restores an archived admin user by setting their archived status to false
    void updateOwnPassword(PasswordUpdateRequestDTO passwordUpdateRequestDTO); // Updates the password for the currently authenticated admin user
}
