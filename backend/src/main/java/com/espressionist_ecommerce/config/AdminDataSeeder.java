package com.espressionist_ecommerce.config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.espressionist_ecommerce.entity.Admin;
import com.espressionist_ecommerce.repository.AdminRepository;

/**
 * Purpose: Seeds the database with a default admin user if no admin accounts exist.
 * This is useful for initial setup and testing purposes.
 * In simple terms, this class checks if there are any admin accounts in the database,
 * and if not, it creates a default admin user with a predefined username, email, and password.
 * This ensures that there is always at least one admin user available for managing the application.    
 */
@Component
// Provides a CommandLineRunner to execute code after the application context is loaded
// and before the application starts, ensuring that the default admin user is created if needed.
public class AdminDataSeeder implements CommandLineRunner {
    // Logger for logging messages during the seeding process
    private static final Logger logger = LoggerFactory.getLogger(AdminDataSeeder.class);

    private final AdminRepository adminRepository; // Repository for Admin entity operations
    private final PasswordEncoder passwordEncoder; // Added PasswordEncoder for password hashing

    // PasswordEncoder is used to hash the default admin password securely
    public AdminDataSeeder(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    /**
     * Runs the seeding logic to create a default admin user if no admin accounts exist.
     * This method is executed after the application context is loaded.
     */
    public void run(String... args) throws Exception {
        logger.info("AdminDataSeeder running...");
        // Check if there are any admin accounts in the database
        // If no admin accounts exist, create a default admin user
        if (adminRepository.count() == 0L) {
            logger.info("No admin accounts found. Creating default admin user.");
            // Create a default admin user with a predefined username, email, and role
            // The password is encoded using the PasswordEncoder bean
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
