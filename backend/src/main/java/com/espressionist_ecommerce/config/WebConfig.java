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

/**
 * Purpose: Configures web-related settings such as CORS and resource handlers for serving static files.
 * This configuration allows CORS requests from specified origins and serves files from the uploads directory.
 */
public class WebConfig implements WebMvcConfigurer {
    /** Logger for WebConfig class */
    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);
    /** Allowed origin for CORS requests, defaulting to http://localhost:3000 */
    // This can be overridden by setting the app.cors.allowed-origin property in application.properties
    @Value("${app.cors.allowed-origin:http://localhost:3000}")
    private String allowedOrigin;
    
    @Override
    /**
     * Configures resource handlers to serve static files from the uploads directory.
     * This method maps requests to /uploads/** to the local uploads directory.
     * @param registry ResourceHandlerRegistry to register resource handlers
     */
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve files from /uploads/** URL, mapping to the uploads directory relative to backend working dir
        logger.info("[WebConfig] Serving /uploads/** from: uploads/ (relative to backend working directory)");
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }

    @Override
    /**
     * Configures CORS mappings to allow cross-origin requests from specified origins.
     * This method allows requests from the frontend development server and a specified LAN IP.
     * @param registry CorsRegistry to register CORS mappings
     */
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        // Updated: Allow both localhost and LAN IP for frontend dev access
        registry.addMapping("/**") // Apply to all paths
            .allowedOrigins("http://localhost:3000", "http://192.168.1.7:3000") // Added LAN IP
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD") // Allow common HTTP methods
            .allowedOriginPatterns("*") // Allow all origin patterns 
            .allowedHeaders("*")    // Allow all headers
            .allowCredentials(true);    
    }
}
