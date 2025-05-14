package com.espressionist_ecommerce.controller.page;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/users")
public class AdminUsersPageController {
    @GetMapping("")
    public String adminUsersPage() {
        return "admin-users";
    }
}
