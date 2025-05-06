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
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        orderService.sendOrderConfirmationEmail(createdOrder); // Send confirmation email
        return ResponseEntity.ok(createdOrder);
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
}