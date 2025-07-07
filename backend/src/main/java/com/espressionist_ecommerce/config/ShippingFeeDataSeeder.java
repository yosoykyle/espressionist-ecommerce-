package com.espressionist_ecommerce.config;

import com.espressionist_ecommerce.entity.ShippingFee;
import com.espressionist_ecommerce.repository.ShippingFeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

/**
 * Purpose: Seeds or updates the database with default shipping fee records for all product categories.
 * This ensures that the required shipping fee configuration is always present and up to date.
 */
@Component
public class ShippingFeeDataSeeder implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(ShippingFeeDataSeeder.class);
    private final ShippingFeeRepository shippingFeeRepository;

    public ShippingFeeDataSeeder(ShippingFeeRepository shippingFeeRepository) {
        this.shippingFeeRepository = shippingFeeRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        logger.info("ShippingFeeDataSeeder running...");
        upsert("Coffee & Tea", new BigDecimal("10.00"), new BigDecimal("2.00"));
        upsert("Art & Merch", new BigDecimal("15.00"), new BigDecimal("3.00"));
        upsert("Gift Set", new BigDecimal("20.00"), new BigDecimal("5.00"));
        upsert("Gear", new BigDecimal("12.00"), new BigDecimal("2.50"));
    }

    private void upsert(String category, BigDecimal baseFee, BigDecimal additionalFee) {
        ShippingFee fee = shippingFeeRepository.findByCategory(category);
        if (fee == null) {
            fee = new ShippingFee();
            fee.setCategory(category);
            fee.setBaseFee(baseFee);
            fee.setAdditionalFee(additionalFee);
            shippingFeeRepository.save(fee);
            logger.info("Created shipping fee for category: {}", category);
        } else {
            logger.info("Shipping fee for category '{}' already exists. Skipping update.", category);
        }
    }
}
