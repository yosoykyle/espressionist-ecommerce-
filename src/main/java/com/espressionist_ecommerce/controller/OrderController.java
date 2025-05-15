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

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> createOrder(@Valid @RequestBody Order order) {
        if (order.getCustomerName() == null || order.getCustomerEmail() == null || 
            order.getShippingAddress() == null || order.getOrderItems() == null || 
            order.getOrderItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }
        
        try {
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