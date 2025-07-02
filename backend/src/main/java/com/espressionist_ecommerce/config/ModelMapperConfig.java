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
// Purpose: Configuration class for ModelMapper, defining custom converters for specific DTO to Entity mappings.
// This class sets up the ModelMapper bean and configures type mappings for Admin and Product entities.
// in simple terms, this class is used to convert between Data Transfer Objects (DTOs) and Entities in the application.
// It provides a way to map fields between different object types, such as converting a String role 

public class ModelMapperConfig {
    @Bean
    // Purpose: Provides a ModelMapper bean with custom converters for specific DTO to Entity mappings.
    // This method configures the ModelMapper to handle conversions between DTOs and Entities, such
    
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        // Admin Role Converter: String (DTO) -> Admin.Role (Entity)
        Converter<String, Admin.Role> roleConverter = context -> {
            String source = context.getSource();
            if (source == null) return null;
            return switch (source.trim().toLowerCase()) {
                // Purpose: Converts a String representation of an admin role to the corresponding Admin.Role enum.
                // This converter is used to map the role field from AdminCreationRequestDTO to Admin entity
                case "super admin", "super_admin", "superadmin" -> Admin.Role.SUPER_ADMIN;
                case "manager" -> Admin.Role.MANAGER;
                case "staff" -> Admin.Role.STAFF;
                default -> throw new IllegalArgumentException("Invalid admin role: " + source);
            };
        };
        
        // Purpose: Maps the role field from AdminCreationRequestDTO to Admin entity using the roleConverter.
        // This mapping ensures that the role is converted from a String to the Admin.Role enum type
        modelMapper.typeMap(AdminCreationRequestDTO.class, Admin.class)
                .addMappings(mapper -> mapper.using(roleConverter).map(AdminCreationRequestDTO::getRole, Admin::setRole));
        
         // Product Price Converter: Double (DTO) <-> BigDecimal (Entity)
        Converter<Double, BigDecimal> doubleToBigDecimal = ctx -> ctx.getSource() == null ? null : BigDecimal.valueOf(ctx.getSource());
        
        // Purpose: Converts a Double value to BigDecimal, handling null values gracefully.
        // This converter is used to map the price field from ProductDTO to Product entity.
        Converter<BigDecimal, Double> bigDecimalToDouble = ctx -> ctx.getSource() == null ? null : ctx.getSource().doubleValue();
        
        // Purpose: Maps the price field from ProductDTO to Product entity using the doubleToBigDecimal converter.
        // This mapping ensures that the price is converted from Double to BigDecimal for the Product entity   
        modelMapper.typeMap(ProductDTO.class, Product.class)
                .addMappings(mapper -> mapper.using(doubleToBigDecimal).map(ProductDTO::getPrice, Product::setPrice));
        
        // Purpose: Maps the price field from Product entity to ProductDTO using the bigDecimalToDouble converter.
        // This mapping ensures that the price is converted from BigDecimal to Double for the ProductDTO
        modelMapper.typeMap(Product.class, ProductDTO.class)
                .addMappings(mapper -> mapper.using(bigDecimalToDouble).map(Product::getPrice, ProductDTO::setPrice));
        
        // Purpose: Configures the ModelMapper bean to ignore null values during mapping.
        // This setting prevents null values in the source object from overwriting existing values in the destination
        return modelMapper;
    }
}
