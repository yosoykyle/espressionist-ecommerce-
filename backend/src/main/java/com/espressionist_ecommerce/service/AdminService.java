package com.espressionist_ecommerce.service;

import com.espressionist_ecommerce.dto.AdminDTO;
import java.util.List;

public interface AdminService {
    List<AdminDTO> getAllAdmins();
    AdminDTO createAdmin(AdminDTO adminDTO);
    AdminDTO updateAdmin(Long id, AdminDTO adminDTO);
    AdminDTO archiveAdmin(Long id);
}
