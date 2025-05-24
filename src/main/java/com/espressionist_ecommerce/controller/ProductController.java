package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.model.Product;
import com.espressionist_ecommerce.service.ProductService;
import com.espressionist_ecommerce.dto.ProductDTO;
// import com.espressionist_ecommerce.exception.BusinessException; // Already handled by GlobalExceptionHandler
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders; // Added import
import org.springframework.http.HttpStatus; // Added import
import org.springframework.http.MediaType; // Added import
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.validation.Valid;

import java.io.IOException;
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
        // Removed try-catch for BusinessException and Exception
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        product.setQuantity(productDTO.getQuantity());
        product.setCategory(productDTO.getCategory());
        
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO productDTO) {
        // Removed try-catch for BusinessException and RuntimeException
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        product.setQuantity(productDTO.getQuantity());
        product.setCategory(productDTO.getCategory());
        
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> archiveProduct(@PathVariable Long id) {
        // Removed try-catch for BusinessException
        productService.archiveProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long id) {
        return productService.getProductById(id) // Using existing getProductById as it fetches the Product entity
            .map(product -> {
                if (product.getImage() != null && product.getImageType() != null) {
                    HttpHeaders headers = new HttpHeaders();
                    try {
                        headers.setContentType(MediaType.parseMediaType(product.getImageType()));
                    } catch (Exception e) {
                        // Fallback if imageType is invalid or not parseable
                        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                        logger.warn("Could not parse media type {} for product image id {}. Falling back to OCTET_STREAM.", product.getImageType(), id, e);
                    }
                    // Optional: Add Content-Disposition if you want to suggest a filename
                    // headers.setContentDisposition(ContentDisposition.inline().filename("product-" + id + "." + extractExtension(product.getImageType())).build());
                    return new ResponseEntity<>(product.getImage(), headers, HttpStatus.OK);
                }
                return ResponseEntity.notFound().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // Optional helper method (not implementing Content-Disposition for now as it's optional)
    /*
    private String extractExtension(String contentType) {
        if (contentType == null) return "bin"; // Default extension
        return switch (contentType.toLowerCase()) {
            case "image/jpeg": yield "jpg";
            case "image/png": yield "png";
            case "image/gif": yield "gif";
            default: yield "bin";
        };
    }
    */

    @PostMapping("/{id}/image")
    public ResponseEntity<?> uploadProductImage(@PathVariable Long id, @RequestParam("imageFile") MultipartFile imageFile) throws java.io.IOException {
        productService.uploadImage(id, imageFile);
        return ResponseEntity.ok().build();
    }
}