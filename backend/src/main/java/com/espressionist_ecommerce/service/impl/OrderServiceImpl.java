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
import com.espressionist_ecommerce.exception.ResourceNotFoundException;
import com.espressionist_ecommerce.repository.OrderRepository;
import com.espressionist_ecommerce.repository.ProductRepository;
import com.espressionist_ecommerce.service.EmailService;
import com.espressionist_ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;

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
        emailText.append("\nVAT (12%): ").append(formatCurrency(order.getVat()));
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
        // Initialize subtotal, VAT, and total
        BigDecimal subtotal = BigDecimal.ZERO;
        // Map OrderItemDTOs to OrderItem entities
        List<OrderItem> orderItems = orderRequestDTO.getItems().stream()
                .map(itemDTO -> {
                    Product product = productRepository.findById(itemDTO.getProductId())
                            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemDTO.getProductId())); // Product lookup
                    if (product.isArchived()) {
                        throw new IllegalStateException("Product is archived and cannot be ordered: " + product.getName()); // Check if product is archived
                    }
                    if (product.getStock() < itemDTO.getQuantity()) {
                        throw new IllegalArgumentException(
                                "Insufficient stock for product: " + product.getName() +
                                ". Available: " + product.getStock() +
                                ", Requested: " + itemDTO.getQuantity());  // Check stock availability
                    }
                    product.setStock(product.getStock() - itemDTO.getQuantity()); // Deduct stock
                    productRepository.save(product); // Save updated product stock
                    OrderItem orderItem = new OrderItem();  // Create new OrderItem entity
                    orderItem.setProduct(product); // Set product reference
                    orderItem.setQuantity(itemDTO.getQuantity()); // Set quantity from OrderItemDTO
                    orderItem.setName(product.getName()); // Set product name
                    orderItem.setPrice(product.getPrice()); // Set product price
                    orderItem.setImage(product.getImage()); // Set product image
                    orderItem.setOrder(order); // Set back-reference to Order
                    return orderItem; // Return the mapped OrderItem entity
                })
                .collect(Collectors.toList()); // Collect OrderItem entities from DTOs
        order.setItems(orderItems); // Set the list of OrderItems in the Order entity
        // Calculate subtotal
        for (OrderItem item : order.getItems()) {
            BigDecimal itemTotal = item.getPrice().multiply(new BigDecimal(item.getQuantity()));
            subtotal = subtotal.add(itemTotal); // Sum up item totals to get subtotal
        }
        order.setSubtotal(subtotal); // Set subtotal in the Order entity
        // Calculate VAT (example: 12% VAT rate)
        BigDecimal vatRate = new BigDecimal("0.12"); // Match frontend VAT
        BigDecimal vatAmount = subtotal.multiply(vatRate); // Calculate VAT based on subtotal
        order.setVat(vatAmount.setScale(2, RoundingMode.HALF_UP)); // Set VAT amount in the Order entity, rounding to 2 decimal places
        // Calculate total
        BigDecimal total = subtotal.add(order.getVat()); // Total is subtotal + VAT
        order.setTotal(total.setScale(2, RoundingMode.HALF_UP)); // Set total in the Order entity, rounding to 2 decimal places 
        // Set archived status to false by default
        Order savedOrder = orderRepository.save(order); // Save the order to the repository
        // Send confirmation email only after saving, and use the savedOrder object
        sendStatusEmail(savedOrder, Order.OrderStatus.PENDING); // Send confirmation email with initial status PENDING
        return modelMapper.map(savedOrder, OrderDTO.class); // Map the saved Order entity to OrderDTO and return it
    }
    @Override
    // Retrieves an order by its unique code, mapping to OrderDTO
    // If the order is not found, it throws a ResourceNotFoundException with a descriptive message.
    public OrderDTO getOrderByCode(String code) {
        Order order = orderRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with code: " + code)); // Find order by code
        OrderDTO dto = modelMapper.map(order, OrderDTO.class); // Map Order entity to OrderDTO
        // Manually map customer fields to nested CustomerDTO
        CustomerDTO customer = new CustomerDTO(); // Create a new CustomerDTO
        customer.setName(order.getCustomerName()); // Set customer name
        customer.setEmail(order.getCustomerEmail()); // Set customer email
        customer.setPhone(order.getCustomerPhone()); // Set customer phone
        customer.setAddress(order.getCustomerAddress()); // Set customer address
        customer.setCity(order.getCustomerCity()); // Set customer city
        customer.setPostalCode(order.getCustomerPostalCode()); // Set customer postal code
        customer.setNotes(order.getCustomerNotes()); // Set customer notes
        dto.setCustomer(customer); // Set the CustomerDTO in the OrderDTO
        return dto; // Return the mapped OrderDTO with customer details
    }
    @Override
    // Retrieves all orders, mapping each Order entity to OrderDTO
    // It manually maps customer fields to a nested CustomerDTO for each order.
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> {
                    OrderDTO dto = modelMapper.map(order, OrderDTO.class);
                    // Manually map customer fields to nested CustomerDTO
                    CustomerDTO customer = new CustomerDTO(); // Create a new CustomerDTO
                    customer.setName(order.getCustomerName()); // Set customer name
                    customer.setEmail(order.getCustomerEmail()); // Set customer email
                    customer.setPhone(order.getCustomerPhone()); // Set customer phone
                    customer.setAddress(order.getCustomerAddress()); // Set customer address
                    customer.setCity(order.getCustomerCity()); // Set customer city
                    customer.setPostalCode(order.getCustomerPostalCode()); // Set customer postal code
                    customer.setNotes(order.getCustomerNotes()); // Set customer notes
                    dto.setCustomer(customer); // Set the CustomerDTO in the OrderDTO
                    return dto; // Return the mapped OrderDTO with customer details
                })
                .collect(Collectors.toList()); // Collect all OrderDTOs into a list
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
