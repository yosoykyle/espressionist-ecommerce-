package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.model.Product;
import com.espressionist_ecommerce.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllActiveProducts() {
        List<Product> products = productService.getAllActiveProducts();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        try {
            Product product = new Product();
            product.setName(productDTO.getName());
            product.setPrice(productDTO.getPrice());
            product.setQuantity(productDTO.getQuantity());
            product.setCategory(productDTO.getCategory().toString());
            product.setImage(productDTO.getImage());
            
            return ResponseEntity.ok(productService.createProduct(product));
        } catch (Exception e) {
            logger.error("Error creating product", e);
            return ResponseEntity.badRequest().body("Error creating product");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        if (product.getPrice() <= 0) {
            return ResponseEntity.badRequest().body("Price must be greater than 0");
        }
        if (product.getQuantity() < 1) {
            return ResponseEntity.badRequest().body("Quantity must be at least 1");
        }
        try {
            return ResponseEntity.ok(productService.updateProduct(id, product));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> archiveProduct(@PathVariable Long id) {
        productService.archiveProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload-image/{id}")
    public ResponseEntity<?> uploadProductImage(@PathVariable Long id, @RequestParam("image") MultipartFile image) {
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select an image file");
        }
        
        String contentType = image.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body("File must be an image");
        }
        
        try {
            productService.uploadImage(id, image);
            return ResponseEntity.ok().build();
        } catch (BusinessException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error uploading image", e);
            return ResponseEntity.internalServerError().body("Error uploading image");
        }
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long id) {
        byte[] image = productService.getImageById(id);
        if (image != null) {
            return ResponseEntity.ok().header("Content-Type", "image/jpeg").body(image);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}