package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.dto.OrderDTO;
import com.espressionist_ecommerce.dto.OrderRequestDTO;
import com.espressionist_ecommerce.service.OrderService;
import com.espressionist_ecommerce.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/api/checkout")
    public ResponseEntity<?> placeOrder(@Valid @RequestBody OrderRequestDTO orderRequestDTO) {
        try {
            OrderDTO createdOrder = orderService.placeOrder(orderRequestDTO);
            return new ResponseEntity<>(createdOrder, org.springframework.http.HttpStatus.CREATED);
        } catch (IllegalStateException | IllegalArgumentException e) {
            // Product archived or out of stock
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            // Product not found
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/api/orders/{code}")
    public ResponseEntity<OrderDTO> getOrderByCode(@PathVariable String code) {
        return ResponseEntity.ok(orderService.getOrderByCode(code));
    }

    @GetMapping("/api/order-status/{code}")
    public ResponseEntity<OrderDTO> getOrderStatus(@PathVariable String code) {
        return ResponseEntity.ok(orderService.getOrderByCode(code));
    }
}
