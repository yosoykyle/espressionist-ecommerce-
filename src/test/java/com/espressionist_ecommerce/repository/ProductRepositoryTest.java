import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;
import com.espressionist_ecommerce.model.Product;
import com.espressionist_ecommerce.repository.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest(classes = com.espressionist_ecommerce.EspressionistEcommerceApplication.class)
public class ProductRepositoryTest {

    @Autowired
    private ProductRepository productRepository;

    @Test
    public void testFindByArchivedFalse() {
        List<Product> products = productRepository.findByArchivedFalse();
        assertNotNull(products);
        assertFalse(products.isEmpty());
        products.forEach(product -> assertFalse(product.isArchived()));
    }

    @Test
    public void testProductSerialization() throws Exception {
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setPrice(99.99);
        product.setQuantity(10);
        product.setCategory("Test Category");
        product.setArchived(false);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(product);

        System.out.println("Serialized Product JSON: " + json);
        assertNotNull(json);
        assertTrue(json.contains("Test Product"));
    }
}