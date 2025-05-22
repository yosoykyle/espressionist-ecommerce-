package com.espressionist_ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.espressionist_ecommerce.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderCode(String orderCode);
    List<Order> findByArchivedFalse();
    List<Order> findTop10ByOrderByOrderDateDesc();

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.product WHERE o.archived = false ORDER BY o.orderDate DESC")
    List<Order> findAllWithItemsAndProductsNotArchived();
}