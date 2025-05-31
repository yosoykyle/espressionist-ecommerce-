package com.espressionist_ecommerce.controller.page;

import com.espressionist_ecommerce.dto.CartItemDTO;
import com.espressionist_ecommerce.dto.OrderCreateDTO;
import com.espressionist_ecommerce.exception.ResourceNotFoundException;
import com.espressionist_ecommerce.model.Order;
import com.espressionist_ecommerce.service.OrderService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@Controller
public class OrderPageController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/checkout")
    public String checkout(Model model, HttpSession session) {
        List<CartItemDTO> cartItems = (List<CartItemDTO>) session.getAttribute("cartItems");
        if (cartItems == null) {
            cartItems = new ArrayList<>();
        }
        double subtotal = cartItems.stream().mapToDouble(CartItemDTO::getTotalPrice).sum();
        double totalWithVat = subtotal * 1.12; // 12% VAT
        model.addAttribute("cartItems", cartItems);
        model.addAttribute("totalWithVat", totalWithVat);
        model.addAttribute("checkoutForm", new OrderCreateDTO());
        return "checkout";
    }

    @GetMapping("/order-success")
    public String orderSuccess(@RequestParam String orderCode, Model model) {
        orderService.getOrderByOrderCode(orderCode).ifPresent(order -> {
            model.addAttribute("order", order);
        });
        return "order-success";
    }

    @GetMapping("/order-status")
    public String orderStatusSearch() {
        return "order-status-search";
    }

    @GetMapping("/order-status/{orderCode}")
    public String orderStatus(@PathVariable String orderCode, Model model) {
        Order order = orderService.getOrderByOrderCode(orderCode)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with code: " + orderCode));
        model.addAttribute("order", order);
        return "order-status";
    }
}