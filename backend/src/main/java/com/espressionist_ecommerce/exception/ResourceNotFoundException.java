package com.espressionist_ecommerce.exception;
/**
 * Purpose: Custom exception to indicate that a requested resource was not found.
 * This exception can be thrown when an entity is not found in the database or when a resource is not available.
 * It extends RuntimeException, allowing it to be used without mandatory try-catch blocks.
 */
public class ResourceNotFoundException extends RuntimeException {
    // Serial version UID for serialization compatibility
    public ResourceNotFoundException() {
        super();
    }
    // Constructor with a custom message
    public ResourceNotFoundException(String message) {
        super(message);
    }
    // Constructor with a custom message and a cause
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }  
    // Constructor with a cause
    public ResourceNotFoundException(Throwable cause) {
        super(cause);
    }
}
