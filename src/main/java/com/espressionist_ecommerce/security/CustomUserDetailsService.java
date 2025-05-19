package com.espressionist_ecommerce.security;

import com.espressionist_ecommerce.model.Admin;
import com.espressionist_ecommerce.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Admin not found: " + username));

        return User.builder()
            .username(admin.getUsername())
            .password(admin.getPassword())
            .roles("ADMIN")
            .accountExpired(!admin.isActive())
            .accountLocked(!admin.isActive())
            .credentialsExpired(!admin.isActive())
            .disabled(!admin.isActive())
            .build();
    }
}