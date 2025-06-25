package com.espressionist_ecommerce;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;


/**
 * Purpose: Main application class for the Espressionist E-commerce backend.
 * This class initializes the Spring Boot application and configures CORS settings.
 * It allows cross-origin requests from specified origins to enable communication with the frontend.
 */ 

@SpringBootApplication
@EnableJpaAuditing
public class EspressionistEcommerceApplication {
    @Value("${spring.mail.username}")
    private String mailUsername;

    @PostConstruct
    public void logMailUsername() {
        System.out.println("Spring Mail Username at startup: " + mailUsername);
    }

    public static void main(String[] args) {
        SpringApplication.run(EspressionistEcommerceApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            
            @Override
            // Configures CORS mappings to allow cross-origin requests from specified origins.
            // This method allows requests from the frontend development server and a specified production URL.
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
