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
}