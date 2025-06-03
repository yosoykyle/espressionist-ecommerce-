package com.espressionist_ecommerce.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public void postHandle(
                @NonNull HttpServletRequest request,
                @NonNull jakarta.servlet.http.HttpServletResponse response,
                @NonNull Object handler,
                @Nullable ModelAndView modelAndView) {
                if (modelAndView != null) {
                    modelAndView.addObject("currentUri", request.getRequestURI());
                }
            }
        });
    }
}
