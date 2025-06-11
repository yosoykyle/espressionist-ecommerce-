package com.espressionist_ecommerce.repository;

import com.espressionist_ecommerce.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    java.util.Optional<Admin> findByUsername(String username);
}
