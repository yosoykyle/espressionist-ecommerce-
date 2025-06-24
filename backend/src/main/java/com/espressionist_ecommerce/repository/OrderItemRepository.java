package com.espressionist_ecommerce.repository;

/**
 * Purpose: Repository interface for OrderItem entity, providing CRUD operations and custom queries for order items.
 */

import com.espressionist_ecommerce.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Custom query methods if needed
}
