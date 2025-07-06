package com.espressionist_ecommerce.service.impl;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.espressionist_ecommerce.dto.CustomerDTO;
import com.espressionist_ecommerce.dto.OrderDTO;
import com.espressionist_ecommerce.dto.OrderRequestDTO;
import com.espressionist_ecommerce.entity.Order;
import com.espressionist_ecommerce.entity.OrderItem;
import com.espressionist_ecommerce.entity.Product;
import com.espressionist_ecommerce.entity.ShippingFee;
import com.espressionist_ecommerce.exception.ResourceNotFoundException;
import com.espressionist_ecommerce.repository.OrderRepository;
import com.espressionist_ecommerce.repository.ProductRepository;
import com.espressionist_ecommerce.service.EmailService;
import com.espressionist_ecommerce.service.OrderService;
import com.espressionist_ecommerce.service.ShippingFeeService;
import java.time.LocalDateTime;

/**
 * Purpose: Implementation of OrderService, handling order placement, retrieval, status updates, and archiving.
 * Provides methods to place orders, retrieve orders by code or all orders, update order status, and archive orders.
 */
@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ShippingFeeService shippingFeeService;
    @Autowired
    private EmailService emailService;

    private String formatCurrency(BigDecimal amount) {
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("en", "PH"));
        formatter.setMinimumFractionDigits(2);
        formatter.setMaximumFractionDigits(2);
        // Remove currency symbol, add Peso sign manually for consistency
        String formatted = formatter.format(amount);
        if (formatted.startsWith("₱")) {
            return formatted;
        } else {
            return "₱" + formatted.replaceAll("[^0-9.,]", "");
        }
    }

    private void sendStatusEmail(Order order, Order.OrderStatus status) {
        String subject;
        StringBuilder emailText = new StringBuilder();
        switch (status) {
            case PENDING:
                subject = "Order Placed - " + order.getCode();
                emailText.append("Your order has been placed and is now pending.\n\n");
                break;
            case PROCESSING:
                subject = "Order Processing - " + order.getCode();
                emailText.append("Your order is now being processed.\n\n");
                break;
            case SHIPPED:
                subject = "Order Shipped - " + order.getCode();
                emailText.append("Your order has been shipped!\n\n");
                break;
            case DELIVERED:
                subject = "Order Delivered - " + order.getCode();
                emailText.append("Good news! Your order has been delivered.\n\n");
                break;
            case CANCELLED:
                subject = "Order Cancelled - " + order.getCode();
                emailText.append("Your order has been cancelled.\n\n");
                break;
            default:
                subject = "Order Update - " + order.getCode();
                emailText.append("Your order status has been updated.\n\n");
        }
        emailText.append("Order Code: ").append(order.getCode()).append("\n");
        emailText.append("Order Date: ").append(order.getDate()).append("\n\n");
        // Always include items in the email
        emailText.append("Items:\n");
        for (OrderItem item : order.getItems()) {
            emailText.append("- ")
                .append(item.getName())
                .append(" (")
                .append(formatCurrency(item.getPrice()))
                .append(" x ")
                .append(item.getQuantity())
                .append(")\n");
        }
        emailText.append("\nSubtotal: ").append(formatCurrency(order.getSubtotal()));
        // Use persisted shipping fee total
        emailText.append("\nShipping Fee: ").append(formatCurrency(order.getShippingFeeTotal()));
        emailText.append("\n");
        emailText.append("Shipping fee is calculated as follows: For each order, the category with the highest base shipping fee is charged as the base. Each additional category in the order is charged its respective additional fee. Only the following categories are valid: Coffee & Tea, Art & Merch, Gift Set, Gear. Shipping fees are never negative and are set by the store admin.\n");
        emailText.append("VAT (12%): ").append(formatCurrency(order.getVat()));
        emailText.append("\nTotal: ").append(formatCurrency(order.getTotal()));
        emailText.append("\n\nShipping to: ")
            .append(order.getCustomerName()).append(", ")
            .append(order.getCustomerAddress()).append(", ")
            .append(order.getCustomerCity()).append(", ")
            .append(order.getCustomerPostalCode());
        if (order.getCustomerNotes() != null && !order.getCustomerNotes().isEmpty()) {
            emailText.append("\nNotes: ").append(order.getCustomerNotes());
        }
        emailText.append("\n\nThank you for shopping with us!\n");
        emailService.sendOrderConfirmation(order.getCustomerEmail(), subject, emailText.toString());
    }

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
        // Initialize subtotal (sum of item prices only)
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
        // Calculate subtotal (sum of item prices only)
        for (OrderItem item : order.getItems()) {
            BigDecimal itemTotal = item.getPrice().multiply(new BigDecimal(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }
        // --- Shipping Fee Calculation (Base + Additional, always uses persisted fees) ---
        java.util.List<ShippingFee> persistedFees = shippingFeeService.getAllShippingFees();
        java.util.Map<String, ShippingFee> categoryFees = new java.util.HashMap<>();
        for (ShippingFee fee : persistedFees) {
            categoryFees.put(fee.getCategory().toString(), fee);
        }
        java.util.Set<String> categories = orderItems.stream()
            .map(item -> item.getProduct().getCategory())
            .collect(java.util.stream.Collectors.toSet());
        java.util.List<ShippingFee> fees = categories.stream()
            .map(categoryFees::get)
            .filter(java.util.Objects::nonNull)
            .sorted((a, b) -> b.getBaseFee().compareTo(a.getBaseFee()))
            .collect(java.util.stream.Collectors.toList());
        // Build shipping fee breakdown and sum shippingFee
        java.util.List<java.util.Map<String, Object>> shippingFeeBreakdown = new java.util.ArrayList<>();
        BigDecimal shippingFee = BigDecimal.ZERO;
        boolean allZeroFees = true;
        if (!fees.isEmpty()) {
            ShippingFee base = fees.get(0);
            java.util.Map<String, Object> baseMap = new java.util.HashMap<>();
            baseMap.put("category", base.getCategory().toString());
            baseMap.put("type", "base");
            baseMap.put("fee", base.getBaseFee());
            shippingFeeBreakdown.add(baseMap);
            shippingFee = shippingFee.add(base.getBaseFee());
            if (base.getBaseFee().compareTo(BigDecimal.ZERO) > 0) allZeroFees = false;
            for (int i = 1; i < fees.size(); i++) {
                ShippingFee addl = fees.get(i);
                java.util.Map<String, Object> addlMap = new java.util.HashMap<>();
                addlMap.put("category", addl.getCategory().toString());
                addlMap.put("type", "additional");
                addlMap.put("fee", addl.getAdditionalFee());
                shippingFeeBreakdown.add(addlMap);
                shippingFee = shippingFee.add(addl.getAdditionalFee());
                if (addl.getAdditionalFee().compareTo(BigDecimal.ZERO) > 0) allZeroFees = false;
            }
        }
        if (categories.size() != fees.size()) {
            throw new IllegalStateException("Shipping fee missing for one or more product categories in the order.");
        }
        // Throw error if all shipping fees are zero (unless cart is empty)
        if (fees.size() > 0 && allZeroFees) {
            throw new IllegalStateException("Shipping fee configuration is missing or set to zero for all categories. Please contact the store admin.");
        }
        // --- VAT and Total Calculation: VAT is only on item subtotal (not shipping fee) ---
        BigDecimal vat = subtotal.multiply(new BigDecimal("0.12")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(shippingFee).add(vat).setScale(2, RoundingMode.HALF_UP);
        order.setSubtotal(subtotal);
        order.setVat(vat);
        order.setTotal(total);
        // Persist the shipping fee total at order time
        order.setShippingFeeTotal(shippingFee);
        // Save order
        Order savedOrder = orderRepository.save(order);
        // Send confirmation email
        sendStatusEmail(savedOrder, Order.OrderStatus.PENDING);
        // Build response DTO
        OrderDTO dto = modelMapper.map(savedOrder, OrderDTO.class);
        dto.setShippingFeeTotal(savedOrder.getShippingFeeTotal());
        return dto;
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
        // Use persisted shipping fee total
        dto.setShippingFeeTotal(order.getShippingFeeTotal());
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
                    // Use persisted shipping fee total
                    dto.setShippingFeeTotal(order.getShippingFeeTotal());
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
            order.setStatus(newStatus);
            // Only send status email if not resetting to PENDING (to avoid duplicate confirmation emails)
            if (newStatus != Order.OrderStatus.PENDING) {
                sendStatusEmail(order, newStatus);  // Send email notification for status change
            }
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status, e);
        }
        Order updatedOrder = orderRepository.save(order);   // Save the updated order
        return modelMapper.map(updatedOrder, OrderDTO.class); // Map to OrderDTO and return
    }
    @Override
    // Archives an existing order by its ID
    public OrderDTO archiveOrder(Long id, boolean archived) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id)); // Ensure the order exists
        order.setArchived(archived); // Set the archived status
        Order updatedOrder = orderRepository.save(order); // Save the updated order
        return modelMapper.map(updatedOrder, OrderDTO.class); // Map to OrderDTO and return
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
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));// Ensure the order exists
        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status.toUpperCase());// Convert status string to enum
            order.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status, e);// Handle invalid status
        }
        order.setArchived(archived);
        Order updatedOrder = orderRepository.save(order); // Save the updated order
        return modelMapper.map(updatedOrder, OrderDTO.class); // Map to OrderDTO and return
    }
    // Generates a short, memorable order code
    // The code starts with "ESP-" followed by 6 random alphanumeric characters.
    private String generateShortOrderCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Alphanumeric characters for the code
        // Use StringBuilder for efficient string concatenation
        StringBuilder sb = new StringBuilder("ESP-"); // Prefix with "ESP-"
        // Generate 6 random characters from the set
        for (int i = 0; i < 6; i++) {
            int idx = (int) (Math.random() * chars.length()); // Generate a random index
            sb.append(chars.charAt(idx)); // Append a random character from the set
        }
        return sb.toString(); // Ensure the code is unique
    }
}
