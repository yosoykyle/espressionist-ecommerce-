package com.espressionist_ecommerce.controller.page;

import com.espressionist_ecommerce.model.Order;
import com.espressionist_ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

@Controller
@RequestMapping("/order-status")
public class OrderStatusPageController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/{orderCode}")
    public String orderStatusPage(@PathVariable String orderCode, Model model) {
        Optional<Order> order = orderService.getOrderByOrderCode(orderCode);
        if (order.isPresent()) {
            model.addAttribute("order", order.get());
            return "order-status";
        } else {
            model.addAttribute("error", "Order not found");
            return "error";
        }
    }

    @GetMapping("")
    public String orderStatusSearchPage() {
        return "order-status-search";
    }
}
