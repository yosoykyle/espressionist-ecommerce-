package com.espressionist_ecommerce.service;

import com.espressionist_ecommerce.model.Product;
import com.espressionist_ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllActiveProducts() {
        List<Product> products = productRepository.findByArchivedFalse();
        logger.info("Products fetched from repository: {}", products);
        return products;
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setPrice(updatedProduct.getPrice());
            product.setQuantity(updatedProduct.getQuantity());
            product.setCategory(updatedProduct.getCategory());
            product.setImage(updatedProduct.getImage());
            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public void archiveProduct(Long id) {
        productRepository.findById(id).ifPresent(product -> {
            product.setArchived(true);
            productRepository.save(product);
        });
    }

    public void uploadImage(Long id, MultipartFile image) throws IOException {
        productRepository.findById(id).ifPresent(product -> {
            try {
                product.setImage(image.getBytes());
                productRepository.save(product);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image", e);
            }
        });
    }

    public byte[] getImageById(Long id) {
        return productRepository.findById(id)
            .map(Product::getImage)
            .orElse(null);
    }

    public List<Product> getFeaturedProducts() {
        return getAllActiveProducts().stream()
            .limit(4)  // Return top 4 products
            .toList();
    }

    public List<Product> getProductsByCategory(ProductCategory category) {
        return getAllActiveProducts().stream()
            .filter(p -> category.equals(ProductCategory.fromString(p.getCategory())))
            .toList();
    }

    public List<Product> searchProducts(String query) {
        String searchTerm = query.toLowerCase();
        return getAllActiveProducts().stream()
            .filter(p -> p.getName().toLowerCase().contains(searchTerm) ||
                        p.getCategory().toLowerCase().contains(searchTerm))
            .toList();
    }

    public List<Product> getLowStockProducts() {
        return getAllActiveProducts().stream()
            .filter(p -> p.getQuantity() < 5)  // Products with less than 5 items
            .toList();
    }

    public long getActiveProductCount() {
        return productRepository.findByArchivedFalse().size();
    }

    public boolean hasEnoughStock(Long productId, int requestedQuantity) {
        return productRepository.findById(productId)
            .map(p -> p.getQuantity() >= requestedQuantity)
            .orElse(false);
    }

    @Transactional
    public void updateStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            
        int newQuantity = product.getQuantity() + quantity;
        if (newQuantity < 0) {
            throw new BusinessException("Cannot reduce stock below 0");
        }
        
        product.setQuantity(newQuantity);
        productRepository.save(product);
    }
    
    @Transactional
    public void reduceStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            
        if (product.getQuantity() < quantity) {
            throw new BusinessException("Insufficient stock for product: " + product.getName());
        }
        
        product.setQuantity(product.getQuantity() - quantity);
        productRepository.save(product);
    }
    
    public boolean checkStockAvailability(Long productId, int requestedQuantity) {
        return productRepository.findById(productId)
            .map(product -> !product.isArchived() && product.getQuantity() >= requestedQuantity)
            .orElse(false);
    }
    
    private void validateProduct(Product product) {
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new BusinessException("Product name is required");
        }
        if (product.getPrice() <= 0) {
            throw new BusinessException("Price must be greater than 0");
        }
        if (product.getQuantity() < 0) {
            throw new BusinessException("Quantity cannot be negative");
        }
        if (product.getCategory() == null) {
            throw new BusinessException("Category is required");
        }
    }
}