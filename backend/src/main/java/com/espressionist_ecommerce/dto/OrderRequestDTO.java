package com.espressionist_ecommerce.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDTO {
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerAddress;
    private String customerCity;
    private String customerPostalCode;
    private String customerNotes;
    private List<OrderItemDTO> items;
}
