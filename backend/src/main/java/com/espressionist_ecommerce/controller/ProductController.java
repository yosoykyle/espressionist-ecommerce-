package com.espressionist_ecommerce.controller;
import com.espressionist_ecommerce.dto.ProductDTO;
import com.espressionist_ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// Purpose: Handles product-related API requests for customers
// This controller provides endpoints to retrieve active products and product details by ID.

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor

/**
 * ProductController is responsible for handling product-related API requests.
 * It provides endpoints to retrieve all active products and product details by ID.
 */
public class ProductController {
    // Injecting ProductService to handle business logic
    private final ProductService productService;
    // Endpoint to retrieve all active products
    // This endpoint returns a list of all products that are currently active (not archived).
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllActiveProducts());
    }
    // Endpoint to retrieve product details by ID
    // This endpoint returns the details of a specific product identified by its ID.
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
}
