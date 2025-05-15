package com.espressionist_ecommerce.service;

import com.espressionist_ecommerce.model.Order;
import com.espressionist_ecommerce.model.OrderStatus;
import com.espressionist_ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.Random;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(Order order) {
        order.setOrderCode(generateOrderCode());
        order.setOrderDate(new Date());
        order.setStatus(OrderStatus.PENDING);
        double totalWithVAT = calculateTotalWithVAT(order);
        order.setTotalWithVAT(totalWithVAT);
        return orderRepository.save(order);
    }

    public Optional<Order> getOrderByOrderCode(String orderCode) {
        return orderRepository.findByOrderCode(orderCode);
    }

    public void updateOrderStatus(Long id, String status) {
        orderRepository.findById(id).ifPresent(order -> {
            OrderStatus newStatus = OrderStatus.fromString(status);
            order.setStatus(newStatus);
            if (newStatus == OrderStatus.DELIVERED) {
                order.setArchived(true);
            }
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

    private String generateOrderCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed similar looking chars
        Random random = new Random();
        StringBuilder code = new StringBuilder("ESP-");
        for (int i = 0; i < 7; i++) {
            code.append(chars.charAt(random.nextInt(chars.length())));
        }
        return code.toString();
    }
}