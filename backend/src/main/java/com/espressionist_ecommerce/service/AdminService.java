package com.espressionist_ecommerce.service;
import com.espressionist_ecommerce.dto.AdminDTO;
import java.util.List;
import com.espressionist_ecommerce.dto.AdminCreationRequestDTO;
import com.espressionist_ecommerce.dto.PasswordUpdateRequestDTO;
// Purpose: Service interface for managing admin operations, including CRUD, archiving, restoring, and password updates.
public interface AdminService {
    List<AdminDTO> getAllAdmins();
    AdminDTO createAdmin(AdminCreationRequestDTO adminCreationRequestDTO);
    AdminDTO updateAdmin(Long id, AdminDTO adminDTO);
    AdminDTO archiveAdmin(Long id);
    AdminDTO restoreAdmin(Long id);
    void updateOwnPassword(PasswordUpdateRequestDTO passwordUpdateRequestDTO);
}
