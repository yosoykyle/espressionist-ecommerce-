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
        if (adminRepository.count() == 0L) {
            logger.info("No admin accounts found. Creating default admin user.");
            Admin defaultAdmin = new Admin();
            defaultAdmin.setUsername("admin");
            defaultAdmin.setEmail("admin@example.com");
            defaultAdmin.setRole(Admin.Role.SUPER_ADMIN);
            String hashedPassword = passwordEncoder.encode("password12345678");
            defaultAdmin.setPassword(hashedPassword);
            adminRepository.save(defaultAdmin);
            logger.info("Default admin user 'admin' created successfully.");
        } else {
            var allAdmins = adminRepository.findAll();
            // Find all SUPER_ADMINs
            var superAdmins = allAdmins.stream().filter(a -> a.getRole() == Admin.Role.SUPER_ADMIN).toList();
            // Find all active (not archived) SUPER_ADMINs except the seeder
            var activeSuperAdmins = superAdmins.stream().filter(a -> !a.isArchived() && !a.getUsername().equals("admin")).toList();
            // Find the seeder admin
            Admin defaultAdmin = allAdmins.stream()
                .filter(a -> a.getUsername().equals("admin") || a.getEmail().equals("admin@example.com"))
                .findFirst().orElse(null);
            if (activeSuperAdmins.size() > 0 && defaultAdmin != null && !defaultAdmin.isArchived()) {
                defaultAdmin.setArchived(true);
                adminRepository.save(defaultAdmin);
                logger.warn("Default admin user 'admin' archived for security because another active SUPER_ADMIN exists.");
            }
            // If all SUPER_ADMINs are archived, but there are other active admins, unarchive the seeder admin
            boolean allSuperAdminsArchived = superAdmins.stream().allMatch(Admin::isArchived);
            boolean hasActiveNonSuperAdmin = allAdmins.stream().anyMatch(a -> (a.getRole() != Admin.Role.SUPER_ADMIN) && !a.isArchived());
            boolean allAdminsArchived = allAdmins.stream().allMatch(Admin::isArchived);
            boolean shouldUnarchiveSeeder =
                (allSuperAdminsArchived && hasActiveNonSuperAdmin && defaultAdmin != null && defaultAdmin.isArchived()) ||
                (allAdminsArchived && defaultAdmin != null && defaultAdmin.isArchived());
            if (defaultAdmin != null && shouldUnarchiveSeeder) {
                defaultAdmin.setArchived(false);
                adminRepository.save(defaultAdmin);
                if (allAdminsArchived) {
                    logger.warn("All admins were archived. Seeder admin re-activated for safety.");
                } else {
                    logger.warn("All SUPER_ADMINs were archived but other admins are active. Seeder admin re-activated for safety.");
                }
            }
            logger.info("Admin accounts already exist ({}) Skipping default admin creation.", adminRepository.count());
        }
    }
}
