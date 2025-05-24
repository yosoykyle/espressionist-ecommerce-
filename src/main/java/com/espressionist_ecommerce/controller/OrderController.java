package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.dto.OrderCreateDTO;
import com.espressionist_ecommerce.dto.OrderTrackingDTO;
import com.espressionist_ecommerce.exception.BusinessException;
import com.espressionist_ecommerce.model.Order;
import com.espressionist_ecommerce.model.OrderItem;
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
            .map(order -> {
                OrderTrackingDTO dto = new OrderTrackingDTO();
                dto.setOrderCode(order.getOrderCode());
                dto.setOrderDate(order.getOrderDate());
                dto.setCustomerName(order.getCustomerName());
                dto.setShippingAddress(order.getShippingAddress());
                dto.setStatus(order.getStatus());
                dto.setTotalWithVAT(order.getTotalWithVAT());
                List<OrderTrackingDTO.OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                    .map(item -> { // item is of type com.espressionist_ecommerce.model.OrderItem
                        OrderTrackingDTO.OrderItemDTO orderItemDTO = new OrderTrackingDTO.OrderItemDTO();
                        orderItemDTO.setProductName(item.getProduct().getName());
                        orderItemDTO.setQuantity(item.getQuantity());
                        orderItemDTO.setPrice(item.getPrice());
                        orderItemDTO.setSubtotal(item.getPrice() * item.getQuantity());
                        return orderItemDTO;
                    })
                    .collect(Collectors.toList());
                dto.setItems(itemDTOs);
                return dto;
            })
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
}