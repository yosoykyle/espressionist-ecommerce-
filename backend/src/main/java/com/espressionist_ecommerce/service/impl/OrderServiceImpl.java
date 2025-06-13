package com.espressionist_ecommerce.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.espressionist_ecommerce.dto.OrderDTO;
import com.espressionist_ecommerce.dto.OrderRequestDTO;
import com.espressionist_ecommerce.entity.Order;
import com.espressionist_ecommerce.entity.OrderItem;
import com.espressionist_ecommerce.entity.Product;
import com.espressionist_ecommerce.exception.ResourceNotFoundException;
import com.espressionist_ecommerce.repository.OrderRepository;
import com.espressionist_ecommerce.repository.ProductRepository; // For setting order date
import com.espressionist_ecommerce.service.OrderService;

import lombok.RequiredArgsConstructor; // For generating a unique order code

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Override
    public OrderDTO placeOrder(OrderRequestDTO orderRequestDTO) {
        Order order = new Order();
        // Map customer details from DTO to Order entity
        order.setCustomerName(orderRequestDTO.getCustomerName());
        order.setCustomerEmail(orderRequestDTO.getCustomerEmail());
        order.setCustomerPhone(orderRequestDTO.getCustomerPhone());
        order.setCustomerAddress(orderRequestDTO.getCustomerAddress());
        order.setCustomerCity(orderRequestDTO.getCustomerCity());
        order.setCustomerPostalCode(orderRequestDTO.getCustomerPostalCode());
        order.setCustomerNotes(orderRequestDTO.getCustomerNotes());

        // Set initial order details
        order.setCode(UUID.randomUUID().toString()); // Generate a unique order code
        order.setStatus(Order.OrderStatus.PENDING); // Default status
        order.setDate(LocalDateTime.now()); // Set current date/time

        BigDecimal subtotal = BigDecimal.ZERO;

        // Map OrderItemDTOs to OrderItem entities
        List<OrderItem> orderItems = orderRequestDTO.getItems().stream()
                .map(itemDTO -> {
                    Product product = productRepository.findById(itemDTO.getProductId())
                            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemDTO.getProductId()));
                    if (product.isArchived()) {
                        throw new IllegalStateException("Product is archived and cannot be ordered: " + product.getName());
                    }
                    if (product.getStock() < itemDTO.getQuantity()) {
                        throw new IllegalArgumentException(
                                "Insufficient stock for product: " + product.getName() +
                                ". Available: " + product.getStock() +
                                ", Requested: " + itemDTO.getQuantity());
                    }
                    product.setStock(product.getStock() - itemDTO.getQuantity());
                    productRepository.save(product);
                    OrderItem orderItem = new OrderItem();
                    orderItem.setProduct(product);
                    orderItem.setQuantity(itemDTO.getQuantity());
                    orderItem.setName(product.getName());
                    orderItem.setPrice(product.getPrice());
                    orderItem.setImage(product.getImage());
                    orderItem.setOrder(order);
                    return orderItem;
                })
                .collect(Collectors.toList());
        order.setItems(orderItems);

        // Calculate subtotal
        for (OrderItem item : order.getItems()) {
            BigDecimal itemTotal = item.getPrice().multiply(new BigDecimal(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }
        order.setSubtotal(subtotal);

        // Calculate VAT (example: 12% VAT rate)
        BigDecimal vatRate = new BigDecimal("0.12"); // Match frontend VAT
        BigDecimal vatAmount = subtotal.multiply(vatRate);
        order.setVat(vatAmount.setScale(2, RoundingMode.HALF_UP));

        // Calculate total
        BigDecimal total = subtotal.add(order.getVat());
        order.setTotal(total.setScale(2, RoundingMode.HALF_UP));

        Order savedOrder = orderRepository.save(order);
        return modelMapper.map(savedOrder, OrderDTO.class);
    }

    @Override
    public OrderDTO getOrderByCode(String code) {
        Order order = orderRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with code: " + code));
        return modelMapper.map(order, OrderDTO.class);
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public OrderDTO updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        // Only allow valid status transitions
        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            // Optionally: Add logic to restrict invalid transitions (e.g., can't go from DELIVERED to PROCESSING)
            order.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status, e);
        }
        Order updatedOrder = orderRepository.save(order);
        return modelMapper.map(updatedOrder, OrderDTO.class);
    }

    @Override
    public OrderDTO archiveOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        order.setArchived(true);
        Order archivedOrder = orderRepository.save(order);
        return modelMapper.map(archivedOrder, OrderDTO.class);
    }
}
