package com.espressionist_ecommerce.repository;

import com.espressionist_ecommerce.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByUsername(String username);
    
    List<Admin> findByArchivedFalse();
    
    boolean existsByUsernameAndArchivedFalse(String username);
    
    long countByActiveIsTrueAndArchivedIsFalse();
    
    Optional<Admin> findByUsernameAndArchivedFalse(String username);
    
    List<Admin> findByActiveIsTrueAndArchivedIsFalse();
}