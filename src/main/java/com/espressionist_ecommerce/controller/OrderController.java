package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.model.Order;
import com.espressionist_ecommerce.model.OrderStatus;
import com.espressionist_ecommerce.model.OrderItem;
import com.espressionist_ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Optional;

/**
 * Controller for handling order-related operations such as checkout, order status retrieval,
 * and updating order status in the e-commerce application.
 *
 * <p>Endpoints:</p>
 * <ul>
 *   <li><b>POST /orders/checkout</b>: Creates a new order based on the provided order details and returns a summary response including the order code and total with VAT.</li>
 *   <li><b>GET /orders/order-status/{orderCode}</b>: Retrieves the status and details of an order using its unique order code.</li>
 *   <li><b>PUT /orders/update-status/{id}?status=STATUS</b>: Updates the status of an existing order by its ID. Validates the provided status value.</li>
 * </ul>
 *
 * <p>Dependencies:</p>
 * <ul>
 *   <li>{@link OrderService} for business logic related to order creation, retrieval, and status updates.</li>
 * </ul>
 *
 * <p>Inner Classes:</p>
 * <ul>
 *   <li><b>OrderSummaryResponse</b>: DTO for summarizing order details in the checkout response.</li>
 * </ul>
 *
 * <p>Exception Handling:</p>
 * <ul>
 *   <li>Returns HTTP 400 Bad Request for invalid input or exceptions during order creation or status update.</li>
 *   <li>Returns HTTP 404 Not Found if an order with the specified code does not exist.</li>
 * </ul>
 *
 * @author Your Name
 */
@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderCreateDTO orderDTO) {
        try {
            Order order = new Order();
            order.setCustomerName(orderDTO.getCustomerName());
            order.setCustomerEmail(orderDTO.getCustomerEmail());
            order.setShippingAddress(orderDTO.getShippingAddress());

            Order createdOrder = orderService.createOrder(order);
            OrderSummaryResponse summary = new OrderSummaryResponse(
                createdOrder.getCustomerName(),
                createdOrder.getOrderItems(),
                createdOrder.getShippingAddress(),
                orderService.calculateTotalWithVAT(createdOrder),
                createdOrder.getOrderCode(),
                "Please save this code to track your order."
            );
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/order-status/{orderCode}")
    public ResponseEntity<Order> getOrderStatus(@PathVariable String orderCode) {
        Optional<Order> order = orderService.getOrderByOrderCode(orderCode);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<Void> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            OrderStatus.fromString(status); // Validate status
            orderService.updateOrderStatus(id, status);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Add this DTO class (can be in the same file or a new file)
    class OrderSummaryResponse {
        public String customerName;
        public java.util.List<OrderItem> items;
        public String shippingAddress;
        public double totalWithVAT;
        public String orderCode;
        public String message;
        public OrderSummaryResponse(String customerName, java.util.List<OrderItem> items, String shippingAddress, double totalWithVAT, String orderCode, String message) {
            this.customerName = customerName;
            this.items = items;
            this.shippingAddress = shippingAddress;
            this.totalWithVAT = totalWithVAT;
            this.orderCode = orderCode;
            this.message = message;
        }
    }
}