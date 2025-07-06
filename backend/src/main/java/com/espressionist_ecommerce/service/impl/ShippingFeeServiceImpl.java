package com.espressionist_ecommerce.service.impl;

import com.espressionist_ecommerce.entity.ShippingFee;
import com.espressionist_ecommerce.repository.ShippingFeeRepository;
import com.espressionist_ecommerce.service.ShippingFeeService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ShippingFeeServiceImpl implements ShippingFeeService {
    private final ShippingFeeRepository shippingFeeRepository;

    public ShippingFeeServiceImpl(ShippingFeeRepository shippingFeeRepository) {
        this.shippingFeeRepository = shippingFeeRepository;
    }

    @Override
    public List<ShippingFee> getAllShippingFees() {
        return shippingFeeRepository.findAll();
    }

    @Override
    public Optional<ShippingFee> getShippingFeeByCategory(String category) {
        return Optional.ofNullable(shippingFeeRepository.findByCategory(category));
    }

    @Override
    public ShippingFee saveOrUpdateShippingFee(ShippingFee shippingFee) {
        if (shippingFee.getBaseFee() == null || shippingFee.getBaseFee().compareTo(BigDecimal.ZERO) < 0 ||
            shippingFee.getAdditionalFee() == null || shippingFee.getAdditionalFee().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Shipping base fee and additional fee must not be negative");
        }
        return shippingFeeRepository.save(shippingFee);
    }

    @Override
    public void deleteShippingFee(String category) {
        shippingFeeRepository.deleteById(category);
    }
}
