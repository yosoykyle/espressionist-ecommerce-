package com.espressionist_ecommerce.controller;
import com.espressionist_ecommerce.dto.ProductDTO;
import com.espressionist_ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Purpose: Handles admin API requests for managing products, including CRUD operations,
 * archiving, restoring, and listing all products (including archived).
 */
@RestController
@RequestMapping("/admin/api/products")
@RequiredArgsConstructor
// This class is responsible for handling admin-related product operations
// such as creating, updating, archiving, restoring, and listing products.
public class AdminProductController {
    private final ProductService productService;
    // Endpoint to get all active products
    @GetMapping("/all")
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    // Endpoint to get a specific product by ID
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(productDTO);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }
    @PutMapping("/{id}") // Endpoint to update a product
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }
    @PostMapping("/{id}/archive") // Endpoint to archive a product
    public ResponseEntity<ProductDTO> archiveProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.archiveProduct(id));
    }
    @PostMapping("/{id}/restore")   // Endpoint to restore an archived product
    public ResponseEntity<ProductDTO> restoreProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.restoreProduct(id));
    }
}
