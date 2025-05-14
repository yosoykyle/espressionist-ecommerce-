package com.espressionist_ecommerce.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/order-status")
public class OrderStatusPageController {
    @GetMapping("")
    public String orderStatusPage() {
        return "order-status";
    }
}
