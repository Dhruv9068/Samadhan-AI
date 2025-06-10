"""
UP Government Departments - Real Data for Samadhan AI
====================================================
"""

UP_GOVERNMENT_DATASET = {
    'departments': {
        'Public Works': {
            'head': 'Chief Engineer PWD',
            'contact': '0522-2237582',
            'email': 'ce-pwd-up@gov.in',
            'address': 'PWD Bhawan, Gomti Nagar, Lucknow - 226010',
            'services': [
                'Road Construction', 'Bridge Maintenance', 'Street Lights', 
                'Public Buildings', 'Drainage Systems', 'Footpaths',
                'Traffic Signals', 'Bus Stops', 'Public Toilets'
            ],
            'response_time': '3-7 days',
            'emergency_contact': '1800-180-4334',
            'priority_keywords': [
                'road', 'bridge', 'street light', 'pothole', 'drainage', 
                'construction', 'footpath', 'signal', 'building', 'repair'
            ],
            'sub_departments': {
                'Roads': {'contact': '0522-2237583', 'head': 'Executive Engineer Roads'},
                'Buildings': {'contact': '0522-2237584', 'head': 'Executive Engineer Buildings'},
                'Bridges': {'contact': '0522-2237585', 'head': 'Executive Engineer Bridges'}
            }
        },
        'Water Supply': {
            'head': 'Chief Engineer UP Jal Nigam',
            'contact': '0522-2623404',
            'email': 'upjn@up.gov.in',
            'address': 'UP Jal Nigam, Vibhuti Khand, Gomti Nagar, Lucknow - 226010',
            'services': [
                'Water Supply', 'Sewerage', 'Water Quality Testing', 
                'New Connections', 'Pipe Repairs', 'Water Treatment',
                'Bore Wells', 'Hand Pumps', 'Water Tankers'
            ],
            'response_time': '24-48 hours',
            'emergency_contact': '1800-180-5555',
            'priority_keywords': [
                'water', 'pipe', 'leak', 'supply', 'quality', 'sewage', 
                'connection', 'bore', 'pump', 'tanker', 'treatment'
            ],
            'sub_departments': {
                'Water Supply': {'contact': '0522-2623405', 'head': 'Executive Engineer Water Supply'},
                'Sewerage': {'contact': '0522-2623406', 'head': 'Executive Engineer Sewerage'},
                'Quality Control': {'contact': '0522-2623407', 'head': 'Chief Chemist'}
            }
        },
        'Traffic Police': {
            'head': 'Additional DGP Traffic',
            'contact': '0522-2620173',
            'email': 'traffic@up.gov.in',
            'address': 'Traffic Headquarters, Hazratganj, Lucknow - 226001',
            'services': [
                'Traffic Management', 'Challan Services', 'License Verification',
                'Vehicle Registration', 'Road Safety', 'Accident Investigation',
                'Parking Management', 'Signal Control', 'Speed Control'
            ],
            'response_time': '30 minutes',
            'emergency_contact': '100',
            'priority_keywords': [
                'traffic', 'signal', 'accident', 'challan', 'license', 
                'parking', 'violation', 'speed', 'vehicle', 'registration'
            ],
            'sub_departments': {
                'Traffic Control': {'contact': '0522-2620174', 'head': 'SP Traffic'},
                'Licensing': {'contact': '0522-2620175', 'head': 'ACP Licensing'},
                'Enforcement': {'contact': '0522-2620176', 'head': 'ACP Enforcement'}
            }
        },
        'Environment': {
            'head': 'Secretary Environment Department',
            'contact': '0522-2239296',
            'email': 'env@up.gov.in',
            'address': 'Environment Department, Lal Bahadur Shastri Bhawan, Lucknow - 226001',
            'services': [
                'Pollution Control', 'Waste Management', 'Tree Plantation',
                'Air Quality Monitoring', 'Noise Control', 'Industrial Monitoring',
                'Green Belt Development', 'Environmental Clearance'
            ],
            'response_time': '24-48 hours',
            'emergency_contact': '1800-180-4999',
            'priority_keywords': [
                'pollution', 'waste', 'garbage', 'environment', 'noise', 
                'air quality', 'tree', 'industrial', 'smoke', 'dumping'
            ],
            'sub_departments': {
                'Pollution Control': {'contact': '0522-2239297', 'head': 'Member Secretary UPPCB'},
                'Waste Management': {'contact': '0522-2239298', 'head': 'Chief Environmental Officer'},
                'Forest': {'contact': '0522-2239299', 'head': 'Principal Chief Conservator'}
            }
        },
        'Healthcare': {
            'head': 'Director General Medical Health',
            'contact': '0522-2237515',
            'email': 'dgmh@up.gov.in',
            'address': 'Directorate of Medical Health, Swasthya Bhawan, Lucknow - 226001',
            'services': [
                'Public Health Services', 'Hospital Management', 'Medical Services',
                'Emergency Care', 'Vaccination Programs', 'Disease Control',
                'Maternal Health', 'Child Health', 'Ambulance Services'
            ],
            'response_time': '24 hours',
            'emergency_contact': '108',
            'priority_keywords': [
                'health', 'hospital', 'medical', 'doctor', 'medicine', 
                'emergency', 'patient', 'ambulance', 'vaccination', 'disease'
            ],
            'sub_departments': {
                'Public Health': {'contact': '0522-2237516', 'head': 'Director Public Health'},
                'Medical Education': {'contact': '0522-2237517', 'head': 'Director Medical Education'},
                'AYUSH': {'contact': '0522-2237518', 'head': 'Director AYUSH'}
            }
        },
        'Education': {
            'head': 'Director Basic Education',
            'contact': '0522-2237456',
            'email': 'dbe@up.gov.in',
            'address': 'Basic Education Department, Shiksha Sankul, Lucknow - 226007',
            'services': [
                'School Management', 'Teacher Training', 'Student Welfare',
                'Infrastructure Development', 'Mid-day Meal', 'Scholarship Programs',
                'Examination Conduct', 'Curriculum Development'
            ],
            'response_time': '24 hours',
            'emergency_contact': '1800-180-5678',
            'priority_keywords': [
                'school', 'teacher', 'student', 'education', 'exam', 
                'admission', 'scholarship', 'meal', 'book', 'uniform'
            ],
            'sub_departments': {
                'Basic Education': {'contact': '0522-2237457', 'head': 'Director Basic Education'},
                'Secondary Education': {'contact': '0522-2237458', 'head': 'Director Secondary Education'},
                'Higher Education': {'contact': '0522-2237459', 'head': 'Director Higher Education'}
            }
        },
        'Revenue': {
            'head': 'Board of Revenue Chairman',
            'contact': '0522-2237890',
            'email': 'revenue@up.gov.in',
            'address': 'Board of Revenue, Lucknow - 226001',
            'services': [
                'Land Records', 'Property Registration', 'Revenue Collection',
                'Mutation Services', 'Survey Settlement', 'Land Acquisition'
            ],
            'response_time': '3-5 days',
            'emergency_contact': '1800-180-6789',
            'priority_keywords': [
                'land', 'property', 'registration', 'mutation', 'revenue', 
                'record', 'survey', 'acquisition', 'settlement'
            ]
        },
        'Agriculture': {
            'head': 'Director Agriculture',
            'contact': '0522-2237123',
            'email': 'agriculture@up.gov.in',
            'address': 'Agriculture Department, Krishi Bhawan, Lucknow - 226001',
            'services': [
                'Crop Advisory', 'Fertilizer Distribution', 'Seed Supply',
                'Irrigation Support', 'Farmer Training', 'Subsidy Schemes'
            ],
            'response_time': '2-3 days',
            'emergency_contact': '1800-180-1551',
            'priority_keywords': [
                'crop', 'fertilizer', 'seed', 'irrigation', 'farmer', 
                'subsidy', 'agriculture', 'farming', 'harvest'
            ]
        },
        'Food & Civil Supplies': {
            'head': 'Food Commissioner',
            'contact': '0522-2237234',
            'email': 'food@up.gov.in',
            'address': 'Food & Civil Supplies Department, Lucknow - 226001',
            'services': [
                'Ration Card Services', 'PDS Management', 'Food Security',
                'Fair Price Shops', 'Food Grain Distribution'
            ],
            'response_time': '24-48 hours',
            'emergency_contact': '1800-180-1967',
            'priority_keywords': [
                'ration', 'pds', 'food', 'grain', 'shop', 'card', 
                'distribution', 'supply', 'quota'
            ]
        },
        'Social Welfare': {
            'head': 'Director Social Welfare',
            'contact': '0522-2237345',
            'email': 'socialwelfare@up.gov.in',
            'address': 'Social Welfare Department, Lucknow - 226001',
            'services': [
                'Pension Schemes', 'Disability Services', 'Women Welfare',
                'Child Welfare', 'Old Age Support', 'Widow Pension'
            ],
            'response_time': '3-5 days',
            'emergency_contact': '1800-180-4567',
            'priority_keywords': [
                'pension', 'disability', 'women', 'child', 'welfare', 
                'widow', 'old age', 'support', 'scheme'
            ]
        }
    }
}