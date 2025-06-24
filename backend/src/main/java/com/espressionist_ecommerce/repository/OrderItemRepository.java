package com.espressionist_ecommerce.repository;
import com.espressionist_ecommerce.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
/**
 * Purpose: Repository interface for OrderItem entity, extending JpaRepository for CRUD operations.
 * Provides methods to manage order items in the database.
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Custom query methods if needed
}
