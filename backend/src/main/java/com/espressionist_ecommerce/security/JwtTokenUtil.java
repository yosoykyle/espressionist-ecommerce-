package com.espressionist_ecommerce.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Purpose: Utility class for generating and validating JWT tokens.
 * Provides methods to extract claims, generate tokens, and validate them against user details.
 * In simple terms, this class is used to create and verify JSON Web Tokens (JWTs) for user authentication.
 * It allows the application to securely issue tokens that can be used to authenticate users in subsequent requests.
 */
@Component
public class JwtTokenUtil {
    @Value("${jwt.secret}")
    // The secret key used for signing the JWT tokens.
    // It should be kept secure and not exposed in public repositories.
    private String secret;
    @Value("${jwt.expiration}")
    // The expiration time for the JWT tokens in seconds.
    // This value determines how long the token is valid before it expires.
    private long jwtExpirationInSec;
    // The default constructor is used for dependency injection.
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
    // This method extracts the username from the JWT token.
    // It uses the Claims object to retrieve the subject, which is the username in this case
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }
    // This method retrieves the expiration date from the JWT token.
    // It uses the Claims object to get the expiration claim, which indicates when the token will expire.
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }
    // This method extracts a specific claim from the JWT token using a provided function.
    // It allows for flexible retrieval of claims based on the function passed in.
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }
    // This method retrieves all claims from the JWT token.
    // It parses the token using the signing key and returns the Claims object containing all claims.
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
    }
    // This method checks if the JWT token is expired. 
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }
    // This method generates a JWT token for a given UserDetails object.
    // It creates a map of claims (currently empty) and calls the doGenerateToken method to create the token.
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return doGenerateToken(claims, userDetails.getUsername());
    }
    // This method generates a JWT token with custom claims and a subject.
    // It sets the claims, subject, issued date, expiration date, and signs the token.
    private String doGenerateToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInSec * 1000))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }
    // This method validates the JWT token against the provided UserDetails.
    // It checks if the username in the token matches the username in UserDetails and if the token is not expired.
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
