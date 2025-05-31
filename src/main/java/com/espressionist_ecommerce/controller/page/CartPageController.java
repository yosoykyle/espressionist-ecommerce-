package com.espressionist_ecommerce.controller.page;

import com.espressionist_ecommerce.dto.CartItemDTO;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/cart")
public class CartPageController {
    @GetMapping("")
    public String cartPage(Model model, HttpSession session) {
        List<CartItemDTO> cartItems = (List<CartItemDTO>) session.getAttribute("cartItems");
        if (cartItems == null) {
            cartItems = new ArrayList<>();
        }
        double cartTotal = cartItems.stream().mapToDouble(CartItemDTO::getTotalPrice).sum();
        model.addAttribute("cartItems", cartItems);
        model.addAttribute("cartTotal", cartTotal);
        return "cart";
    }
}
