package com.espressionist_ecommerce.repository;

import com.espressionist_ecommerce.model.Product;
import com.espressionist_ecommerce.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByArchivedFalse();
    List<Product> findByCategoryAndArchivedFalse(ProductCategory category);
    List<Product> findByNameContainingIgnoreCaseAndArchivedFalse(String name);
    List<Product> findByQuantityLessThanAndArchivedFalse(int quantity);
    long countByArchivedFalse();
    boolean existsByNameAndArchivedFalse(String name);
    List<Product> findByPriceLessThanEqualAndArchivedFalse(double price);
    List<Product> findByQuantityGreaterThanAndArchivedFalse(int quantity);
}