package com.espressionist_ecommerce.repository;

import com.espressionist_ecommerce.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderCode(String orderCode); // Fetch order by unique order code
    List<Order> findByArchivedFalse();
}