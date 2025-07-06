package com.espressionist_ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "shipping_fees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingFee {
    // Store category as label (e.g., "Art & Merch")
    @Id
    @Column(nullable = false, unique = true)
    private String category; // e.g., "Art & Merch", "Coffee & Tea", etc.

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal baseFee;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal additionalFee;
}
