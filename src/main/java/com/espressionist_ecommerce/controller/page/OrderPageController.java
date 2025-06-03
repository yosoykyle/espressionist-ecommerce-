package com.espressionist_ecommerce.controller.page;

import com.espressionist_ecommerce.dto.CartItemDTO;
import com.espressionist_ecommerce.dto.CheckoutFormDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/order")
public class OrderPageController {

    @GetMapping("/checkout")
    public String checkout(Model model, HttpSession session) {
        @SuppressWarnings("unchecked")
        List<CartItemDTO> cartItems = (List<CartItemDTO>) session.getAttribute("cartItems");
        if (cartItems == null || cartItems.isEmpty()) {
            return "redirect:/cart";
        }

        double total = calculateTotal(cartItems);
        double vat = calculateVAT(total);
        double totalWithVAT = total + vat;

        model.addAttribute("cartItems", cartItems);
        model.addAttribute("total", total);
        model.addAttribute("vat", vat);
        model.addAttribute("totalWithVAT", totalWithVAT);
        model.addAttribute("checkoutForm", new CheckoutFormDTO());
        
        return "checkout";
    }

    private double calculateTotal(List<CartItemDTO> cartItems) {
        return cartItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    private double calculateVAT(double total) {
        return total * 0.12; // 12% VAT
    }
}