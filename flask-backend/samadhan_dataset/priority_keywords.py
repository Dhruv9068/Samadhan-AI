"""
Priority Keywords for Smart Complaint Routing
============================================
"""

PRIORITY_KEYWORDS = {
    'critical': {
        'general': [
            'emergency', 'urgent', 'critical', 'immediate', 'danger', 'life threatening',
            'death', 'accident', 'fire', 'explosion', 'collapse', 'flood', 'disaster',
            'poisoning', 'epidemic', 'outbreak', 'crisis', 'fatal', 'serious injury'
        ],
        'infrastructure': [
            'bridge collapse', 'road cave in', 'building collapse', 'gas leak',
            'electrical hazard', 'live wire', 'structural damage', 'foundation crack',
            'wall falling', 'roof collapse', 'sinkhole', 'landslide'
        ],
        'water': [
            'water contamination', 'cholera outbreak', 'poisoned water', 'no water for days',
            'sewage overflow', 'water borne disease', 'pipeline burst', 'flood',
            'drinking water crisis', 'water emergency'
        ],
        'traffic': [
            'fatal accident', 'hit and run', 'traffic accident', 'road accident',
            'signal not working', 'traffic jam emergency', 'ambulance blocked',
            'fire truck blocked', 'emergency vehicle access'
        ],
        'environment': [
            'toxic gas', 'chemical spill', 'industrial accident', 'air pollution emergency',
            'water pollution crisis', 'hazardous waste', 'radiation leak',
            'environmental disaster', 'mass fish death', 'toxic fumes'
        ],
        'healthcare': [
            'medical emergency', 'patient dying', 'ambulance not coming',
            'doctor not available', 'medicine shortage', 'epidemic outbreak',
            'hospital emergency', 'life support failure', 'blood shortage'
        ],
        'education': [
            'student safety', 'building collapse', 'fire in school', 'child missing',
            'food poisoning', 'violence in school', 'sexual harassment',
            'bullying incident', 'teacher misconduct', 'student injury'
        ]
    },
    
    'high': {
        'general': [
            'important', 'serious', 'major', 'significant', 'severe', 'bad condition',
            'deteriorating', 'worsening', 'affecting many people', 'public safety',
            'health risk', 'safety concern', 'repeated problem', 'ongoing issue'
        ],
        'infrastructure': [
            'pothole causing accidents', 'street lights not working', 'road damage',
            'bridge repair needed', 'drainage blocked', 'public building damage',
            'footpath broken', 'signal malfunction', 'construction delay'
        ],
        'water': [
            'irregular water supply', 'low pressure', 'dirty water', 'pipe leakage',
            'water quality poor', 'sewage problem', 'no water supply',
            'contaminated water', 'water shortage', 'billing error'
        ],
        'traffic': [
            'traffic congestion', 'signal timing wrong', 'parking problem',
            'rash driving', 'speed limit violation', 'illegal parking',
            'traffic rule violation', 'road safety issue', 'pedestrian safety'
        ],
        'environment': [
            'air pollution', 'noise pollution', 'garbage not collected',
            'industrial pollution', 'water pollution', 'illegal dumping',
            'tree cutting', 'waste management', 'pollution monitoring'
        ],
        'healthcare': [
            'doctor absent', 'medicine not available', 'long waiting time',
            'poor treatment', 'hospital cleanliness', 'equipment not working',
            'staff behavior', 'ambulance delay', 'health services poor'
        ],
        'education': [
            'teacher absent', 'poor infrastructure', 'no books', 'meal quality poor',
            'toilet facility poor', 'no drinking water', 'classroom condition',
            'teacher shortage', 'examination delay', 'admission problem'
        ]
    },
    
    'medium': {
        'general': [
            'complaint', 'problem', 'issue', 'concern', 'difficulty', 'trouble',
            'not working', 'not functioning', 'delayed', 'pending', 'slow',
            'inefficient', 'poor service', 'needs improvement', 'request'
        ],
        'infrastructure': [
            'maintenance required', 'repair needed', 'improvement needed',
            'construction quality', 'design issue', 'planning problem',
            'accessibility issue', 'beautification needed', 'upgrade required'
        ],
        'water': [
            'connection delay', 'meter reading', 'billing query', 'pressure issue',
            'timing problem', 'quality concern', 'new connection',
            'transfer request', 'documentation issue', 'procedure query'
        ],
        'traffic': [
            'license issue', 'registration problem', 'challan query',
            'documentation delay', 'procedure clarification', 'rule query',
            'permit issue', 'fitness certificate', 'transfer process'
        ],
        'environment': [
            'awareness needed', 'plantation request', 'cleanliness drive',
            'recycling facility', 'green cover', 'park maintenance',
            'beautification', 'environmental education', 'conservation'
        ],
        'healthcare': [
            'appointment delay', 'procedure query', 'documentation issue',
            'insurance problem', 'referral delay', 'test report delay',
            'facility improvement', 'service enhancement', 'information needed'
        ],
        'education': [
            'admission query', 'fee issue', 'documentation delay',
            'transfer request', 'scholarship query', 'examination query',
            'certificate issue', 'procedure clarification', 'information needed'
        ]
    },
    
    'low': {
        'general': [
            'minor', 'small', 'little', 'slight', 'cosmetic', 'suggestion',
            'recommendation', 'feedback', 'opinion', 'idea', 'proposal',
            'enhancement', 'feature request', 'general query', 'information'
        ],
        'infrastructure': [
            'aesthetic improvement', 'minor repair', 'cosmetic change',
            'beautification suggestion', 'design enhancement', 'comfort improvement',
            'convenience feature', 'accessibility enhancement', 'user experience'
        ],
        'water': [
            'information query', 'general question', 'procedure inquiry',
            'rate information', 'scheme details', 'application process',
            'documentation requirement', 'eligibility criteria', 'contact information'
        ],
        'traffic': [
            'information request', 'procedure query', 'rule clarification',
            'documentation requirement', 'application process', 'fee structure',
            'contact information', 'office timing', 'online service'
        ],
        'environment': [
            'information request', 'awareness query', 'program details',
            'participation opportunity', 'volunteer opportunity', 'educational material',
            'contact information', 'scheme details', 'procedure inquiry'
        ],
        'healthcare': [
            'information query', 'procedure inquiry', 'scheme details',
            'eligibility criteria', 'application process', 'contact information',
            'timing inquiry', 'service availability', 'general guidance'
        ],
        'education': [
            'information request', 'procedure query', 'scheme details',
            'eligibility criteria', 'application process', 'contact information',
            'admission procedure', 'fee structure', 'course information'
        ]
    }
}