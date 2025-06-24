package com.espressionist_ecommerce.controller;

/**
 * Purpose: Handles admin product image upload requests and delegates to ProductService.
 */

import com.espressionist_ecommerce.dto.ProductDTO;
import com.espressionist_ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin/api/products")
@RequiredArgsConstructor
public class ProductImageUploadController {
    private final ProductService productService;

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadProductImage(@RequestParam Long productId, @RequestParam("file") MultipartFile file) {
        try {
            ProductDTO updatedProduct = productService.uploadProductImage(productId, file);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            // Log the error and return a detailed message
            e.printStackTrace();
            return ResponseEntity.status(500).body("Image upload failed: " + e.getMessage());
        }
    }
}
