"""
Response Templates for Different Categories and Priorities
=========================================================
"""

RESPONSE_TEMPLATES = {
    'Infrastructure': {
        'critical': [
            "🚨 URGENT: Your critical infrastructure complaint has been marked as emergency priority. Contact Public Works immediately at 0522-2237582 or emergency number 1800-180-4334. Our engineering team will respond within 4 hours for safety assessment.",
            "🚨 CRITICAL ALERT: This infrastructure safety issue requires immediate attention. Public Works Department emergency team contacted at 1800-180-4334. Expected response: 2-4 hours. Your complaint ID: {complaint_id}",
            "🚨 EMERGENCY RESPONSE: Critical infrastructure issue logged. Contact Chief Engineer PWD at 0522-2237582. Emergency repair team dispatched. Safety measures being implemented immediately."
        ],
        'high': [
            "⚡ HIGH PRIORITY: Your infrastructure complaint has been forwarded to Public Works Department with high priority status. Contact: 0522-2237582, Emergency: 1800-180-4334. Expected resolution: 24-48 hours.",
            "⚡ URGENT ATTENTION: Infrastructure issue marked as high priority. Public Works engineering team will assess within 24 hours. Contact: 0522-2237582 for updates.",
            "⚡ PRIORITY CASE: Your infrastructure concern is being expedited. Public Works Department contacted at 0522-2237582. Site inspection scheduled within 24 hours."
        ],
        'medium': [
            "Thank you for reporting this infrastructure issue. Your complaint has been forwarded to the Public Works Department. Contact: 0522-2237582, Emergency: 1800-180-4334. Expected resolution time: 3-7 days.",
            "Infrastructure complaint received and logged with Public Works Department. Our engineering team will assess the situation. Contact: 0522-2237582. Timeline: 3-7 business days.",
            "Your infrastructure concern has been registered with PWD. Contact Chief Engineer at 0522-2237582 for status updates. Expected action: 3-7 days."
        ],
        'low': [
            "Thank you for your infrastructure feedback. This has been noted by the Public Works Department for routine maintenance. Contact: 0522-2237582. Expected timeline: 7-14 days.",
            "Infrastructure maintenance request logged with PWD. This will be included in the next maintenance cycle. Contact: 0522-2237582 for information.",
            "Your infrastructure suggestion has been forwarded to Public Works for consideration in upcoming projects. Contact: 0522-2237582."
        ]
    },
    
    'Water Supply': {
        'critical': [
            "🚨 WATER EMERGENCY: Critical water supply issue reported. UP Jal Nigam emergency team contacted at 1800-180-5555. Immediate response within 2-4 hours. Alternative water arrangements being made.",
            "🚨 URGENT WATER ISSUE: Emergency response activated for water crisis. Contact UP Jal Nigam at 0522-2623404 or emergency 1800-180-5555. Water tanker dispatch initiated.",
            "🚨 CRITICAL ALERT: Water supply emergency logged. Chief Engineer UP Jal Nigam contacted. Emergency repair team mobilized. Contact: 1800-180-5555 for immediate assistance."
        ],
        'high': [
            "⚡ HIGH PRIORITY: Water supply complaint marked urgent. UP Jal Nigam technical team will respond within 6-12 hours. Contact: 0522-2623404, Emergency: 1800-180-5555.",
            "⚡ URGENT WATER ISSUE: Your complaint has been escalated to UP Jal Nigam. Priority repair scheduled within 12 hours. Contact: 0522-2623404 for updates.",
            "⚡ PRIORITY RESPONSE: Water supply problem being addressed urgently. UP Jal Nigam contacted at 0522-2623404. Expected resolution: 12-24 hours."
        ],
        'medium': [
            "Your water supply complaint has been received by UP Jal Nigam. Technical team will investigate and resolve within 24-48 hours. Contact: 0522-2623404, Emergency: 1800-180-5555.",
            "Water supply issue logged with UP Jal Nigam. Our technical staff will assess and repair within 24-48 hours. Contact: 0522-2623404 for status updates.",
            "Thank you for reporting the water supply problem. UP Jal Nigam will address this within 24-48 hours. Contact: 0522-2623404."
        ],
        'low': [
            "Water supply feedback received by UP Jal Nigam. This will be addressed in routine maintenance. Contact: 0522-2623404. Timeline: 3-5 days.",
            "Your water supply concern has been noted for scheduled maintenance. UP Jal Nigam will include this in upcoming work. Contact: 0522-2623404.",
            "Water supply improvement suggestion forwarded to UP Jal Nigam for consideration. Contact: 0522-2623404 for information."
        ]
    },
    
    'Traffic': {
        'critical': [
            "🚨 TRAFFIC EMERGENCY: Critical traffic safety issue reported. Traffic Police emergency response activated. Contact: 100 immediately. Traffic control team dispatched to location.",
            "🚨 URGENT TRAFFIC ALERT: Emergency traffic situation logged. Contact Traffic Police at 100 or 0522-2620173. Immediate traffic management measures being implemented.",
            "🚨 CRITICAL TRAFFIC ISSUE: Emergency response for traffic safety concern. Traffic Police contacted at 100. Safety measures being deployed immediately."
        ],
        'high': [
            "⚡ HIGH PRIORITY: Traffic complaint marked urgent. Traffic Police will respond within 30 minutes. Contact: 0522-2620173, Emergency: 100. Traffic management team alerted.",
            "⚡ URGENT TRAFFIC ISSUE: Your complaint has been escalated to Traffic Police. Priority response within 30 minutes. Contact: 0522-2620173.",
            "⚡ PRIORITY ALERT: Traffic safety concern being addressed urgently. Traffic Police contacted at 0522-2620173. Expected response: 30 minutes."
        ],
        'medium': [
            "Your traffic complaint has been forwarded to UP Traffic Police. They will investigate and take action within 2-4 hours. Contact: 0522-2620173, Emergency: 100.",
            "Traffic issue logged with Traffic Police Department. Our traffic management team will address this within 2-4 hours. Contact: 0522-2620173.",
            "Thank you for reporting the traffic problem. Traffic Police will take appropriate action within 2-4 hours. Contact: 0522-2620173."
        ],
        'low': [
            "Traffic feedback received by Traffic Police. This will be considered for traffic improvement measures. Contact: 0522-2620173. Timeline: 1-2 days.",
            "Your traffic suggestion has been forwarded to Traffic Police for evaluation. Contact: 0522-2620173 for information.",
            "Traffic improvement suggestion noted by Traffic Police Department. This will be reviewed for implementation. Contact: 0522-2620173."
        ]
    },
    
    'Environment': {
        'critical': [
            "🚨 ENVIRONMENTAL EMERGENCY: Critical pollution issue reported. Environment Department emergency team contacted at 1800-180-4999. Immediate inspection within 4-6 hours.",
            "🚨 URGENT ENVIRONMENTAL ALERT: Serious environmental concern logged. Contact Environment Department at 0522-2239296 or emergency 1800-180-4999. Priority investigation initiated.",
            "🚨 CRITICAL POLLUTION ISSUE: Environmental emergency response activated. UP Pollution Control Board contacted. Immediate action within 4-6 hours."
        ],
        'high': [
            "⚡ HIGH PRIORITY: Environmental complaint marked urgent. Environment Department will inspect within 12-24 hours. Contact: 0522-2239296, Emergency: 1800-180-4999.",
            "⚡ URGENT ENVIRONMENTAL ISSUE: Your complaint escalated to Environment Department. Priority inspection scheduled within 24 hours. Contact: 0522-2239296.",
            "⚡ PRIORITY RESPONSE: Environmental concern being addressed urgently. Environment Department contacted at 0522-2239296. Expected inspection: 24 hours."
        ],
        'medium': [
            "Your environmental complaint has been logged with the Environment Department. Inspection will be conducted within 24-48 hours. Contact: 0522-2239296, Emergency: 1800-180-4999.",
            "Environmental concern received by Environment Department. Our environmental team will assess within 24-48 hours. Contact: 0522-2239296.",
            "Thank you for reporting the environmental issue. Environment Department will investigate within 24-48 hours. Contact: 0522-2239296."
        ],
        'low': [
            "Environmental feedback received by Environment Department. This will be included in routine monitoring. Contact: 0522-2239296. Timeline: 3-5 days.",
            "Your environmental suggestion has been forwarded to Environment Department for consideration. Contact: 0522-2239296.",
            "Environmental improvement suggestion noted by Environment Department. This will be reviewed for action. Contact: 0522-2239296."
        ]
    },
    
    'Healthcare': {
        'critical': [
            "🚨 MEDICAL EMERGENCY: Critical healthcare issue reported. Contact emergency services at 108 immediately. Medical emergency team alerted. Director Medical Health contacted at 0522-2237515.",
            "🚨 URGENT MEDICAL ALERT: Healthcare emergency logged. Contact 108 for immediate medical assistance. Healthcare Department emergency response activated.",
            "🚨 CRITICAL HEALTH ISSUE: Medical emergency response initiated. Contact ambulance at 108. Healthcare Department contacted at 0522-2237515 for immediate action."
        ],
        'high': [
            "⚡ HIGH PRIORITY: Healthcare complaint marked urgent. Medical officer will respond within 2-4 hours. Contact: 0522-2237515, Emergency: 108.",
            "⚡ URGENT MEDICAL ISSUE: Your complaint escalated to Healthcare Department. Priority medical attention within 4 hours. Contact: 0522-2237515.",
            "⚡ PRIORITY MEDICAL RESPONSE: Healthcare concern being addressed urgently. Medical team contacted at 0522-2237515. Expected response: 2-4 hours."
        ],
        'medium': [
            "Your healthcare complaint has been forwarded to the Healthcare Department. Medical officer will review within 24 hours. Contact: 0522-2237515, Emergency: 108.",
            "Healthcare concern received by Medical Health Department. Our medical team will address within 24 hours. Contact: 0522-2237515.",
            "Thank you for reporting the healthcare issue. Healthcare Department will investigate within 24 hours. Contact: 0522-2237515."
        ],
        'low': [
            "Healthcare feedback received by Healthcare Department. This will be reviewed for service improvement. Contact: 0522-2237515. Timeline: 2-3 days.",
            "Your healthcare suggestion has been forwarded to Healthcare Department for consideration. Contact: 0522-2237515.",
            "Healthcare improvement suggestion noted by Medical Health Department. This will be evaluated for implementation. Contact: 0522-2237515."
        ]
    },
    
    'Education': {
        'critical': [
            "🚨 EDUCATION EMERGENCY: Critical student safety issue reported. Education Department emergency team contacted. Contact: 0522-2237456 or emergency 1800-180-5678. Immediate action within 2-4 hours.",
            "🚨 URGENT EDUCATION ALERT: Student safety concern logged as emergency. Contact Education Department at 0522-2237456. Priority response initiated.",
            "🚨 CRITICAL SCHOOL ISSUE: Educational emergency response activated. Director Basic Education contacted. Immediate intervention within 4 hours."
        ],
        'high': [
            "⚡ HIGH PRIORITY: Education complaint marked urgent. Educational officer will respond within 12-24 hours. Contact: 0522-2237456, Emergency: 1800-180-5678.",
            "⚡ URGENT EDUCATION ISSUE: Your complaint escalated to Education Department. Priority investigation within 24 hours. Contact: 0522-2237456.",
            "⚡ PRIORITY RESPONSE: Educational concern being addressed urgently. Education Department contacted at 0522-2237456. Expected action: 24 hours."
        ],
        'medium': [
            "Your education complaint has been sent to the Education Department. Educational officer will investigate within 24-48 hours. Contact: 0522-2237456, Emergency: 1800-180-5678.",
            "Educational concern received by Basic Education Department. Our educational team will address within 24-48 hours. Contact: 0522-2237456.",
            "Thank you for reporting the educational issue. Education Department will investigate within 24-48 hours. Contact: 0522-2237456."
        ],
        'low': [
            "Educational feedback received by Education Department. This will be considered for improvement measures. Contact: 0522-2237456. Timeline: 3-5 days.",
            "Your educational suggestion has been forwarded to Education Department for review. Contact: 0522-2237456.",
            "Educational improvement suggestion noted by Education Department. This will be evaluated for implementation. Contact: 0522-2237456."
        ]
    }
}