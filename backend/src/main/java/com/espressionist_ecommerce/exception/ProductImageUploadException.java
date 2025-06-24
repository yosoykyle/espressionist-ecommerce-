package com.espressionist_ecommerce.exception;
/**
 * Purpose: Custom exception for product image upload failures.
 * Thrown when an error occurs during the upload or saving of a product image.
 */
public class ProductImageUploadException extends RuntimeException {
    public ProductImageUploadException(String message) {
        super(message);
    }
    public ProductImageUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}
