package com.espressionist_ecommerce;

/**
 * Purpose: Main entry point for the Spring Boot application, enabling JPA auditing and CORS configuration.
 */

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

@SpringBootApplication
@EnableJpaAuditing
public class EspressionistEcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EspressionistEcommerceApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(
                        "http://localhost:8080",
                        "http://127.0.0.1:8080",
                        "https://friendly-disco-p7rrgvp7ppqfrwjv-3000.app.github.dev"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*");
            }
        };
    }
}
