package com.espressionist_ecommerce.service.impl;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.espressionist_ecommerce.dto.CustomerDTO;
import com.espressionist_ecommerce.dto.OrderDTO;
import com.espressionist_ecommerce.dto.OrderRequestDTO;
import com.espressionist_ecommerce.entity.Order;
import com.espressionist_ecommerce.entity.OrderItem;
import com.espressionist_ecommerce.entity.Product;
import com.espressionist_ecommerce.exception.ResourceNotFoundException;
import com.espressionist_ecommerce.repository.OrderRepository;
import com.espressionist_ecommerce.repository.ProductRepository;
import com.espressionist_ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;

/**
 * Purpose: Implementation of OrderService, handling order placement, retrieval, status updates, and archiving.
 * Provides methods to place orders, retrieve orders by code or all orders, update order status, and archive orders.
 */
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
        // Map customer details from OrderRequestDTO to Order entity
        order.setCustomerName(orderRequestDTO.getCustomerName());
        order.setCustomerEmail(orderRequestDTO.getCustomerEmail());
        order.setCustomerPhone(orderRequestDTO.getCustomerPhone());
        order.setCustomerAddress(orderRequestDTO.getCustomerAddress());
        order.setCustomerCity(orderRequestDTO.getCustomerCity());
        order.setCustomerPostalCode(orderRequestDTO.getCustomerPostalCode());
        order.setCustomerNotes(orderRequestDTO.getCustomerNotes());
        // Set initial order details
        order.setCode(generateShortOrderCode()); // Generate a short, memorable order code
        order.setStatus(Order.OrderStatus.PENDING); // Default status
        order.setDate(LocalDateTime.now()); // Set current date/time
        // Initialize subtotal, VAT, and total
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
        // Set archived status to false by default
        Order savedOrder = orderRepository.save(order);
        return modelMapper.map(savedOrder, OrderDTO.class);
    }
    @Override
    // Retrieves an order by its unique code, mapping to OrderDTO
    // If the order is not found, it throws a ResourceNotFoundException with a descriptive message.
    public OrderDTO getOrderByCode(String code) {
        Order order = orderRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with code: " + code));
        OrderDTO dto = modelMapper.map(order, OrderDTO.class);
        // Manually map customer fields to nested CustomerDTO
        CustomerDTO customer = new CustomerDTO();
        customer.setName(order.getCustomerName());
        customer.setEmail(order.getCustomerEmail());
        customer.setPhone(order.getCustomerPhone());
        customer.setAddress(order.getCustomerAddress());
        customer.setCity(order.getCustomerCity());
        customer.setPostalCode(order.getCustomerPostalCode());
        customer.setNotes(order.getCustomerNotes());
        dto.setCustomer(customer);
        return dto;
    }
    @Override
    // Retrieves all orders, mapping each Order entity to OrderDTO
    // It manually maps customer fields to a nested CustomerDTO for each order.
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> {
                    OrderDTO dto = modelMapper.map(order, OrderDTO.class);
                    // Manually map customer fields to nested CustomerDTO
                    CustomerDTO customer = new CustomerDTO();
                    customer.setName(order.getCustomerName());
                    customer.setEmail(order.getCustomerEmail());
                    customer.setPhone(order.getCustomerPhone());
                    customer.setAddress(order.getCustomerAddress());
                    customer.setCity(order.getCustomerCity());
                    customer.setPostalCode(order.getCustomerPostalCode());
                    customer.setNotes(order.getCustomerNotes());
                    dto.setCustomer(customer);
                    return dto;
                })
                .collect(Collectors.toList());
    }
    @Override
    // Updates the status of an existing order by its ID
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
    // Archives an existing order by its ID
    public OrderDTO archiveOrder(Long id, boolean archived) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        order.setArchived(archived);
        Order updatedOrder = orderRepository.save(order);
        return modelMapper.map(updatedOrder, OrderDTO.class);
    }
    @Override
    // For backward compatibility, this method defaults to archiving (setting archived = true)
    // It can be used to archive an order without specifying the archived flag.
    public OrderDTO archiveOrder(Long id) {
        // For backward compatibility, default to archiving (set archived = true)
        return archiveOrder(id, true);
    }
    @Override
    // Updates the status and archived flag of an existing order in one transaction
    // This method allows both status updates and archiving in a single operation.
    public OrderDTO updateOrderStatusAndArchive(Long id, String status, boolean archived) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status, e);
        }
        order.setArchived(archived);
        Order updatedOrder = orderRepository.save(order);
        return modelMapper.map(updatedOrder, OrderDTO.class);
    }
    // Generates a short, memorable order code
    // The code starts with "ESP-" followed by 6 random alphanumeric characters.
    private String generateShortOrderCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder("ESP-");
        for (int i = 0; i < 6; i++) {
            int idx = (int) (Math.random() * chars.length());
            sb.append(chars.charAt(idx));
        }
        return sb.toString();
    }
}
