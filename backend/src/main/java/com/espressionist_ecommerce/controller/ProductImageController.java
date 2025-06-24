package com.espressionist_ecommerce.controller;
import com.espressionist_ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.UrlResource;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor

/**
 * ProductImageController is responsible for handling product image retrieval requests.
 * It provides an endpoint to retrieve product images by product ID.
 */ 
public class ProductImageController {
    // Injecting ProductService to handle business logic related to products
    private final ProductService productService;
    // Base path for product images; adjust as needed based on your file storage structure
    // This path should point to the directory where product images are stored.
    private final String imageBasePath = "uploads/products/"; // Adjust as needed

    /**
     * Retrieves the image of a product by its ID.
     * 
     * @param id The ID of the product whose image is to be retrieved.
     * @return ResponseEntity containing the product image as a Resource, or 404 if not found.
     */
    @GetMapping("/{id}/image")
    public ResponseEntity<Resource> getProductImage(@PathVariable Long id) {
        String imageName = productService.getProductById(id).getImage();
        if (imageName == null) {
            return ResponseEntity.notFound().build();
        }
        // Construct the full path to the image file
        // The image name should be the filename stored in the database for the product.
        try {
            Path imagePath = Paths.get(imageBasePath + imageName);
            Resource resource = new UrlResource(imagePath.toUri());
            // Check if the resource exists and is readable
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }
            // Determine the content type of the image file
            // This uses Files.probeContentType to get the MIME type of the file.
            String contentType = Files.probeContentType(imagePath);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + imageName + "\"")
                    .body(resource);
        // Handle exceptions such as file not found or access issues
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
