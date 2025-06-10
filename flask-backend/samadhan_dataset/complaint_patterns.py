"""
Common Complaint Patterns for Samadhan AI Training
=================================================
"""

COMPLAINT_PATTERNS = {
    'Infrastructure': [
        # Road Related
        'Road repair needed urgently in my area',
        'Pothole causing accidents on main road',
        'Road construction work incomplete for months',
        'Broken road causing vehicle damage',
        'Waterlogging on road during rain',
        'Road widening project delayed',
        'Uneven road surface dangerous for vehicles',
        'Road marking and signage missing',
        'Speed breakers needed on busy road',
        'Road divider damaged and dangerous',
        
        # Street Lights
        'Street lights not working for weeks',
        'Dark streets causing safety issues',
        'Broken street light poles',
        'Insufficient lighting in residential area',
        'Street lights working during day time',
        'LED lights not installed as promised',
        'Frequent power cuts in street lights',
        'Street light maintenance required',
        'New street lights needed in colony',
        'Faulty street light timer system',
        
        # Drainage
        'Drainage system blocked causing waterlogging',
        'Open drains creating health hazard',
        'Sewage overflow on streets',
        'Drain cleaning not done regularly',
        'Broken drain covers dangerous',
        'Rainwater not draining properly',
        'Mosquito breeding in stagnant water',
        'Drain construction incomplete',
        'Illegal connections blocking drains',
        'Drain water entering houses',
        
        # Buildings & Bridges
        'Bridge construction delayed for months',
        'Public building in poor condition',
        'Government office building needs repair',
        'Bridge safety concerns',
        'Building construction quality poor',
        'Unauthorized construction on public land',
        'Public toilet facility not maintained',
        'Bus stop shelter damaged',
        'Footpath construction needed',
        'Public park infrastructure poor'
    ],
    
    'Water Supply': [
        # Water Supply Issues
        'No water supply for 3 days',
        'Irregular water supply timing',
        'Low water pressure in taps',
        'Water supply only for few hours',
        'No water in overhead tank',
        'Water motor not working',
        'Bore well water not coming',
        'Hand pump not working',
        'Water tanker not coming regularly',
        'New water connection pending',
        
        # Water Quality
        'Water quality is very poor and dirty',
        'Contaminated water causing illness',
        'Muddy water coming from taps',
        'Bad smell in drinking water',
        'Water testing not done regularly',
        'Chlorine smell too strong in water',
        'Water color changed to yellow',
        'Bacteria found in water sample',
        'Water purification plant not working',
        'Fluoride content high in water',
        
        # Pipe & Infrastructure
        'Pipe leakage wasting water on street',
        'Broken water pipeline',
        'Old pipes need replacement',
        'Water meter not working properly',
        'Illegal water connections',
        'Pipeline burst causing flooding',
        'Water theft from main pipeline',
        'Pipe connection charges too high',
        'Water billing errors',
        'Sewage mixing with water supply',
        
        # Sewerage
        'Sewage overflow in residential area',
        'Blocked sewage line',
        'Sewage treatment plant not working',
        'Open sewage causing health issues',
        'Sewage water on roads',
        'Manholes overflowing',
        'Sewage pipe burst',
        'No proper sewage disposal',
        'Sewage cleaning not regular',
        'Industrial waste in sewage system'
    ],
    
    'Traffic': [
        # Signal & Management
        'Traffic signal not working at busy intersection',
        'Traffic jam due to poor management',
        'No traffic police at important crossings',
        'Traffic signal timing needs adjustment',
        'Broken traffic lights causing confusion',
        'No traffic signs and boards',
        'Traffic congestion during peak hours',
        'One way traffic rules not followed',
        'Traffic diversion causing problems',
        'Electronic traffic signals malfunctioning',
        
        # Parking & Violations
        'Illegal parking blocking main road',
        'No parking space in market area',
        'Vehicles parked on footpath',
        'Paid parking charges too high',
        'Parking attendant misbehavior',
        'No designated parking zones',
        'Heavy vehicles parked in residential area',
        'Parking violations not penalized',
        'Encroachment on parking space',
        'Parking meters not working',
        
        # Road Safety
        'Rash driving causing accidents',
        'Speed breaker needed near school',
        'No zebra crossing for pedestrians',
        'Dangerous driving by auto drivers',
        'Overloaded vehicles on roads',
        'Drunk driving cases increasing',
        'No helmet checking by police',
        'School zone speed limit not enforced',
        'Accident prone area needs attention',
        'Road safety awareness needed',
        
        # Licensing & Documentation
        'Driving license renewal delayed',
        'Vehicle registration process slow',
        'Fitness certificate not issued',
        'Pollution certificate problems',
        'License test center issues',
        'RC transfer process complicated',
        'Duplicate license application pending',
        'International driving permit delay',
        'Vehicle insurance verification issues',
        'Challan payment system problems'
    ],
    
    'Environment': [
        # Waste Management
        'Garbage not collected for days',
        'Overflowing dustbins in area',
        'Waste segregation not implemented',
        'Garbage collection timing irregular',
        'Plastic waste not managed properly',
        'Medical waste disposal improper',
        'Construction waste on roads',
        'E-waste collection not available',
        'Composting facility not working',
        'Waste to energy plant issues',
        
        # Pollution
        'Air pollution from factory smoke',
        'Industrial waste polluting river',
        'Vehicle pollution increasing',
        'Burning of garbage causing smoke',
        'Construction dust pollution',
        'Chemical smell from industries',
        'Smog affecting visibility',
        'Crop burning smoke problem',
        'Pollution monitoring not done',
        'Air quality index very poor',
        
        # Noise Pollution
        'Noise pollution from construction',
        'Loud music disturbing peace',
        'Industrial noise during night',
        'Vehicle horn noise excessive',
        'Generator noise in residential area',
        'Loudspeaker noise from events',
        'Airport noise affecting residents',
        'Railway noise pollution',
        'Market noise levels high',
        'Wedding noise beyond limits',
        
        # Green Cover
        'Trees being cut without permission',
        'No plantation drive in area',
        'Park maintenance very poor',
        'Green belt development needed',
        'Tree cutting for construction',
        'Illegal tree felling',
        'No green cover in industrial area',
        'Urban forest development required',
        'Tree plantation not surviving',
        'Deforestation for development'
    ],
    
    'Healthcare': [
        # Hospital Services
        'Doctor not available at government hospital',
        'Long waiting time for treatment',
        'Poor cleanliness in hospital',
        'Medical equipment not working',
        'Hospital staff behavior rude',
        'No proper patient care',
        'Emergency services not available',
        'Specialist doctor not available',
        'Hospital beds not sufficient',
        'Patient registration system slow',
        
        # Medicine & Treatment
        'Medicine shortage in health center',
        'Free medicine not available',
        'Expensive treatment in government hospital',
        'Wrong medicine given to patient',
        'Medicine quality poor',
        'Vaccination not available',
        'Blood bank shortage',
        'Diagnostic services not working',
        'X-ray machine not functioning',
        'Laboratory reports delayed',
        
        # Emergency Services
        'Ambulance service not responding',
        'Ambulance reached very late',
        'Ambulance driver demanded money',
        'No oxygen in ambulance',
        'Emergency helpline not working',
        'Trauma center not equipped',
        'ICU facility not available',
        'Emergency surgery delayed',
        'Blood not available for emergency',
        'Ambulance broke down on way',
        
        # Public Health
        'Disease outbreak not controlled',
        'Health awareness programs needed',
        'Maternal health services poor',
        'Child immunization delayed',
        'Health checkup camps not organized',
        'Nutrition program not implemented',
        'Mental health services lacking',
        'Elderly care services needed',
        'Health insurance claim rejected',
        'Telemedicine services not available'
    ],
    
    'Education': [
        # School Infrastructure
        'School building in poor condition',
        'No proper toilet facilities in school',
        'Classroom roof leaking during rain',
        'No electricity in school',
        'Playground not maintained',
        'School boundary wall broken',
        'No drinking water facility',
        'Furniture broken in classrooms',
        'Library not properly equipped',
        'Computer lab not functional',
        
        # Teachers & Staff
        'Teacher absent frequently in school',
        'Not enough teachers in school',
        'Teacher behavior inappropriate',
        'Principal not available',
        'Support staff not working',
        'Teacher training not provided',
        'Substitute teacher not arranged',
        'Teacher transfer issues',
        'Salary payment delayed for teachers',
        'Teacher recruitment process slow',
        
        # Academic Issues
        'Books not provided to students',
        'Syllabus not completed on time',
        'Examination process delayed',
        'Result declaration late',
        'Admission process complicated',
        'Fee structure not clear',
        'Scholarship not received',
        'Certificate not issued',
        'Transfer certificate delayed',
        'Academic calendar not followed',
        
        # Student Welfare
        'Mid-day meal quality is poor',
        'Uniform not distributed',
        'Transportation facility not available',
        'Student safety concerns',
        'Bullying incidents in school',
        'No counseling services',
        'Special needs support lacking',
        'Sports facilities inadequate',
        'Cultural activities not organized',
        'Parent-teacher meetings not held'
    ]
}