package com.espressionist_ecommerce.config;

import java.math.BigDecimal;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.espressionist_ecommerce.dto.AdminCreationRequestDTO;
import com.espressionist_ecommerce.dto.ProductDTO;
import com.espressionist_ecommerce.entity.Admin;
import com.espressionist_ecommerce.entity.Product;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // Admin Role Converter: String (DTO) -> Admin.Role (Entity)
        Converter<String, Admin.Role> roleConverter = context -> {
            String source = context.getSource();
            if (source == null) return null;
            return switch (source.trim().toLowerCase()) {
                case "super admin", "super_admin", "superadmin" -> Admin.Role.SUPER_ADMIN;
                case "manager" -> Admin.Role.MANAGER;
                case "staff" -> Admin.Role.STAFF;
                default -> throw new IllegalArgumentException("Invalid admin role: " + source);
            };
        };
        modelMapper.typeMap(AdminCreationRequestDTO.class, Admin.class)
                .addMappings(mapper -> mapper.using(roleConverter).map(AdminCreationRequestDTO::getRole, Admin::setRole));

        // Product Price Converter: Double (DTO) <-> BigDecimal (Entity)
        Converter<Double, BigDecimal> doubleToBigDecimal = ctx -> ctx.getSource() == null ? null : BigDecimal.valueOf(ctx.getSource());
        Converter<BigDecimal, Double> bigDecimalToDouble = ctx -> ctx.getSource() == null ? null : ctx.getSource().doubleValue();
        modelMapper.typeMap(ProductDTO.class, Product.class)
                .addMappings(mapper -> mapper.using(doubleToBigDecimal).map(ProductDTO::getPrice, Product::setPrice));
        modelMapper.typeMap(Product.class, ProductDTO.class)
                .addMappings(mapper -> mapper.using(bigDecimalToDouble).map(Product::getPrice, ProductDTO::setPrice));

        return modelMapper;
    }
}
