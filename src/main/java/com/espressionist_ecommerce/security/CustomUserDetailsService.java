package com.espressionist_ecommerce.security;

import com.espressionist_ecommerce.model.Admin;
import com.espressionist_ecommerce.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminService adminService;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = adminService.getAdminByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Admin not found: " + username));

        // Don't allow login for archived admins
        if (admin.isArchived()) {
            throw new UsernameNotFoundException("Admin account has been archived: " + username);
        }

        return new User(
            admin.getUsername(),
            admin.getPassword(),
            true, // active
            true, // account non-expired
            true, // credentials non-expired
            !admin.isArchived(), // account non-locked
            Collections.singleton(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
    }
}