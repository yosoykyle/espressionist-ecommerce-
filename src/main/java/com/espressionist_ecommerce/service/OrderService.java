package com.espressionist_ecommerce.service;

import com.espressionist_ecommerce.dto.OrderCreateDTO;
import com.espressionist_ecommerce.exception.BusinessException;
import com.espressionist_ecommerce.exception.ResourceNotFoundException;
import com.espressionist_ecommerce.model.*;
import com.espressionist_ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class OrderService {

    private static final double VAT_RATE = 0.12; // 12% VAT
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductService productService;

    public Order createOrder(OrderCreateDTO orderDTO) {
        // Validate all products and stock availability
        for (OrderCreateDTO.OrderItemDTO itemDTO : orderDTO.getItems()) {
            if (!productService.checkStockAvailability(itemDTO.getProductId(), itemDTO.getQuantity())) {
                throw new BusinessException("Insufficient stock for product ID: " + itemDTO.getProductId());
            }
        }
        
        Order order = new Order();
        order.setCustomerName(orderDTO.getCustomerName());
        order.setCustomerEmail(orderDTO.getCustomerEmail());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setOrderItems(new ArrayList<>());
        order.setStatus(OrderStatus.PENDING);
        order.setOrderCode(generateOrderCode());
        order.setOrderDate(new Date());
        
        // Create order items and calculate total
        double total = 0.0;
        for (OrderCreateDTO.OrderItemDTO itemDTO : orderDTO.getItems()) {
            Product product = productService.getProductById(itemDTO.getProductId());
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(product.getPrice());
            order.getOrderItems().add(orderItem);
            
            // Update stock
            productService.reduceStock(product.getId(), itemDTO.getQuantity());
            
            total += product.getPrice() * itemDTO.getQuantity();
        }
        
        // Add 12% VAT
        order.setTotalWithVAT(total * (1 + VAT_RATE));
        
        return orderRepository.save(order);
    }

    public Optional<Order> getOrderByOrderCode(String orderCode) {
        return orderRepository.findByOrderCode(orderCode);
    }

    public void updateOrderStatus(Long id, String newStatus) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        OrderStatus requestedStatus = OrderStatus.fromString(newStatus);
        order.setStatus(requestedStatus);
        
        // Archive order when delivered
        if (requestedStatus == OrderStatus.DELIVERED) {
            order.setArchived(true);
        }
        
        orderRepository.save(order);
    }

    private String generateOrderCode() {
        return "ESP-" + UUID.randomUUID().toString().substring(0, 7).toUpperCase();
    }

    public List<Order> getAllOrders() {
        return orderRepository.findByArchivedFalse();
    }

    public List<Order> getRecentOrders() {
        return orderRepository.findTop10ByOrderByOrderDateDesc();
    }
}