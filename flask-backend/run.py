#!/usr/bin/env python3
"""
Production runner for Samadhan AI Flask Backend
"""

import os
import sys
from app import app

if __name__ == '__main__':
    # Get port from environment or default to 5000
    port = int(os.environ.get('PORT', 5000))
    
    # Get debug mode from environment
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 Starting Samadhan AI Flask Backend on port {port}")
    print(f"🔧 Debug mode: {debug}")
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug,
        threaded=True
    )