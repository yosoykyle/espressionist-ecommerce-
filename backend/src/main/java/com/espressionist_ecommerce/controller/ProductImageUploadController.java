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
public class ProductImageUploadController {
    private final ProductService productService;

    @PostMapping("/upload-image")
    public ResponseEntity<ProductDTO> uploadProductImage(@RequestParam Long productId, @RequestParam("file") MultipartFile file) {
        ProductDTO updatedProduct = productService.uploadProductImage(productId, file);
        return ResponseEntity.ok(updatedProduct);
    }
}
