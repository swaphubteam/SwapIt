/**
 * SwapIt Configuration
 * Handles environment-specific settings for local and production environments
 * 
 * @author Athanase Abayo
 * @version 1.0
 */

const SwapItConfig = {
    // Detect if running in production (Vercel) or local development
    isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
    
    // API Base URL - Update this with your backend URL when deployed
    get apiBaseUrl() {
        if (this.isProduction) {
            // IMPORTANT: Replace 'your-backend-url' with your actual Railway/Render URL
            // Example: 'https://swapit-production.up.railway.app'
            const BACKEND_URL = 'https://your-backend-url.up.railway.app';
            return BACKEND_URL;
        }
        // Local development - assumes XAMPP/WAMP running on port 80
        return 'http://localhost/activity_04_Final_Project/back_end/api';
    },
    
    // Google OAuth Redirect URI
    get googleRedirectUri() {
        if (this.isProduction) {
            // Use backend URL for OAuth callback
            return `${this.apiBaseUrl}/google-callback.php`;
        }
        return 'http://localhost/activity_04_Final_Project/back_end/api/google-callback.php';
    },
    
    // Environment name
    get environment() {
        return this.isProduction ? 'production' : 'development';
    },
    
    // Helper method to construct full API endpoint
    getEndpoint(path) {
        // Remove leading slash if present
        path = path.replace(/^\//, '');
        return `${this.apiBaseUrl}/${path}`;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SwapItConfig;
}
