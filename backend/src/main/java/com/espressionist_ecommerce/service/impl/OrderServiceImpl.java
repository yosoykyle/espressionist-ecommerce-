package com.espressionist_ecommerce.service.impl;

import com.espressionist_ecommerce.dto.OrderDTO;
import com.espressionist_ecommerce.dto.OrderItemDTO;
import com.espressionist_ecommerce.dto.OrderRequestDTO;
import com.espressionist_ecommerce.entity.Order;
import com.espressionist_ecommerce.entity.OrderItem;
import com.espressionist_ecommerce.entity.Product; // Keep for later stock logic
import com.espressionist_ecommerce.repository.OrderRepository;
// TODO: Add ResourceNotFoundException import later
import com.espressionist_ecommerce.repository.ProductRepository;
import com.espressionist_ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime; // For setting order date
import java.util.List;
import java.util.UUID; // For generating a unique order code
import java.util.stream.Collectors;

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
                            .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemDTO.getProductId())); // TODO: Custom exception

                    if (product.isArchived()) {
                        throw new RuntimeException("Product is archived and cannot be ordered: " + product.getName()); // TODO: Custom exception
                    }

                    // Check stock
                    if (product.getStock() < itemDTO.getQuantity()) {
                        throw new RuntimeException( // TODO: Custom InsufficientStockException
                                "Insufficient stock for product: " + product.getName() +
                                ". Available: " + product.getStock() +
                                ", Requested: " + itemDTO.getQuantity());
                    }

                    // Decrement stock
                    product.setStock(product.getStock() - itemDTO.getQuantity());
                    productRepository.save(product); // Persist stock change and trigger optimistic lock check

                    OrderItem orderItem = new OrderItem();
                    orderItem.setProduct(product);
                    orderItem.setQuantity(itemDTO.getQuantity());
                    orderItem.setName(product.getName()); // Set name from Product
                    orderItem.setPrice(product.getPrice()); // Set price from Product
                    orderItem.setImage(product.getImage()); // Set image from Product
                    orderItem.setOrder(order); // Set the bidirectional relationship
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

        // Calculate VAT (example: 20% VAT rate)
        BigDecimal vatRate = new BigDecimal("0.20"); // Consider making this configurable
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
                .orElseThrow(() -> new RuntimeException("Order not found with code: " + code)); // TODO: Use ResourceNotFoundException
        return modelMapper.map(order, OrderDTO.class);
    }

    // --- Methods from interface that are not fully matching the old implementation or are new ---
    // These will need proper implementation or reconciliation if used.
    // For now, providing basic stubs or adapting existing ones if very similar.

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public OrderDTO updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id)); // TODO: Use ResourceNotFoundException
        // TODO: Add validation for status string and transition logic
        try {
            order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid order status: " + status, e);
        }
        Order updatedOrder = orderRepository.save(order);
        return modelMapper.map(updatedOrder, OrderDTO.class);
    }

    @Override
    public OrderDTO archiveOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id)); // TODO: Use ResourceNotFoundException
        order.setArchived(true);
        Order archivedOrder = orderRepository.save(order);
        return modelMapper.map(archivedOrder, OrderDTO.class);
    }

    // --- Deprecated methods that were previously in OrderServiceImpl ---

    /**
     * @deprecated Replaced by {@link #getOrderByCode(String)} or other specific queries.
     */
    @Deprecated
    public java.util.Optional<OrderDTO> getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(order -> modelMapper.map(order, OrderDTO.class));
    }

    /**
     * @deprecated Replaced by {@link #placeOrder(OrderRequestDTO)}.
     */
    @Deprecated
    public OrderDTO createOrder(OrderDTO orderDTO) {
        // This logic is substantially different and complex, parts of it will move to placeOrder.
        // For now, just marking as deprecated. The new placeOrder has the basic structure.
        throw new UnsupportedOperationException("Deprecated: Use placeOrder(OrderRequestDTO) instead.");
    }

    /**
     * @deprecated This specific update logic might be too broad or conflict with updateOrderStatus.
     *             Review if a general update method is needed or if specific updates are preferred.
     */
    @Deprecated
    public OrderDTO updateOrder(Long id, OrderDTO orderDTO) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        // This was a very generic update, consider specific update methods.
        try {
            order.setStatus(Order.OrderStatus.valueOf(orderDTO.getStatus().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid order status: " + orderDTO.getStatus(), e);
        }
        order = orderRepository.save(order);
        return modelMapper.map(order, OrderDTO.class);
    }

    /**
     * @deprecated Replaced by {@link #archiveOrder(Long)} for soft delete.
     *             Hard deletes are generally discouraged for orders.
     */
    @Deprecated
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
