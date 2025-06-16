package com.espressionist_ecommerce.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.espressionist_ecommerce.dto.ProductDTO;
import com.espressionist_ecommerce.entity.Product;
import com.espressionist_ecommerce.repository.ProductRepository;
import com.espressionist_ecommerce.service.ProductService;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private static final Logger logger = LoggerFactory.getLogger(ProductServiceImpl.class);
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private static final String UPLOAD_DIR = "/workspaces/espressionist-ecommerce-/backend/uploads/products";

    @Override
    public ProductDTO uploadProductImage(Long productId, MultipartFile file) {
        logger.debug("Starting uploadProductImage for productId: {}", productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        try {
            Path staticDir = Paths.get(UPLOAD_DIR);
            if (!Files.exists(staticDir)) {
                Files.createDirectories(staticDir);
            }
            Path filePath = staticDir.resolve(fileName);
            logger.debug("Saving product image to: {}", filePath.toAbsolutePath());
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, filePath, REPLACE_EXISTING);
            }
            product.setImage(fileName);
            productRepository.save(product);
            return modelMapper.map(product, ProductDTO.class);
        } catch (Exception e) {
            logger.error("Failed to upload image for productId {}: {}", productId, e.getMessage(), e);
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        // Return all products, including archived
        return productRepository.findAll().stream()
                .map(product -> {
                    ProductDTO dto = modelMapper.map(product, ProductDTO.class);
                    dto.setArchived(product.isArchived());
                    return dto;
                })
                .toList();
    }

    @Override
    public List<ProductDTO> getAllActiveProducts() {
        return productRepository.findAll().stream()
                .filter(product -> !product.isArchived())
                .map(product -> {
                    ProductDTO dto = modelMapper.map(product, ProductDTO.class);
                    dto.setArchived(product.isArchived());
                    return dto;
                })
                .toList();
    }

    @Override
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return modelMapper.map(product, ProductDTO.class);
    }

    @Override
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = new Product();
        product.setName(productDTO.getName());
        // Convert Double to BigDecimal for entity
        product.setPrice(productDTO.getPrice() != null ? java.math.BigDecimal.valueOf(productDTO.getPrice()) : null);
        product.setCategory(productDTO.getCategory());
        product.setImage(productDTO.getImage());
        product.setStock(productDTO.getStock());
        product.setDescription(productDTO.getDescription());
        product.setArchived(false);
        product = productRepository.save(product);
        // Map back to DTO, converting BigDecimal to Double
        ProductDTO result = new ProductDTO();
        result.setId(product.getId());
        result.setName(product.getName());
        result.setPrice(product.getPrice() != null ? product.getPrice().doubleValue() : null);
        result.setCategory(product.getCategory());
        result.setImage(product.getImage());
        result.setStock(product.getStock());
        result.setDescription(product.getDescription());
        result.setArchived(product.isArchived());
        return result;
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setName(productDTO.getName());
        // Fix: Convert Double to BigDecimal if needed, or use Double consistently
        // Example: If you have new BigDecimal(productDTO.getPrice()), change to productDTO.getPrice() if the entity uses Double
        product.setPrice(productDTO.getPrice() != null ? BigDecimal.valueOf(productDTO.getPrice()) : null);
        product.setCategory(productDTO.getCategory());
        product.setImage(productDTO.getImage());
        product.setStock(productDTO.getStock());
        product.setDescription(productDTO.getDescription());
        product = productRepository.save(product);
        return modelMapper.map(product, ProductDTO.class);
    }

    @Override
    public ProductDTO restoreProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setArchived(false);
        productRepository.save(product);
        return modelMapper.map(product, ProductDTO.class);
    }

    @Override
    public ProductDTO archiveProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setArchived(true);
        productRepository.save(product);
        return modelMapper.map(product, ProductDTO.class);
    }

    // ...implement other ProductService methods or delegate to existing service...
}
