package com.espressionist_ecommerce.repository;
import com.espressionist_ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Purpose: Repository interface for Product entity, extending JpaRepository for CRUD operations.
 * Provides methods to manage products in the database.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Custom query to check for duplicate product by name and category (case-insensitive, trimmed)
    @Query("SELECT p FROM Product p WHERE LOWER(TRIM(p.name)) = LOWER(TRIM(:name)) AND LOWER(TRIM(p.category)) = LOWER(TRIM(:category))")
    Product findByNameAndCategoryIgnoreCaseTrimmed(@Param("name") String name, @Param("category") String category);
}
