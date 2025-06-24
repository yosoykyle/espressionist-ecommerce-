package com.espressionist_ecommerce.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Purpose: Data Transfer Object for order data exchanged between backend and frontend.
 */
@Data
// This class is used to transfer order data between layers of the application, such as from the server to the client.
// It encapsulates all the necessary information about an order, including its ID, code, status, date, customer details, and financial information.
public class OrderDTO {
    private Long id;
    private String code;
    private String status;
    private LocalDateTime date;
    private CustomerDTO customer;
    private BigDecimal subtotal;
    private BigDecimal vat;
    private BigDecimal total;
    private Boolean archived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderItemDTO> items;
}
