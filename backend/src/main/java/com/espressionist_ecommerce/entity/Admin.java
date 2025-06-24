package com.espressionist_ecommerce.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

/**
 * Purpose: Represents an Admin entity in the e-commerce application, including fields for username, email, password, role, and timestamps.
 * Provides functionality for managing admin accounts with different roles and archiving status.
 */
@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {
    // Unique identifier for the admin user
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Username of the admin user, must be unique and not null
    @Column(nullable = false, unique = true, length = 50)
    private String username;
    // Email of the admin user, must be unique and not null
    @Column(nullable = false, unique = true)
    private String email;
    // Password of the admin user, must not be null
    @Column(nullable = false)
    private String password;
    // Role of the admin user, must not be null and is stored as a string
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;
    // Indicates whether the admin account is archived, default is false
    // This field is used to mark accounts that are no longer active without deleting them
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean archived = false;
    // Timestamp for the last login of the admin user, can be null if never logged in
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    // Timestamps for creation and last update of the admin account, automatically managed by Hibernate
    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;
    // Timestamp for the last update of the admin account, automatically managed by Hibernate
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    /**
     * Enum representing the different roles an admin can have.
     * This allows for easy management of admin and quick identification.
     */
    public enum Role {
        SUPER_ADMIN, MANAGER, STAFF
    }
}
