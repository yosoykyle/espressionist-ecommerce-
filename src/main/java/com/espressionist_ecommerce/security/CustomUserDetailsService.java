package com.espressionist_ecommerce.security;

import com.espressionist_ecommerce.model.Admin;
import com.espressionist_ecommerce.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminService adminService;

    public CustomUserDetailsService(AdminService adminService) {
        this.adminService = adminService;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = adminService.getAdminByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Admin not found: " + username));

        if (admin.isArchived()) {
            throw new UsernameNotFoundException("Admin account has been archived: " + username);
        }

        return User.builder()
            .username(admin.getUsername())
            .password(admin.getPassword())
            .roles("ADMIN")
            .build();
    }
}