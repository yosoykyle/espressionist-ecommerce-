package com.espressionist_ecommerce.repository;

import com.espressionist_ecommerce.model.Product;
import com.espressionist_ecommerce.model.ProductCategory;
import org.springframework.data.domain.Page; // Ensure this import is added
import org.springframework.data.domain.Pageable; // Ensure this import is added
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Ensure this import is added
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Basic queries
    List<Product> findByArchivedFalse();
    List<Product> findByCategoryAndArchivedFalse(ProductCategory category);
    List<Product> findByNameContainingIgnoreCaseAndArchivedFalse(String name);
    
    // Stock management queries
    List<Product> findByQuantityLessThanAndArchivedFalse(int quantity);
    List<Product> findByQuantityGreaterThanAndArchivedFalse(int quantity);
    
    // Validation queries
    long countByArchivedFalse();
    boolean existsByNameAndArchivedFalse(String name);
    
    // Price-based queries
    List<Product> findByPriceLessThanEqualAndArchivedFalse(double price);

    @Query("SELECT p FROM Product p WHERE p.archived = false ORDER BY p.id ASC") // Simple ordering, can be changed
    Page<Product> findActiveProducts(Pageable pageable);
}