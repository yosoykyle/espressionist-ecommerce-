package com.espressionist_ecommerce.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.espressionist_ecommerce.dto.OrderCreateDTO;
import com.espressionist_ecommerce.exception.BusinessException;
import com.espressionist_ecommerce.exception.ResourceNotFoundException;
import com.espressionist_ecommerce.model.Order;
import com.espressionist_ecommerce.model.OrderItem;
import com.espressionist_ecommerce.model.OrderStatus;
import com.espressionist_ecommerce.model.Product;
import com.espressionist_ecommerce.repository.OrderRepository;

/**
 * Service class handling order-related business logic.
 * 
 * Key features:
 * - Order creation with VAT calculation
 * - Stock validation and management
 * - Order status tracking
 * - Soft delete implementation
 */
@Service
@Transactional
public class OrderService {
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
    private static final double VAT_RATE = 0.12; // 12% VAT
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductService productService;

    /**
     * Creates a new order with the following steps:
     * 1. Validates stock availability
     * 2. Creates order and order items
     * 3. Updates product stock
     * 4. Calculates total with VAT
     */
    public Order createOrder(OrderCreateDTO orderDTO) {
        // Validate stock first to prevent partial orders
        validateStock(orderDTO);
        
        Order order = new Order();
        order.setCustomerName(orderDTO.getCustomerName());
        order.setCustomerEmail(orderDTO.getCustomerEmail());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setOrderItems(new ArrayList<>());
        order.setStatus(OrderStatus.PENDING);
        order.setOrderCode(generateOrderCode());
        order.setOrderDate(new Date());

        double total = processOrderItems(order, orderDTO);
        order.setTotalWithVAT(calculateTotalWithVAT(total));
        
        logger.info("Created order with code: {}", order.getOrderCode());
        return orderRepository.save(order);
    }

    private void validateStock(OrderCreateDTO orderDTO) {
        for (OrderCreateDTO.OrderItemDTO item : orderDTO.getItems()) {
            if (!productService.checkStockAvailability(item.getProductId(), item.getQuantity())) {
                Product product = productService.getProductById(item.getProductId());
                throw new BusinessException(
                    String.format("Insufficient stock for product '%s'. Available: %d, Requested: %d",
                    product.getName(), product.getQuantity(), item.getQuantity())
                );
            }
        }
    }

    private double processOrderItems(Order order, OrderCreateDTO orderDTO) {
        double total = 0.0;
        for (OrderCreateDTO.OrderItemDTO itemDTO : orderDTO.getItems()) {
            Product product = productService.getProductById(itemDTO.getProductId());
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(product.getPrice());
            order.getOrderItems().add(orderItem);
            
            productService.reduceStock(product.getId(), itemDTO.getQuantity());
            total += product.getPrice() * itemDTO.getQuantity();
        }
        return total;
    }

    private double calculateTotalWithVAT(double total) {
        return total * (1 + VAT_RATE);
    }

    @Transactional(readOnly = true)
    public Optional<Order> getOrderByOrderCode(String orderCode) {
        return orderRepository.findByOrderCode(orderCode)
            .filter(order -> !order.isArchived());
    }

    public void updateOrderStatus(Long id, String newStatus) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        OrderStatus requestedStatus = OrderStatus.fromString(newStatus);
        OrderStatus currentStatus = order.getStatus();
        
        // Validate status transition
        if (!isValidStatusTransition(currentStatus, requestedStatus)) {
            throw new BusinessException("Invalid status transition from " + currentStatus + " to " + requestedStatus);
        }
        
        order.setStatus(requestedStatus);
        
        // Archive order when delivered
        if (requestedStatus == OrderStatus.DELIVERED) {
            order.setArchived(true);
        }
        
        orderRepository.save(order);
    }

    private boolean isValidStatusTransition(OrderStatus current, OrderStatus next) {
        return switch (current) {
            case PENDING -> next == OrderStatus.PROCESSING;
            case PROCESSING -> next == OrderStatus.SHIPPED;
            case SHIPPED -> next == OrderStatus.DELIVERED;
            case DELIVERED -> false; // No further transitions allowed
            default -> false;
        };
    }

    private String generateOrderCode() {
        return "ESP-" + UUID.randomUUID().toString().substring(0, 7).toUpperCase();
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        // return orderRepository.findByArchivedFalse(); // Old line
        return orderRepository.findAllWithItemsAndProductsNotArchived(); // New line
    }

    @Transactional(readOnly = true)
    public List<Order> getRecentOrders() {
        return orderRepository.findTop10ByOrderByOrderDateDesc();
    }
}