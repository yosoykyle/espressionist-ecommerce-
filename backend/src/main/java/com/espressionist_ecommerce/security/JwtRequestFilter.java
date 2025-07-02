package com.espressionist_ecommerce.security;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.util.AntPathMatcher;
import org.springframework.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Purpose: Filters incoming requests to check for JWT authentication.
 * If a valid JWT is found, it sets the authentication in the security context.
 * Public endpoints are excluded from this filter.
 * in simple terms, this class is used to intercept HTTP requests and check if they contain a valid JWT (JSON Web Token).
 * If a valid JWT is present, it extracts the user information from the token and sets the authentication in the security context.
 */
@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    @Autowired
    // JwtTokenUtil is a utility class for handling JWT operations like validation and parsing.
    // It is used to extract the username from the JWT and validate the token.
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    // UserDetailsService is a Spring interface that loads user-specific data.
    // In this case, it is used to load the user details from the database based on the username.
    private UserDetailsService userDetailsService;
    
    // The public endpoints that do not require authentication
    // are defined in the PUBLIC_ENDPOINTS array.
    private static final String[] PUBLIC_ENDPOINTS = {
        "/api/checkout",
        "/api/checkout/**",
        "/api/products",
        "/api/products/**",
        "/api/products/*/image",
        "/api/order-status/*",
        "/uploads/**",
        "/admin/login",
        "/admin/logout"
    };
    
    // AntPathMatcher is used to match the request paths against the defined public endpoints.
    // It allows for flexible pattern matching, such as using wildcards.
    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    @Override
    // This method checks if the request should be filtered or not.
    // If the request path matches any of the public endpoints, it returns true,
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        for (String pattern : PUBLIC_ENDPOINTS) {
            if (pathMatcher.match(pattern, path)) {
                return true;
            }
        }
        return false;
    }
    
    @Override
    // This method is called for every request that needs to be filtered.
    // It checks for the presence of a JWT in the Authorization header, extracts the username from the token, and validates it.
    // If the token is valid, it sets the authentication in the security context.
    // If the request does not contain a valid JWT, it simply continues the filter chain.
    // In simple terms, this method processes the incoming request to check for JWT authentication. 
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain chain)
            throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            username = jwtTokenUtil.getUsernameFromToken(jwt);
        }
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            if (jwtTokenUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        chain.doFilter(request, response);
    }
}
