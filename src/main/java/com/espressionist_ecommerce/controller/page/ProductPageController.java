package com.espressionist_ecommerce.controller.page;

import com.espressionist_ecommerce.model.Product;
import com.espressionist_ecommerce.model.ProductCategory;
import com.espressionist_ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class ProductPageController {

    @Autowired
    private ProductService productService;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("featuredProducts", productService.getFeaturedProducts());
        return "index";
    }

    @GetMapping("/products")
    public String products(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            Model model) {
        List<Product> products;
        if (category != null && !category.equalsIgnoreCase("ALL")) {
            products = productService.getProductsByCategory(ProductCategory.fromString(category));
        } else if (search != null && !search.trim().isEmpty()) {
            products = productService.searchProducts(search);
        } else {
            products = productService.getAllActiveProducts();
        }
        
        model.addAttribute("products", products);
        model.addAttribute("categories", ProductCategory.values());
        model.addAttribute("selectedCategory", category);
        model.addAttribute("searchTerm", search);
        return "products";
    }
}