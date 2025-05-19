package com.espressionist_ecommerce.model;

public enum ProductCategory {
    COFFEE_AND_TEA,
    ART_AND_MERCH,
    GIFT_SET,
    VOUCHER,
    ALL;

    public static ProductCategory fromString(String category) {
        try {
            return ProductCategory.valueOf(category.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            return ALL;
        }
    }
}