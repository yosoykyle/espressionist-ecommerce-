package com.espressionist_ecommerce.controller.page;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/login")
public class AdminLoginPageController {
    @GetMapping("")
    public String adminLoginPage() {
        return "admin-login";
    }
}
