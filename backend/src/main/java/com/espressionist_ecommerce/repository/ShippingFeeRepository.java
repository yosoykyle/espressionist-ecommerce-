package com.espressionist_ecommerce.repository;

import com.espressionist_ecommerce.entity.ShippingFee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShippingFeeRepository extends JpaRepository<ShippingFee, String> {
    ShippingFee findByCategory(String category);
}
