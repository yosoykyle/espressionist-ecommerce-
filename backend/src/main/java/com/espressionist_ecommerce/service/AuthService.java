package com.espressionist_ecommerce.service;

import com.espressionist_ecommerce.dto.AdminDTO;

public interface AuthService {
    String login(String username, String password);
    void logout(String token);
    AdminDTO getCurrentAdmin();
}
