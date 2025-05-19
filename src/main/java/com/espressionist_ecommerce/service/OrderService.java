package com.espressionist_ecommerce.service;

import com.espressionist_ecommerce.model.Order;
import com.espressionist_ecommerce.model.OrderItem;
import com.espressionist_ecommerce.model.OrderStatus;
import com.espressionist_ecommerce.model.Product;
import com.espressionist_ecommerce.repository.OrderRepository;
import com.espressionist_ecommerce.repository.ProductRepository;
import com.espressionist_ecommerce.service.exception.BusinessException;
import com.espressionist_ecommerce.service.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    private static final double VAT_RATE = 0.12; // 12% VAT

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

    @Transactional
    public void updateOrderStatus(Long id, String newStatus) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        OrderStatus currentStatus = order.getStatus();
        OrderStatus requestedStatus = OrderStatus.fromString(newStatus);
        
        // Validate status transition
        validateStatusTransition(currentStatus, requestedStatus);
        
        order.setStatus(requestedStatus);
        
        // If order is marked as DELIVERED, archive it
        if (requestedStatus == OrderStatus.DELIVERED) {
            order.setArchived(true);
        }
        
        orderRepository.save(order);
    }
    
    private void validateStatusTransition(OrderStatus current, OrderStatus requested) {
        // Define valid transitions
        switch (current) {
            case PENDING:
                if (requested != OrderStatus.PROCESSING && requested != OrderStatus.CANCELLED) {
                    throw new BusinessException("Orders in PENDING state can only move to PROCESSING or CANCELLED");
                }
                break;
            case PROCESSING:
                if (requested != OrderStatus.SHIPPED && requested != OrderStatus.CANCELLED) {
                    throw new BusinessException("Orders in PROCESSING state can only move to SHIPPED or CANCELLED");
                }
                break;
            case SHIPPED:
                if (requested != OrderStatus.DELIVERED) {
                    throw new BusinessException("Orders in SHIPPED state can only move to DELIVERED");
                }
                break;
            case DELIVERED:
                throw new BusinessException("Cannot change status of DELIVERED orders");
            case CANCELLED:
                throw new BusinessException("Cannot change status of CANCELLED orders");
            default:
                throw new BusinessException("Invalid order status");
        }
    }

    public double calculateTotalWithVAT(Order order) {
        double subtotal = order.getOrderItems().stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
        double vat = subtotal * VAT_RATE;
        return subtotal + vat;
    }

    public void archiveOrder(Long id) {
        orderRepository.findById(id).ifPresent(order -> {
            order.setArchived(true);
            orderRepository.save(order);
        });
    }

    public List<Order> getRecentOrders() {
        return orderRepository.findByArchivedFalse().stream()
            .sorted((o1, o2) -> o2.getOrderDate().compareTo(o1.getOrderDate()))
            .limit(10)  // Get last 10 orders
            .toList();
    }

    public long getActiveOrderCount() {
        return orderRepository.findByArchivedFalse().size();
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll().stream()
            .sorted((o1, o2) -> o2.getOrderDate().compareTo(o1.getOrderDate()))
            .toList();
    }

    private void validateOrder(Order order) {
        // Email validation
        if (!order.getCustomerEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new BusinessException("Invalid email format");
        }

        // Order items validation
        if (order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            throw new BusinessException("Order must contain at least one item");
        }

        // Check stock availability and validate quantities
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            if (product == null) {
                throw new BusinessException("Invalid product in order items");
            }
            if (item.getQuantity() <= 0) {
                throw new BusinessException("Item quantity must be greater than 0");
            }
            if (item.getQuantity() > product.getQuantity()) {
                throw new BusinessException(
                    String.format("Insufficient stock for product '%s'. Available: %d, Requested: %d",
                        product.getName(), product.getQuantity(), item.getQuantity())
                );
            }
        }
    }

    @Transactional
    public Order createOrder(OrderCreateDTO orderDTO) {
        // Validate all products and stock availability first
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
        
        // Create order items and update stock
        double total = 0.0;
        for (OrderCreateDTO.OrderItemDTO itemDTO : orderDTO.getItems()) {
            Product product = productService.getProductById(itemDTO.getProductId());
            
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(product.getPrice());
            order.addOrderItem(orderItem);
            
            // Update stock
            productService.reduceStock(product.getId(), itemDTO.getQuantity());
            
            total += product.getPrice() * itemDTO.getQuantity();
        }
        
        // Add 12% VAT
        order.setTotalWithVAT(total * 1.12);
        
        return orderRepository.save(order);
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