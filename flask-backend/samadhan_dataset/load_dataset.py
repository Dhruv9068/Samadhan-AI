"""
Dataset Loader for Samadhan AI RAG Training
==========================================
"""

from . import (
    UP_GOVERNMENT_DATASET,
    COMPLAINT_PATTERNS, 
    RESPONSE_TEMPLATES,
    PRIORITY_KEYWORDS,
    HELPLINES_DATASET,
    DISTRICTS_DATASET,
    ONLINE_SERVICES,
    SAMADHAN_AI_COMPLETE_DATASET
)

def get_complete_dataset():
    """Get the complete Samadhan AI dataset"""
    return SAMADHAN_AI_COMPLETE_DATASET

def get_training_documents():
    """Generate training documents for RAG system"""
    documents = []
    
    # Add department information
    for dept_name, dept_info in UP_GOVERNMENT_DATASET['departments'].items():
        content = f"{dept_name} in UP handles {', '.join(dept_info['services'])}. Contact: {dept_info['contact']}, Emergency: {dept_info['emergency_contact']}, Email: {dept_info['email']}. Head: {dept_info['head']}. Response time: {dept_info['response_time']}. Address: {dept_info['address']}. Priority keywords: {', '.join(dept_info['priority_keywords'])}."
        
        documents.append({
            'content': content,
            'metadata': {
                'category': dept_name.replace(' ', ''),
                'department': dept_name,
                'contact': dept_info['contact'],
                'emergency': dept_info['emergency_contact'],
                'response_time': dept_info['response_time'],
                'type': 'department_info'
            }
        })
    
    # Add complaint patterns
    for category, complaints in COMPLAINT_PATTERNS.items():
        for complaint in complaints:
            dept_info = UP_GOVERNMENT_DATASET['departments'].get(category, {})
            if not dept_info:
                # Map category to department
                category_mapping = {
                    'Infrastructure': 'Public Works',
                    'Water Supply': 'Water Supply',
                    'Traffic': 'Traffic Police',
                    'Environment': 'Environment',
                    'Healthcare': 'Healthcare',
                    'Education': 'Education'
                }
                dept_name = category_mapping.get(category, 'Public Works')
                dept_info = UP_GOVERNMENT_DATASET['departments'].get(dept_name, {})
            
            content = f"Common complaint: {complaint}. This should be handled by {dept_info.get('head', 'Department Head')}. Contact: {dept_info.get('contact', 'N/A')}, Emergency: {dept_info.get('emergency_contact', '112')}. Expected response time: {dept_info.get('response_time', '3-5 days')}."
            
            documents.append({
                'content': content,
                'metadata': {
                    'category': category.replace(' ', ''),
                    'department': dept_name if 'dept_name' in locals() else category,
                    'type': 'complaint_example',
                    'contact': dept_info.get('contact', 'N/A')
                }
            })
    
    # Add helpline information
    all_helplines = []
    for category, helplines in HELPLINES_DATASET.items():
        for name, number in helplines.items():
            all_helplines.append(f"{name.replace('_', ' ').title()}: {number}")
    
    helplines_content = "UP Government Helplines: " + ", ".join(all_helplines)
    documents.append({
        'content': helplines_content,
        'metadata': {'type': 'helplines', 'category': 'emergency'}
    })
    
    # Add district information
    for district, info in DISTRICTS_DATASET['major_districts'].items():
        content = f"{district} district: DM contact {info['dm_contact']}, Collectorate email {info['collectorate']}, Population {info['population']}, SP contact {info['sp_contact']}, CMO contact {info['cmo_contact']}. Major issues: {', '.join(info['major_issues'])}."
        documents.append({
            'content': content,
            'metadata': {
                'type': 'district',
                'district': district,
                'dm_contact': info['dm_contact'],
                'population': info['population']
            }
        })
    
    # Add online services
    for category, services in ONLINE_SERVICES.items():
        for service_name, service_info in services.items():
            content = f"{service_name.replace('_', ' ').title()}: {service_info['description']}. URL: {service_info['url']}. Services: {', '.join(service_info['services'])}."
            documents.append({
                'content': content,
                'metadata': {
                    'type': 'online_service',
                    'category': category,
                    'url': service_info['url']
                }
            })
    
    return documents

def get_priority_keywords():
    """Get priority keywords for classification"""
    return PRIORITY_KEYWORDS

def get_response_templates():
    """Get response templates for different categories"""
    return RESPONSE_TEMPLATES

def get_department_info(department_name):
    """Get specific department information"""
    return UP_GOVERNMENT_DATASET['departments'].get(department_name, {})

def get_helpline_number(service_type):
    """Get helpline number for specific service"""
    for category, helplines in HELPLINES_DATASET.items():
        if service_type in helplines:
            return helplines[service_type]
    return '112'  # Default emergency number

def get_district_info(district_name):
    """Get district specific information"""
    return DISTRICTS_DATASET['major_districts'].get(district_name, {})

# Statistics about the dataset
def get_dataset_stats():
    """Get statistics about the dataset size"""
    stats = {
        'departments': len(UP_GOVERNMENT_DATASET['departments']),
        'complaint_patterns': sum(len(complaints) for complaints in COMPLAINT_PATTERNS.values()),
        'helplines': sum(len(helplines) for helplines in HELPLINES_DATASET.values()),
        'districts': len(DISTRICTS_DATASET['major_districts']),
        'online_services': sum(len(services) for services in ONLINE_SERVICES.values()),
        'total_training_documents': len(get_training_documents()),
        'response_templates': sum(len(templates) for category_templates in RESPONSE_TEMPLATES.values() for templates in category_templates.values())
    }
    return stats

if __name__ == "__main__":
    # Print dataset statistics
    stats = get_dataset_stats()
    print("🏆 Samadhan AI Dataset Statistics:")
    print(f"📊 Departments: {stats['departments']}")
    print(f"📊 Complaint Patterns: {stats['complaint_patterns']}")
    print(f"📊 Helplines: {stats['helplines']}")
    print(f"📊 Districts: {stats['districts']}")
    print(f"📊 Online Services: {stats['online_services']}")
    print(f"📊 Training Documents: {stats['total_training_documents']}")
    print(f"📊 Response Templates: {stats['response_templates']}")
    print(f"🎯 Total Dataset Size: {sum(stats.values())} entries")