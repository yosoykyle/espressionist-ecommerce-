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

/**
 * Purpose: Configures Spring Security, authentication, and JWT filter chain for the application.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtRequestFilter jwtRequestFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder builder = http.getSharedObject(AuthenticationManagerBuilder.class);
        builder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
        return builder.build();
    }

    @Bean
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
                    "/uploads/**"
                ).permitAll()
                
                // Admin-only endpoints (authenticated)
                .requestMatchers("/admin/**", "/admin/api/**").authenticated()
                
                // All other requests must be authenticated
                .anyRequest().authenticated() 
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }
}
