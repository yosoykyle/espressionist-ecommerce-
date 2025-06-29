package com.espressionist_ecommerce.service;
import com.espressionist_ecommerce.dto.ProductDTO;
import java.util.List;
// Purpose: Service interface for managing product operations, including CRUD, archiving, restoring, and image uploads.
public interface ProductService {
    List<ProductDTO> getAllActiveProducts(); // Retrieves all active (non-archived) products as a list of ProductDTOs
    ProductDTO getProductById(Long id); // Retrieves a product by its ID
    ProductDTO createProduct(ProductDTO productDTO); // Creates a new product
    ProductDTO updateProduct(Long id, ProductDTO productDTO); // Updates an existing product
    ProductDTO archiveProduct(Long id); // Archives a product
    ProductDTO restoreProduct(Long id); // Restores an archived product
    List<ProductDTO> getAllProducts(); // includes archived
    ProductDTO uploadProductImage(Long productId, org.springframework.web.multipart.MultipartFile file); // Uploads a product image, saves it to the filesystem, and updates the product entity
}
