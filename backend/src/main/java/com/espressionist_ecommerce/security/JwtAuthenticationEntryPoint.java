package com.espressionist_ecommerce.security;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Purpose: Handles unauthorized access attempts by sending a 401 Unauthorized response.
 * This is used when a user tries to access a protected resource without valid authentication.
 * In simple terms, this class is used to intercept requests that do not have valid authentication tokens
 * and respond with a 401 Unauthorized error. It ensures that users cannot access protected resources.
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }
}
