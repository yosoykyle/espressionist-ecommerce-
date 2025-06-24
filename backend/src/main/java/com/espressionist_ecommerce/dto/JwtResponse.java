package com.espressionist_ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Purpose: Data Transfer Object for JWT authentication responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse implements Serializable {
    private static final long serialVersionUID = -8091879091924046844L;
    private String jwttoken;
}
