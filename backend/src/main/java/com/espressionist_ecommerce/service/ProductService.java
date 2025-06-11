package com.espressionist_ecommerce.service;

import com.espressionist_ecommerce.dto.ProductDTO;
import java.util.List;

public interface ProductService {
    List<ProductDTO> getAllActiveProducts();
    ProductDTO getProductById(Long id);
    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO updateProduct(Long id, ProductDTO productDTO);
    ProductDTO archiveProduct(Long id);
    ProductDTO restoreProduct(Long id);
    List<ProductDTO> getAllProducts(); // includes archived
    ProductDTO uploadProductImage(Long productId, org.springframework.web.multipart.MultipartFile file);
}
