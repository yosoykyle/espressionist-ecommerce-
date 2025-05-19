package com.espressionist_ecommerce.controller.page;

import com.espressionist_ecommerce.service.AdminService;
import com.espressionist_ecommerce.service.OrderService;
import com.espressionist_ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPageController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @GetMapping("/login")
    public String login() {
        return "admin/login";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        // Add dashboard data
        model.addAttribute("totalOrders", orderService.getActiveOrderCount());
        model.addAttribute("totalProducts", productService.getActiveProductCount());
        model.addAttribute("recentOrders", orderService.getRecentOrders());
        model.addAttribute("lowStockProducts", productService.getLowStockProducts());
        return "admin/dashboard";
    }

    @GetMapping("/products")
    public String products(Model model) {
        model.addAttribute("products", productService.getAllActiveProducts());
        return "admin/products";
    }

    @GetMapping("/orders")
    public String orders(Model model) {
        model.addAttribute("orders", orderService.getAllOrders());
        return "admin/orders";
    }

    @GetMapping("/admins")
    public String admins(Model model) {
        model.addAttribute("admins", adminService.getAllAdmins());
        return "admin/admins";
    }
}