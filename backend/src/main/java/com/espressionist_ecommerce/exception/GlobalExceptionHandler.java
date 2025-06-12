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

@ControllerAdvice
public class GlobalExceptionHandler {

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

    // Consider adding more specific exception handlers here as they are defined,
    // e.g., for ResourceNotFoundException, InvalidPasswordException, etc.
    // For example:
    // @ExceptionHandler(ResourceNotFoundException.class)
    // @ResponseStatus(HttpStatus.NOT_FOUND)
    // public ResponseEntity<Map<String, String>> handleResourceNotFoundException(
    //         ResourceNotFoundException ex) {
    //     Map<String, String> error = new HashMap<>();
    //     error.put("error", ex.getMessage());
    //     return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    // }

    // Handles optimistic locking failures (e.g., when stock changes during order placement)
    // Specific exception may vary (ObjectOptimisticLockingFailureException, StaleObjectStateException, or broader DataIntegrityViolationException)
    // For this example, using ObjectOptimisticLockingFailureException, common with Spring Data JPA.
    @ExceptionHandler(org.springframework.orm.ObjectOptimisticLockingFailureException.class)
    @ResponseStatus(HttpStatus.CONFLICT) // 409 Conflict
    public ResponseEntity<Map<String, String>> handleOptimisticLockException(
            org.springframework.orm.ObjectOptimisticLockingFailureException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Conflict");
        body.put("message", "There was a conflict while processing your request, likely due to item stock changing. Please try again.");
        // It's good practice to log the actual exception for server-side analysis
        // logger.error("Optimistic locking failure: ", ex); // Assuming a logger is set up
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
        // logger.error("Unexpected runtime exception: ", ex); // Assuming a logger is set up
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
