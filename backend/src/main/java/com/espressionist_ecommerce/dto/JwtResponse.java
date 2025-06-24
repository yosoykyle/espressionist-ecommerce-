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
// This class is used to transfer JWT token data between layers of the application, such as from the service layer to the controller layer.
// It encapsulates the JWT token string that is used for authentication in subsequent requests.
public class JwtResponse implements Serializable {
    private static final long serialVersionUID = -8091879091924046844L;
    private String jwttoken;
}
