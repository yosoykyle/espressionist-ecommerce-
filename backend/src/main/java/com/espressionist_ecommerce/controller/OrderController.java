package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.dto.OrderDTO;
import com.espressionist_ecommerce.dto.OrderRequestDTO;
import com.espressionist_ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/api/checkout")
    public ResponseEntity<OrderDTO> placeOrder(@Valid @RequestBody OrderRequestDTO orderRequestDTO) {
        // Assuming placeOrder now returns a DTO that is suitable for CREATED status
        // And that the service handles the actual creation and returns the created order
        OrderDTO createdOrder = orderService.placeOrder(orderRequestDTO);
        // It's common to return 201 Created for successful resource creation
        return new ResponseEntity<>(createdOrder, org.springframework.http.HttpStatus.CREATED);
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
