package com.espressionist_ecommerce.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Ensure this import is added
import org.springframework.web.multipart.MultipartFile;

import com.espressionist_ecommerce.exception.BusinessException;
import com.espressionist_ecommerce.exception.ResourceNotFoundException;
import com.espressionist_ecommerce.model.Product;
import com.espressionist_ecommerce.model.ProductCategory;
import com.espressionist_ecommerce.repository.ProductRepository; // Added for new method

@Service
@Transactional
public class ProductService {

    // Add logger for educational purposes
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<Product> getAllActiveProducts() {
        logger.info("Fetching all active products");
        return productRepository.findByArchivedFalse();
    }

    @Transactional(readOnly = true)
    public List<Product> getFeaturedProducts() {
        logger.info("Fetching featured products");
        // return productRepository.findByArchivedFalse().stream()
        //    .limit(8)
        //    .collect(Collectors.toList()); // Old logic
        return productRepository.findActiveProducts(PageRequest.of(0, 8)).getContent(); // New logic
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsByCategory(ProductCategory category) {
        return productRepository.findByCategoryAndArchivedFalse(category);
    }

    @Transactional(readOnly = true)
    public List<Product> searchProducts(String search) {
        return productRepository.findByNameContainingIgnoreCaseAndArchivedFalse(search);
    }

    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        logger.info("Fetching product with ID: {}", id);
        return productRepository.findById(id)
            .orElseThrow(() -> {
                logger.error("Product not found with ID: {}", id);
                return new ResourceNotFoundException("Product not found");
            });
    }

    public Product createProduct(Product product) {
        logger.info("Creating new product: {}", product.getName());
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
        product.setImageType(file.getContentType()); // Added line
        product.setImage(file.getBytes());
        productRepository.save(product); // Ensured this is after setting both
    }

    // New method as per instructions (Option A)
    @Transactional(readOnly = true) // Assuming this should also be read-only
    public Optional<Product> getProductWithImageDetails(Long id) {
        // This simply calls the existing findById which should fetch the entire Product entity,
        // including the new imageType field once the transaction commits and session is flushed.
        return productRepository.findById(id);
    }

    public void reduceStock(Long productId, int quantity) {
        Product product = getProductById(productId);
        if (product.getQuantity() < quantity) {
            throw new BusinessException("Insufficient stock");
        }
        product.setQuantity(product.getQuantity() - quantity);
        productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public boolean checkStockAvailability(Long productId, int quantity) {
        Product product = getProductById(productId);
        return !product.isArchived() && product.getQuantity() >= quantity;
    }

    private void validateProduct(Product product) {
        logger.debug("Validating product: {}", product.getName());
        
        if (product.getPrice() <= 0) {
            logger.error("Invalid price: {} for product: {}", product.getPrice(), product.getName());
            throw new BusinessException("Price must be greater than 0");
        }
        if (product.getQuantity() < 1) {
            logger.error("Invalid quantity: {} for product: {}", product.getQuantity(), product.getName());
            throw new BusinessException("Quantity must be at least 1");
        }
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            logger.error("Product name is empty or null");
            throw new BusinessException("Product name is required");
        }
        if (product.getCategory() == null) {
            logger.error("Product category is null for product: {}", product.getName());
            throw new BusinessException("Product category is required");
        }
        
        logger.debug("Product validation successful");
    }
}