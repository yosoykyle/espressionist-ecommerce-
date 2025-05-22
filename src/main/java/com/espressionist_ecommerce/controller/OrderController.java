package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.dto.OrderCreateDTO;
import com.espressionist_ecommerce.exception.BusinessException;
import com.espressionist_ecommerce.model.Order;
import com.espressionist_ecommerce.model.OrderStatus;
import com.espressionist_ecommerce.service.OrderService;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderCreateDTO orderDTO) {
        // Removed try-catch for BusinessException
        Order order = orderService.createOrder(orderDTO);
        return ResponseEntity.ok(new OrderSummaryResponse(
            order.getOrderCode(),
            order.getCustomerName(),
            order.getCustomerEmail(),
            order.getShippingAddress(),
            order.getTotalWithVAT(),
            "Please save this code to track your order."
        ));
    }

    @GetMapping("/order-status/{orderCode}")
    public ResponseEntity<?> getOrderStatus(@PathVariable String orderCode) {
        return orderService.getOrderByOrderCode(orderCode)
            .map(OrderTrackingResponse::new)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/admin/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        // Removed try-catch for Exception
        orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok().build();
    }

    private static class OrderSummaryResponse {
        @JsonProperty
        private final String orderCode;
        @JsonProperty
        private final String customerName;
        @JsonProperty
        private final String customerEmail;
        @JsonProperty
        private final String shippingAddress;
        @JsonProperty
        private final double totalWithVAT;
        @JsonProperty
        private final String message;

        public OrderSummaryResponse(String orderCode, String customerName, 
                String customerEmail, String shippingAddress, 
                double totalWithVAT, String message) {
            this.orderCode = orderCode;
            this.customerName = customerName;
            this.customerEmail = customerEmail;
            this.shippingAddress = shippingAddress;
            this.totalWithVAT = totalWithVAT;
            this.message = message;
        }

        public String getOrderCode() { return orderCode; }
    }

    private static class OrderItemResponse {
        @JsonProperty
        private final String productName;
        @JsonProperty
        private final int quantity;
        @JsonProperty
        private final double price;
        @JsonProperty
        private final double subtotal;

        public OrderItemResponse(String productName, int quantity, double price, double subtotal) {
            this.productName = productName;
            this.quantity = quantity;
            this.price = price;
            this.subtotal = subtotal;
        }

        public String getProductName() { return productName; }
        public int getQuantity() { return quantity; }
        public double getPrice() { return price; }
        public double getSubtotal() { return subtotal; }
    }

    private static class OrderTrackingResponse {
        @JsonProperty
        private final String orderCode;
        @JsonProperty
        private final Date orderDate;
        @JsonProperty
        private final String customerName;
        @JsonProperty
        private final String shippingAddress;
        @JsonProperty
        private final OrderStatus status;
        @JsonProperty
        private final List<OrderItemResponse> items;
        @JsonProperty
        private final double totalWithVAT;

        public OrderTrackingResponse(Order order) {
            this.orderCode = order.getOrderCode();
            this.orderDate = order.getOrderDate();
            this.customerName = order.getCustomerName();
            this.shippingAddress = order.getShippingAddress();
            this.status = order.getStatus();
            this.totalWithVAT = order.getTotalWithVAT();
            this.items = order.getOrderItems().stream()
                .map(item -> new OrderItemResponse(
                    item.getProduct().getName(),
                    item.getQuantity(),
                    item.getPrice(),
                    item.getPrice() * item.getQuantity()))
                .collect(Collectors.toList());
        }

        public String getOrderCode() { return orderCode; }
        public Date getOrderDate() { return orderDate; }
        public String getCustomerName() { return customerName; }
        public String getShippingAddress() { return shippingAddress; }
        public OrderStatus getStatus() { return status; }
        public List<OrderItemResponse> getItems() { return items; }
        public double getTotalWithVAT() { return totalWithVAT; }
    }
}