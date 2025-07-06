package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.entity.ShippingFee;
import com.espressionist_ecommerce.service.ShippingFeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shipping-fees")
public class ShippingFeeController {
    private final ShippingFeeService shippingFeeService;

    public ShippingFeeController(ShippingFeeService shippingFeeService) {
        this.shippingFeeService = shippingFeeService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Map<String, BigDecimal>>> getShippingFees() {
        List<ShippingFee> fees = shippingFeeService.getAllShippingFees();
        Map<String, Map<String, BigDecimal>> result = new HashMap<>();
        for (ShippingFee fee : fees) {
            Map<String, BigDecimal> feeMap = new HashMap<>();
            feeMap.put("baseFee", fee.getBaseFee());
            feeMap.put("additionalFee", fee.getAdditionalFee());
            // Use label as key
            result.put(fee.getCategory(), feeMap);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping
    public ResponseEntity<?> updateShippingFees(@RequestBody Map<String, Map<String, BigDecimal>> newFees) {
        try {
            for (Map.Entry<String, Map<String, BigDecimal>> entry : newFees.entrySet()) {
                String categoryLabel = entry.getKey();
                Map<String, BigDecimal> feeMap = entry.getValue();
                ShippingFee fee = new ShippingFee(
                    categoryLabel,
                    feeMap.getOrDefault("baseFee", BigDecimal.ZERO),
                    feeMap.getOrDefault("additionalFee", BigDecimal.ZERO)
                );
                shippingFeeService.saveOrUpdateShippingFee(fee);
            }
            // Return updated fees using labels as keys
            List<ShippingFee> fees = shippingFeeService.getAllShippingFees();
            Map<String, Map<String, BigDecimal>> result = new HashMap<>();
            for (ShippingFee fee : fees) {
                Map<String, BigDecimal> feeMap = new HashMap<>();
                feeMap.put("baseFee", fee.getBaseFee());
                feeMap.put("additionalFee", fee.getAdditionalFee());
                result.put(fee.getCategory(), feeMap);
            }
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update shipping fees.");
            return ResponseEntity.status(500).body(error);
        }
    }
}
