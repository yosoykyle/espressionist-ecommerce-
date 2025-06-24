package com.espressionist_ecommerce.exception;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import java.util.HashMap;
import java.util.Map;

/**
 * Purpose: Global exception handler for the application, handling validation errors,
 * optimistic locking failures, and generic runtime exceptions.
 * This class uses Spring's @ControllerAdvice to handle exceptions globally across all controllers.
 * It provides specific responses for validation errors, optimistic locking conflicts, and generic runtime exceptions.
 */
@ControllerAdvice
// This annotation allows this class to handle exceptions across all controllers in the application
// It centralizes exception handling, making it easier to manage and maintain error responses
public class GlobalExceptionHandler {
    // Handles validation errors for request bodies
    // This method captures validation errors thrown by Spring when request bodies do not meet validation constraints
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
    // Handles optimistic locking failures
    // This method captures exceptions related to optimistic locking, which occur when multiple transactions try to update
    @ExceptionHandler(org.springframework.orm.ObjectOptimisticLockingFailureException.class)
    @ResponseStatus(HttpStatus.CONFLICT) // 409 Conflict
    public ResponseEntity<Map<String, String>> handleOptimisticLockException(
            org.springframework.orm.ObjectOptimisticLockingFailureException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Conflict");
        body.put("message", "There was a conflict while processing your request, likely due to item stock changing. Please try again.");
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }
    // Catch-all for other RuntimeExceptions - consider making more specific handlers
    // This is a basic example and might hide more specific issues if not careful
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR) // 500
    public ResponseEntity<Map<String, String>> handleGenericRuntimeException(RuntimeException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Internal Server Error");
        body.put("message", "An unexpected error occurred: " + ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
