package com.espressionist_ecommerce.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);

    @Value("${app.cors.allowed-origin:http://localhost:3000}")
    private String allowedOrigin;

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve files from /uploads/** URL, mapping to the uploads directory relative to backend working dir
        logger.info("[WebConfig] Serving /uploads/** from: uploads/ (relative to backend working directory)");
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        // Updated: Allow both localhost and LAN IP for frontend dev access
        registry.addMapping("/**") // Apply to all paths
            .allowedOrigins("http://localhost:3000", "http://192.168.1.25:3000") // Added LAN IP
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
