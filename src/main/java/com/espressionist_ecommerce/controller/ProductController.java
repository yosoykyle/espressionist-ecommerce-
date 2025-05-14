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

    @PostMapping("/upload-image/{id}")
    public ResponseEntity<Void> uploadProductImage(@PathVariable Long id, @RequestParam("image") MultipartFile image) {
        try {
            productService.uploadImage(id, image);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
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