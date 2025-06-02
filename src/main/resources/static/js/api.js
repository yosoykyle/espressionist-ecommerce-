/**
 * API client for Espressionist e-commerce site
 * Contains all API calls to backend services
 */

const API_BASE_URL = '';  // Empty string for same-origin requests
const CSRF_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];  // Methods that require CSRF token

// Get CSRF token from meta tags
const getCsrfToken = () => {
    const token = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
    const header = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');
    return { token, header };
};

/**
 * Basic fetch wrapper with error handling and CSRF protection
 */
async function fetchApi(endpoint, options = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Add CSRF token for unsafe methods
    const { method = 'GET' } = options;
    if (CSRF_METHODS.includes(method.toUpperCase())) {
        const { token, header } = getCsrfToken();
        if (token && header) {
            defaultHeaders[header] = token;
        }
    }

    // Set up timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                ...defaultHeaders,
                ...options.headers
            },
            credentials: 'same-origin', // Include cookies for session handling
            signal: controller.signal,
            ...options
        });

        clearTimeout(timeout);

        if (!response.ok) {
            let errorMessage;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
            } catch {
                // If the error response is not JSON
                errorMessage = response.statusText || `HTTP error! status: ${response.status}`;
                if (response.status === 403) {
                    errorMessage = 'Access denied. Please ensure you are logged in with proper permissions.';
                } else if (response.status === 401) {
                    errorMessage = 'You must be logged in to perform this action.';
                } else if (response.status === 419) {
                    // Special case for CSRF token expiration/mismatch
                    errorMessage = 'Your session has expired. Please refresh the page and try again.';
                    // Optionally reload the page to get a fresh CSRF token
                    window.location.reload();
                }
            }
            throw new Error(errorMessage);
        }

        // Return null for 204 No Content
        if (response.status === 204) {
            return null;
        }

        // Special case for file downloads
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/octet-stream')) {
            return response.blob();
        }

        // Parse JSON response
        return response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please try again.');
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

// Product API calls
export const productApi = {
    getAllActive: () => fetchApi('/api/products'),
    getById: (id) => fetchApi(`/api/products/${id}`),
    getImage: (id) => fetchApi(`/api/products/${id}/image`),
    create: (data) => fetchApi('/api/products', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => fetchApi(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    archive: (id) => fetchApi(`/api/products/${id}`, {
        method: 'DELETE'
    }),
    uploadImage: (id, imageFile) => {
        const formData = new FormData();
        formData.append('imageFile', imageFile);
        return fetchApi(`/api/products/${id}/image`, {
            method: 'POST',
            headers: {}, // Let browser set content-type for multipart/form-data
            body: formData
        });
    }
};

// Order API calls
export const orderApi = {
    create: (orderData) => fetchApi('/api/checkout', {
        method: 'POST',
        body: JSON.stringify(orderData)
    }),
    getStatus: (orderCode) => fetchApi(`/api/order-status/${orderCode}`),
    updateStatus: (id, status) => fetchApi(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    }),
    archive: (id) => fetchApi(`/api/admin/orders/${id}/archive`, {
        method: 'POST'
    })
};

// Admin API calls
export const adminApi = {
    login: (credentials) => fetchApi('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    logout: () => fetchApi('/api/admin/logout', {
        method: 'POST'
    }),
    getCurrent: () => fetchApi('/api/admin/current'),
    getAll: () => fetchApi('/api/admin/list'),
    create: (adminData) => fetchApi('/api/admin/create', {
        method: 'POST',
        body: JSON.stringify(adminData)
    }),
    update: (id, adminData) => fetchApi('/api/admin/update/' + id, {
        method: 'PUT',
        body: JSON.stringify(adminData)
    }),
    delete: (id) => fetchApi('/api/admin/delete/' + id, {
        method: 'DELETE'
    })
};
