package com.espressionist_ecommerce.service;

import com.espressionist_ecommerce.exception.BusinessException;
import com.espressionist_ecommerce.exception.ResourceNotFoundException;
import com.espressionist_ecommerce.model.Product;
import com.espressionist_ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllActiveProducts() {
        return productRepository.findByArchivedFalse();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    public Product createProduct(Product product) {
        validateProduct(product);
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        validateProduct(updatedProduct);
        
        return productRepository.findById(id)
            .map(product -> {
                product.setName(updatedProduct.getName());
                product.setPrice(updatedProduct.getPrice());
                product.setQuantity(updatedProduct.getQuantity());
                product.setCategory(updatedProduct.getCategory());
                if (updatedProduct.getImage() != null) {
                    product.setImage(updatedProduct.getImage());
                }
                return productRepository.save(product);
            })
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    public void archiveProduct(Long id) {
        Product product = getProductById(id);
        product.setArchived(true);
        productRepository.save(product);
    }

    public void uploadImage(Long id, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new BusinessException("File is empty");
        }
        
        Product product = getProductById(id);
        product.setImage(file.getBytes());
        productRepository.save(product);
    }

    public void reduceStock(Long productId, int quantity) {
        Product product = getProductById(productId);
        if (product.getQuantity() < quantity) {
            throw new BusinessException("Insufficient stock");
        }
        product.setQuantity(product.getQuantity() - quantity);
        productRepository.save(product);
    }

    public boolean checkStockAvailability(Long productId, int quantity) {
        Product product = getProductById(productId);
        return !product.isArchived() && product.getQuantity() >= quantity;
    }

    private void validateProduct(Product product) {
        if (product.getPrice() <= 0) {
            throw new BusinessException("Price must be greater than 0");
        }
        if (product.getQuantity() < 0) {
            throw new BusinessException("Quantity cannot be negative");
        }
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new BusinessException("Name is required");
        }
    }
}