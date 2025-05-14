package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.model.Order;
import com.espressionist_ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderSummaryResponse> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        // Build order summary response (no email sent)
        OrderSummaryResponse summary = new OrderSummaryResponse(
            createdOrder.getCustomerName(),
            createdOrder.getOrderItems(),
            createdOrder.getShippingAddress(),
            orderService.calculateTotalWithVAT(createdOrder),
            createdOrder.getOrderCode(),
            "Please save this code to track your order."
        );
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/order-status/{orderCode}")
    public ResponseEntity<Order> getOrderStatus(@PathVariable String orderCode) {
        Optional<Order> order = orderService.getOrderByOrderCode(orderCode);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<Void> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        orderService.updateOrderStatus(id, status);
        return ResponseEntity.noContent().build();
    }

    // Add this DTO class (can be in the same file or a new file)
    class OrderSummaryResponse {
        public String customerName;
        public java.util.List<com.espressionist_ecommerce.model.OrderItem> items;
        public String shippingAddress;
        public double totalWithVAT;
        public String orderCode;
        public String message;
        public OrderSummaryResponse(String customerName, java.util.List<com.espressionist_ecommerce.model.OrderItem> items, String shippingAddress, double totalWithVAT, String orderCode, String message) {
            this.customerName = customerName;
            this.items = items;
            this.shippingAddress = shippingAddress;
            this.totalWithVAT = totalWithVAT;
            this.orderCode = orderCode;
            this.message = message;
        }
    }
}