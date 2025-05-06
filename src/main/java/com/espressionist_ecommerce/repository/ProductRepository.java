package com.espressionist_ecommerce.repository;

import com.espressionist_ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByArchivedFalse(); // Fetch only non-archived products
}