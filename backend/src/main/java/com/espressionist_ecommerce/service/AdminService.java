package com.espressionist_ecommerce.service;

/**
 * Purpose: Service interface for managing admin users, including CRUD and password operations.
 */

import com.espressionist_ecommerce.dto.AdminDTO;
import java.util.List;

import com.espressionist_ecommerce.dto.AdminCreationRequestDTO;

import com.espressionist_ecommerce.dto.PasswordUpdateRequestDTO;

public interface AdminService {
    List<AdminDTO> getAllAdmins();
    AdminDTO createAdmin(AdminCreationRequestDTO adminCreationRequestDTO);
    AdminDTO updateAdmin(Long id, AdminDTO adminDTO);
    AdminDTO archiveAdmin(Long id);
    AdminDTO restoreAdmin(Long id);
    void updateOwnPassword(PasswordUpdateRequestDTO passwordUpdateRequestDTO);
}
