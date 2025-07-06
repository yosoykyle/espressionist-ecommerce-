package com.espressionist_ecommerce.config;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.espressionist_ecommerce.security.JwtRequestFilter;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor

/**
 * Purpose: Configures security settings for the application, including JWT authentication, CORS, and endpoint access control.
 * This class sets up the security filter chain, defines public and protected endpoints, and integrates JWT authentication.
 * In simple terms, this class is used to secure the application by defining which endpoints are accessible without authentication
 * and which require a valid JWT token for access. It also configures how user authentication is performed. 
 */
public class SecurityConfig {
    // Injecting JwtRequestFilter and UserDetailsService to handle JWT authentication and user details
    private final JwtRequestFilter jwtRequestFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    /**
     * Password encoder bean for encoding passwords using BCrypt.
     * This is used to securely store user passwords in the database.
     */
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    /**
     * Authentication manager bean for managing authentication processes.
     * This configures the user details service and password encoder for authentication.
     */
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder builder = http.getSharedObject(AuthenticationManagerBuilder.class);
        builder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
        return builder.build();
    }

    @Bean
    /**
     * Security filter chain bean that configures HTTP security settings.
     * This method sets up CORS, CSRF protection, endpoint access control, and session management.
     * In simple terms, this method defines how the application handles security for incoming requests. 
     */
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(withDefaults()) // Enable CORS using withDefaults()
            .csrf(csrf -> csrf.disable())  // Disable CSRF for API endpoints
            .authorizeHttpRequests(authorize -> authorize
                // Public endpoints (permitAll)
                .requestMatchers(
                    "/admin/login", "/admin/logout",
                    "/api/products", "/api/products/**", "/api/products/*/image",
                    "/api/checkout", "/api/checkout/**",
                    "/api/order-status/*",
                    "/uploads/**",
                    // Allow public GET access to shipping fees
                    "/api/shipping-fees"
                ).permitAll()
                // Admin-only endpoints (authenticated)
                .requestMatchers("/admin/**", "/admin/api/**").authenticated().anyRequest().authenticated() // Require authentication for all other requests
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
