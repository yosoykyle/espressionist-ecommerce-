package com.espressionist_ecommerce.repository;
import com.espressionist_ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Purpose: Repository interface for Product entity, extending JpaRepository for CRUD operations.
 * Provides methods to manage products in the database.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Additional custom query methods can be defined here if needed
}
