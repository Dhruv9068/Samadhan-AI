"""
Samadhan AI - Comprehensive UP Government Dataset for RAG Training
================================================================

This dataset contains real UP government data for training the RAG system:
- Government departments with real contacts
- Common complaint patterns
- Priority keywords for smart routing
- Response templates
- Helpline numbers
- District information
- Online services
"""

from .up_government_data import UP_GOVERNMENT_DATASET
from .complaint_patterns import COMPLAINT_PATTERNS
from .response_templates import RESPONSE_TEMPLATES
from .priority_keywords import PRIORITY_KEYWORDS
from .helplines import HELPLINES_DATASET
from .districts import DISTRICTS_DATASET
from .online_services import ONLINE_SERVICES

__all__ = [
    'UP_GOVERNMENT_DATASET',
    'COMPLAINT_PATTERNS', 
    'RESPONSE_TEMPLATES',
    'PRIORITY_KEYWORDS',
    'HELPLINES_DATASET',
    'DISTRICTS_DATASET',
    'ONLINE_SERVICES'
]

# Combined dataset for easy access
SAMADHAN_AI_COMPLETE_DATASET = {
    'project_info': {
        'name': 'Samadhan AI',
        'version': '3.0.0',
        'theme': 'AI-powered citizen grievance automation for UP CM Helpline 1076',
        'objective': 'Automate and optimize handling of citizen grievances with AI-driven sentiment analysis, categorization, and priority routing',
        'tech_stack': ['Python', 'Machine Learning', 'LangChain', 'RAG', 'WatsonX LLM', 'OpenRouter DeepSeek'],
        'features': ['Sentiment Analysis', 'Auto-categorization', 'Priority Detection', 'Department Routing', 'Real-time Processing'],
        'hackathon_ready': True,
        'dataset_size': '10,000+ entries'
    },
    'government_data': UP_GOVERNMENT_DATASET,
    'complaint_patterns': COMPLAINT_PATTERNS,
    'response_templates': RESPONSE_TEMPLATES,
    'priority_keywords': PRIORITY_KEYWORDS,
    'helplines': HELPLINES_DATASET,
    'districts': DISTRICTS_DATASET,
    'online_services': ONLINE_SERVICES
}