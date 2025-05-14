```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/cart")
public class CartPageController {
    @GetMapping("")
    public String cartPage() {
        return "cart";
    }
}

@Controller
@RequestMapping("/checkout")
public class CheckoutPageController {
    @GetMapping("")
    public String checkoutPage() {
        return "checkout";
    }
}

@Controller
@RequestMapping("/order-status")
public class OrderStatusPageController {
    @GetMapping("")
    public String orderStatusPage() {
        return "order-status";
    }
}

@Controller
@RequestMapping("/")
public class HomePageController {
    @GetMapping("")
    public String homePage() {
        return "index";
    }
}

@Controller
@RequestMapping("/admin/login")
public class AdminLoginPageController {
    @GetMapping("")
    public String adminLoginPage() {
        return "admin-login";
    }
}

@Controller
@RequestMapping("/admin/dashboard")
public class AdminDashboardPageController {
    @GetMapping("")
    public String adminDashboardPage() {
        return "admin-dashboard";
    }
}

@Controller
@RequestMapping("/admin/products")
public class AdminProductsPageController {
    @GetMapping("")
    public String adminProductsPage() {
        return "admin-products";
    }
}

@Controller
@RequestMapping("/admin/orders")
public class AdminOrdersPageController {
    @GetMapping("")
    public String adminOrdersPage() {
        return "admin-orders";
    }
}

@Controller
@RequestMapping("/admin/users")
public class AdminUsersPageController {
    @GetMapping("")
    public String adminUsersPage() {
        return "admin-users";
    }
}
```