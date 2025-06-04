package com.espressionist_ecommerce.service;

import com.espressionist_ecommerce.dto.CartItemDTO;
import com.espressionist_ecommerce.model.Product;
import com.espressionist_ecommerce.repository.ProductRepository;
import com.espressionist_ecommerce.exception.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    
    private static final String CART_SESSION_KEY = "cartItems";
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<CartItemDTO> getCartItems(HttpSession session) {
        @SuppressWarnings("unchecked")
        List<CartItemDTO> cartItems = (List<CartItemDTO>) session.getAttribute(CART_SESSION_KEY);
        return cartItems != null ? cartItems : new ArrayList<>();
    }
    
    public void addToCart(CartItemDTO cartItem, HttpSession session) {
        Product product = productRepository.findById(cartItem.getProductId())
            .orElseThrow(() -> new BusinessException("Product not found"));
            
        if (product.getQuantity() < cartItem.getQuantity()) {
            throw new BusinessException("Not enough stock available");
        }
        
        List<CartItemDTO> cartItems = getCartItems(session);
        Optional<CartItemDTO> existingItem = cartItems.stream()
            .filter(item -> item.getProductId().equals(cartItem.getProductId()))
            .findFirst();
            
        if (existingItem.isPresent()) {
            CartItemDTO item = existingItem.get();
            item.setQuantity(item.getQuantity() + cartItem.getQuantity());
        } else {
            cartItem.setProductName(product.getName());
            cartItem.setPrice(product.getPrice());
            cartItems.add(cartItem);
        }
        
        session.setAttribute(CART_SESSION_KEY, cartItems);
    }
    
    public void updateCartItem(CartItemDTO cartItem, HttpSession session) {
        List<CartItemDTO> cartItems = getCartItems(session);
        cartItems.stream()
            .filter(item -> item.getProductId().equals(cartItem.getProductId()))
            .findFirst()
            .ifPresentOrElse(
                item -> item.setQuantity(cartItem.getQuantity()),
                () -> { throw new BusinessException("Item not found in cart"); }
            );
        session.setAttribute(CART_SESSION_KEY, cartItems);
    }
    
    public void removeFromCart(Long productId, HttpSession session) {
        List<CartItemDTO> cartItems = getCartItems(session);
        cartItems.removeIf(item -> item.getProductId().equals(productId));
        session.setAttribute(CART_SESSION_KEY, cartItems);
    }
    
    public void clearCart(HttpSession session) {
        session.removeAttribute(CART_SESSION_KEY);
    }
}
