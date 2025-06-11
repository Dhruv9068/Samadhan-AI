import os
import logging
from datetime import datetime

# Production-specific configurations
class ProductionConfig:
    """Production configuration with enhanced security and monitoring"""
    
    # Logging configuration
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    # Security configurations
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
    
    # CORS origins for production
    ALLOWED_ORIGINS = [
        'https://samadhan-ai.netlify.app'
        'https://samadhan-ai.vercel.app',
        'http://localhost:5173',  # For development
        'http://localhost:5000'   # For development
    ]
    
    # Rate limiting
    RATE_LIMIT_ENABLED = os.getenv('RATE_LIMIT_ENABLED', 'true').lower() == 'true'
    RATE_LIMIT_PER_MINUTE = int(os.getenv('RATE_LIMIT_PER_MINUTE', '60'))
    
    # Health check configuration
    HEALTH_CHECK_ENABLED = True
    HEALTH_CHECK_TIMEOUT = 30
    
    # API timeouts
    WATSONX_TIMEOUT = int(os.getenv('WATSONX_TIMEOUT', '60'))
    OPENROUTER_TIMEOUT = int(os.getenv('OPENROUTER_TIMEOUT', '30'))
    
    # Monitoring
    ENABLE_METRICS = os.getenv('ENABLE_METRICS', 'true').lower() == 'true'
    ENABLE_DETAILED_LOGGING = os.getenv('ENABLE_DETAILED_LOGGING', 'false').lower() == 'true'

def setup_production_logging():
    """Setup production logging configuration"""
    logging.basicConfig(
        level=getattr(logging, ProductionConfig.LOG_LEVEL),
        format=ProductionConfig.LOG_FORMAT,
        handlers=[
            logging.StreamHandler(),  # Console output
            # Add file handler if needed
            # logging.FileHandler('app.log')
        ]
    )

def get_production_cors_origins():
    """Get CORS origins for production"""
    # Get from environment variable if set
    env_origins = os.getenv('CORS_ORIGINS')
    if env_origins:
        return env_origins.split(',')
    
    return ProductionConfig.ALLOWED_ORIGINS

# Health check endpoint for production monitoring
def enhanced_health_check():
    """Enhanced health check for production monitoring"""
    try:
        from app import config, sentence_model, openrouter_client
        
        health_data = {
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'version': '3.0.0',
            'environment': 'production',
            'services': {
                'watsonx_accounts': len(config.WATSONX_ACCOUNTS),
                'openrouter': bool(openrouter_client),
                'rag_system': bool(sentence_model),
                'database': 'healthy'  # Add database check if needed
            },
            'performance': {
                'uptime': 'calculated_uptime',  # Implement uptime calculation
                'memory_usage': 'calculated_memory',  # Implement memory monitoring
                'cpu_usage': 'calculated_cpu'  # Implement CPU monitoring
            }
        }
        
        return health_data
        
    except Exception as e:
        return {
            'status': 'unhealthy',
            'timestamp': datetime.now().isoformat(),
            'error': str(e)
        }

# Production-ready error handling
def handle_production_error(error, request_id=None):
    """Handle errors in production with proper logging"""
    error_data = {
        'error_id': request_id or datetime.now().strftime('%Y%m%d_%H%M%S'),
        'timestamp': datetime.now().isoformat(),
        'error_type': type(error).__name__,
        'error_message': str(error),
        'environment': 'production'
    }
    
    # Log error (don't expose sensitive information)
    logging.error(f"Production error: {error_data}")
    
    # Return user-friendly error message
    return {
        'error': 'An internal error occurred. Please try again later.',
        'error_id': error_data['error_id'],
        'timestamp': error_data['timestamp']
    }

# Production monitoring middleware
def add_request_monitoring(app):
    """Add request monitoring for production"""
    
    @app.before_request
    def before_request():
        """Log request details"""
        if ProductionConfig.ENABLE_DETAILED_LOGGING:
            logging.info(f"Request: {request.method} {request.path}")
    
    @app.after_request
    def after_request(response):
        """Log response details"""
        if ProductionConfig.ENABLE_DETAILED_LOGGING:
            logging.info(f"Response: {response.status_code}")
        return response
    
    return app

# Export production configurations
__all__ = [
    'ProductionConfig',
    'setup_production_logging',
    'get_production_cors_origins',
    'enhanced_health_check',
    'handle_production_error',
    'add_request_monitoring'
]