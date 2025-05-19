package com.espressionist_ecommerce.repository;

import com.espressionist_ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByArchivedFalse();
    List<Product> findByArchivedFalseAndCategoryOrderByNameAsc(String category);
    List<Product> findByArchivedFalseAndQuantityLessThan(int quantity);
    List<Product> findByArchivedFalseAndNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
        String name, String category);
}