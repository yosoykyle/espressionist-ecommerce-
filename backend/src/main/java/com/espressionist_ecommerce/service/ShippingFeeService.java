package com.espressionist_ecommerce.service;

import com.espressionist_ecommerce.entity.ShippingFee;
import java.util.List;
import java.util.Optional;

public interface ShippingFeeService {
    List<ShippingFee> getAllShippingFees();
    Optional<ShippingFee> getShippingFeeByCategory(String category);
    ShippingFee saveOrUpdateShippingFee(ShippingFee shippingFee);
    void deleteShippingFee(String category);
}
