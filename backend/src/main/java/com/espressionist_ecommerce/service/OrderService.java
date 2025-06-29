package com.espressionist_ecommerce.service;
import com.espressionist_ecommerce.dto.OrderDTO;
import com.espressionist_ecommerce.dto.OrderRequestDTO;
import java.util.List;
// Purpose: Service interface for managing orders, including placing, retrieving, updating status, and archiving orders.
public interface OrderService {
    OrderDTO placeOrder(OrderRequestDTO orderRequestDTO); // Places a new order based on the provided OrderRequestDTO and returns the created OrderDTO
    OrderDTO getOrderByCode(String code); // Retrieves an order by its unique code, returning the corresponding OrderDTO
    List<OrderDTO> getAllOrders(); // Retrieves all orders as a list of OrderDTOs
    OrderDTO updateOrderStatus(Long id, String status); // Updates the status of an existing order and returns the updated OrderDTO
    OrderDTO archiveOrder(Long id); // Archives an order by setting its archived status to true
    OrderDTO archiveOrder(Long id, boolean archived); // Archives or restores an order based on the provided archived status
    OrderDTO updateOrderStatusAndArchive(Long id, String status, boolean archived); // Updates the status and archived status of an order
}
