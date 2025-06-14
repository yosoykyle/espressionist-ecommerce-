package com.espressionist_ecommerce.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.espressionist_ecommerce.entity.Admin;
import com.espressionist_ecommerce.repository.AdminRepository; // Recommended for DB operations

@Component
public class AdminDataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminDataSeeder.class);

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminDataSeeder(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional // Good practice for operations that modify the database
    public void run(String... args) throws Exception {
        logger.info("AdminDataSeeder running...");

        if (adminRepository.count() == 0L) {
            logger.info("No admin accounts found. Creating default admin user.");

            Admin defaultAdmin = new Admin();
            defaultAdmin.setUsername("admin");
            defaultAdmin.setEmail("admin@example.com");
            defaultAdmin.setRole(Admin.Role.SUPER_ADMIN);

            // Encode the password
            String hashedPassword = passwordEncoder.encode("password12345678"); // Using a slightly more complex default
            defaultAdmin.setPassword(hashedPassword);

            // Timestamps createdAt and updatedAt should be handled automatically by @CreationTimestamp and @UpdateTimestamp
            // defaultAdmin.setArchived(false); // This is the default in the Admin entity

            adminRepository.save(defaultAdmin);
            logger.info("Default admin user 'admin' created successfully.");
        } else {
            logger.info("Admin accounts already exist ({}) Skipping default admin creation.", adminRepository.count());
        }
    }
}
