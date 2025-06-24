package com.espressionist_ecommerce.repository;

/**
 * Purpose: Repository interface for Product entity, providing CRUD operations and custom queries for products.
 */

import com.espressionist_ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Custom query methods if needed
}
