package com.espressionist_ecommerce.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders; // Added import
import org.springframework.http.HttpStatus; // Added import
import org.springframework.http.MediaType; // Added import
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.espressionist_ecommerce.dto.ProductDTO;
import com.espressionist_ecommerce.model.Product;
import com.espressionist_ecommerce.service.ProductService;

import jakarta.validation.Valid;

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
        if (productDTO.getPrice() == null || productDTO.getPrice() <= 0) {
            return ResponseEntity.badRequest().body("Price must be greater than 0");
        }
        if (productDTO.getQuantity() == null || productDTO.getQuantity() < 1) {
            return ResponseEntity.badRequest().body("Quantity must be at least 1");
        }
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
        productService.archiveProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long id) {
        Product product = productService.getProductById(id); // Fetch the Product entity directly
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
}