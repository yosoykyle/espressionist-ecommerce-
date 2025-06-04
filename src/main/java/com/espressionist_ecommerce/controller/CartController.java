package com.espressionist_ecommerce.controller;

import com.espressionist_ecommerce.dto.CartItemDTO;
import com.espressionist_ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCartItems(HttpSession session) {
        return ResponseEntity.ok(cartService.getCartItems(session));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @Valid @RequestBody CartItemDTO cartItem,
            HttpSession session) {
        cartService.addToCart(cartItem, session);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(
            @Valid @RequestBody CartItemDTO cartItem,
            HttpSession session) {
        cartService.updateCartItem(cartItem, session);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Long productId,
            HttpSession session) {
        cartService.removeFromCart(productId, session);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/clear")
    public ResponseEntity<?> clearCart(HttpSession session) {
        cartService.clearCart(session);
        return ResponseEntity.noContent().build();
    }
}
