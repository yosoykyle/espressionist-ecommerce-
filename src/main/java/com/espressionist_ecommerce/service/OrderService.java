package com.espressionist_ecommerce.service;

import com.espressionist_ecommerce.model.Order;
import com.espressionist_ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private JavaMailSender mailSender;

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

    public void sendOrderConfirmationEmail(Order order) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(order.getCustomerEmail());
            helper.setSubject("Order Confirmation - Espressionist");
            helper.setText("""
                Dear " + order.getCustomerName() + ",

                Thank you for your order! Here are the details:

                Order Code: " + order.getOrderCode() + "
                Items: " + order.getOrderItems().toString() + "
                Total (with VAT): " + calculateTotalWithVAT(order) + "

                Shipping Address: " + order.getShippingAddress() + "

                Best regards,
                Espressionist Team
            """, false);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private double calculateTotalWithVAT(Order order) {
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