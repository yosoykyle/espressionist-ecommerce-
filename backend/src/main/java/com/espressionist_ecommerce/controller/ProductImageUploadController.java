package com.espressionist_ecommerce.controller;
import com.espressionist_ecommerce.dto.ProductDTO;
import com.espressionist_ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin/api/products")
@RequiredArgsConstructor

/**
 * Purpose: Handles product image upload requests for admin users.
 * This controller provides an endpoint to upload images for products.
 */
public class ProductImageUploadController {
    // Injecting ProductService to handle business logic related to products
    private final ProductService productService;
    // Endpoint to upload an image for a product
    // This endpoint allows admin users to upload an image for a specific product identified by its ID
    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadProductImage(@RequestParam Long productId, @RequestParam("file") MultipartFile file) {
        try {
            // Validate the product ID and file
            ProductDTO updatedProduct = productService.uploadProductImage(productId, file);
            // If the upload is successful, return the updated product details
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            // Log the error and return a detailed message
            e.printStackTrace();
            return ResponseEntity.status(500).body("Image upload failed: " + e.getMessage());
        }
    }
}
