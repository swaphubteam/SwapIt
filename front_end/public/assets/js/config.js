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
            // TODO: Replace with your actual backend URL (e.g., Railway, Render, Heroku)
            return 'https://your-backend-url.railway.app/api';
        }
        return '/api'; // Local development
    },
    
    // Google OAuth Redirect URI
    get googleRedirectUri() {
        return `${window.location.origin}/api/google-callback.php`;
    },
    
    // Environment name
    get environment() {
        return this.isProduction ? 'production' : 'development';
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SwapItConfig;
}
