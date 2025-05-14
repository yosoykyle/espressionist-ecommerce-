package com.espressionist_ecommerce.service;

import com.espressionist_ecommerce.model.Order;
import com.espressionist_ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Optional<Order> getOrderByOrderCode(String orderCode) {
        return orderRepository.findByOrderCode(orderCode);
    }

    public void updateOrderStatus(Long id, String status) {
        orderRepository.findById(id).ifPresent(order -> {
            order.setStatus(status);
            orderRepository.save(order);
        });
    }

    public double calculateTotalWithVAT(Order order) {
        double total = order.getOrderItems().stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
        return total * 1.12; // Add 12% VAT
    }

    public void archiveOrder(Long id) {
        orderRepository.findById(id).ifPresent(order -> {
            order.setArchived(true);
            orderRepository.save(order);
        });
    }
}