package com.espressionist_ecommerce.model;

public enum ProductCategory {
    COFFEE_AND_TEA("Coffee & Tea"),
    ART_AND_MERCH("Art & Merch"),
    GIFT_SET("Gift Set"),
    VOUCHER("Voucher");

    private final String displayName;

    ProductCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static ProductCategory fromString(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("Category cannot be empty");
        }

        // First try exact match with enum name
        try {
            return ProductCategory.valueOf(category.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException ignored) {
            // If not found, try matching display name
            for (ProductCategory pc : values()) {
                if (pc.getDisplayName().equalsIgnoreCase(category.trim())) {
                    return pc;
                }
            }
        }
        throw new IllegalArgumentException("Invalid product category: " + category);
    }

    @Override
    public String toString() {
        return displayName;
    }
}