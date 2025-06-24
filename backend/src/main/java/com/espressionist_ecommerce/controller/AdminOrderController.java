package com.espressionist_ecommerce.controller;
import com.espressionist_ecommerce.dto.OrderDTO;
import com.espressionist_ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin/api/orders")
@RequiredArgsConstructor

/**
 * Purpose: Handles admin API requests for managing orders, including viewing all orders,
 * updating order status, archiving orders, and a combined endpoint for updating status and archived flag.
*/
public class AdminOrderController {
    private final OrderService orderService;
    // Endpoint to get all orders
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    // Endpoint to update order status
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
    // Endpoint to archive an order
    @PostMapping("/{id}/archive")
    public ResponseEntity<OrderDTO> archiveOrder(@PathVariable Long id, @RequestParam boolean archived) {
        return ResponseEntity.ok(orderService.archiveOrder(id, archived));
    }
    // Combined endpoint: update status and archived flag in one transaction
    @PutMapping("/{id}/status-archive")
    public ResponseEntity<OrderDTO> updateOrderStatusAndArchive(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam boolean archived) {
        return ResponseEntity.ok(orderService.updateOrderStatusAndArchive(id, status, archived));
    }
}
