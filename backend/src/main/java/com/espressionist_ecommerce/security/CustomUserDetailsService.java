package com.espressionist_ecommerce.security;
import com.espressionist_ecommerce.entity.Admin;
import com.espressionist_ecommerce.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;

/**
 * Purpose: Loads Admin details for authentication. All admins have the same permissions; admin roles currently is for identification in the backend but UI-level RBAC is implemented.
 * In simple terms, this class is used to retrieve admin user details from the database based on the username provided during login.
 * It ensures that the admin exists and returns the necessary details for authentication, including the username, password, and authorities.
 * This service is used by Spring Security to authenticate admin users when they log in to the application.
*/
@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found: " + username));
        // All admins get the same authority for security purposes
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_ADMIN");
        return new org.springframework.security.core.userdetails.User(
                admin.getUsername(),
                admin.getPassword(),
                Collections.singletonList(authority)
        );
    }
}
