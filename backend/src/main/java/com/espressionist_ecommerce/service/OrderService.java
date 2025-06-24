package com.espressionist_ecommerce.service;
import com.espressionist_ecommerce.dto.OrderDTO;
import com.espressionist_ecommerce.dto.OrderRequestDTO;
import java.util.List;
// Purpose: Service interface for managing orders, including placing, retrieving, updating status, and archiving orders.
public interface OrderService {
    OrderDTO placeOrder(OrderRequestDTO orderRequestDTO);
    OrderDTO getOrderByCode(String code);
    List<OrderDTO> getAllOrders();
    OrderDTO updateOrderStatus(Long id, String status);
    OrderDTO archiveOrder(Long id);
    OrderDTO archiveOrder(Long id, boolean archived);
    OrderDTO updateOrderStatusAndArchive(Long id, String status, boolean archived);
}
