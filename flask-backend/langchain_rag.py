"""
Advanced LangChain RAG implementation for Samadhan AI
Handles document processing, embeddings, and intelligent retrieval
"""

import os
import logging
from typing import List, Dict, Any, Optional
import json
import pickle
from pathlib import Path

# LangChain imports
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.schema import Document
from langchain.prompts import PromptTemplate
from langchain.chains.question_answering import load_qa_chain
from langchain.callbacks import get_openai_callback

logger = logging.getLogger(__name__)

class SamadhanRAG:
    """Advanced RAG system for government complaint analysis"""
    
    def __init__(self, openai_api_key: str = None, openrouter_api_key: str = None):
        self.openai_api_key = openai_api_key or os.getenv('OPENAI_API_KEY')
        self.openrouter_api_key = openrouter_api_key or os.getenv('OPENROUTER_API_KEY')
        
        self.embeddings = None
        self.vector_store = None
        self.qa_chain = None
        self.llm = None
        
        # Government knowledge base
        self.knowledge_base = self._create_government_knowledge_base()
        
        # Initialize components
        self._initialize_components()
    
    def _create_government_knowledge_base(self) -> List[Document]:
        """Create comprehensive government knowledge base"""
        
        knowledge_docs = [
            # Infrastructure
            Document(
                page_content="""Infrastructure complaints include road maintenance, street lighting, bridge repairs, 
                footpath construction, pothole filling, traffic signals, public building maintenance, and drainage systems. 
                These are handled by the Public Works Department with typical resolution time of 3-7 days for minor issues 
                and 2-4 weeks for major infrastructure projects. Emergency repairs are prioritized within 24 hours.""",
                metadata={"category": "Infrastructure", "department": "Public Works", "priority": "medium"}
            ),
            
            # Water Supply
            Document(
                page_content="""Water supply issues encompass pipe leaks, water quality problems, irregular supply, 
                low pressure, contamination, meter issues, and new connection requests. The Water Supply Department 
                handles these with emergency repairs within 4-6 hours, regular maintenance within 24-48 hours, 
                and new connections within 7-14 days. Water quality testing is conducted regularly.""",
                metadata={"category": "Utilities", "department": "Water Supply", "priority": "high"}
            ),
            
            # Traffic Management
            Document(
                page_content="""Traffic complaints cover signal malfunctions, parking violations, road safety concerns, 
                traffic congestion, accident-prone areas, speed limit violations, and pedestrian safety. Traffic Police 
                Department responds to emergency situations within 30 minutes, signal repairs within 2-4 hours, 
                and implements traffic management solutions within 1-2 weeks.""",
                metadata={"category": "Traffic", "department": "Traffic Police", "priority": "high"}
            ),
            
            # Environment
            Document(
                page_content="""Environmental complaints include air pollution, noise pollution, waste management, 
                illegal dumping, industrial emissions, water pollution, and green space maintenance. Environment Department 
                conducts inspections within 24-48 hours for pollution complaints, implements waste management solutions 
                within 3-5 days, and addresses industrial violations within 1 week.""",
                metadata={"category": "Environment", "department": "Environment", "priority": "medium"}
            ),
            
            # Healthcare
            Document(
                page_content="""Healthcare complaints involve hospital services, medical staff behavior, treatment quality, 
                facility cleanliness, equipment issues, appointment scheduling, and emergency services. Healthcare Department 
                investigates patient complaints within 24 hours, addresses facility issues within 2-3 days, 
                and implements quality improvements within 1-2 weeks.""",
                metadata={"category": "Healthcare", "department": "Healthcare", "priority": "high"}
            ),
            
            # Education
            Document(
                page_content="""Education complaints cover school infrastructure, teacher issues, curriculum problems, 
                student safety, facility maintenance, transportation, and academic quality. Education Department 
                addresses safety concerns within 24 hours, infrastructure issues within 1 week, 
                and academic matters within 2-3 weeks through proper channels.""",
                metadata={"category": "Education", "department": "Education", "priority": "medium"}
            ),
            
            # Government Procedures
            Document(
                page_content="""Government complaint procedures follow a structured process: complaint registration, 
                initial assessment, department assignment, investigation, action plan, implementation, and closure. 
                Citizens receive acknowledgment within 2 hours, status updates every 48 hours, 
                and final resolution notification. Escalation is available for unresolved issues.""",
                metadata={"category": "Procedures", "department": "General Services", "priority": "low"}
            ),
            
            # Emergency Protocols
            Document(
                page_content="""Emergency situations require immediate response: life-threatening issues within 15 minutes, 
                public safety concerns within 30 minutes, infrastructure emergencies within 1 hour, 
                and utility emergencies within 2-4 hours. Emergency hotlines are available 24/7 
                with dedicated response teams for critical situations.""",
                metadata={"category": "Emergency", "department": "Emergency Services", "priority": "critical"}
            )
        ]
        
        return knowledge_docs
    
    def _initialize_components(self):
        """Initialize LangChain components"""
        try:
            if self.openai_api_key:
                # Initialize OpenAI embeddings
                self.embeddings = OpenAIEmbeddings(
                    openai_api_key=self.openai_api_key,
                    model="text-embedding-ada-002"
                )
                
                # Initialize LLM
                self.llm = OpenAI(
                    openai_api_key=self.openai_api_key,
                    temperature=0.7,
                    max_tokens=500
                )
                
                # Create vector store
                self._create_vector_store()
                
                # Create QA chain
                self._create_qa_chain()
                
                logger.info("✅ LangChain RAG system initialized with OpenAI")
                
            else:
                logger.warning("⚠️ OpenAI API key not found, RAG system will use fallback methods")
                
        except Exception as e:
            logger.error(f"❌ Error initializing LangChain components: {e}")
    
    def _create_vector_store(self):
        """Create or load vector store"""
        try:
            vector_store_path = "vector_store.pkl"
            
            if os.path.exists(vector_store_path):
                # Load existing vector store
                with open(vector_store_path, 'rb') as f:
                    self.vector_store = pickle.load(f)
                logger.info("✅ Loaded existing vector store")
            else:
                # Create new vector store
                self.vector_store = FAISS.from_documents(
                    self.knowledge_base, 
                    self.embeddings
                )
                
                # Save vector store
                with open(vector_store_path, 'wb') as f:
                    pickle.dump(self.vector_store, f)
                logger.info("✅ Created and saved new vector store")
                
        except Exception as e:
            logger.error(f"❌ Error creating vector store: {e}")
    
    def _create_qa_chain(self):
        """Create question-answering chain"""
        try:
            # Custom prompt template
            prompt_template = """
            You are an AI assistant for Samadhan AI, a government complaint management system in India.
            Use the following context to provide accurate and helpful responses to citizen complaints.
            
            Context: {context}
            
            Question: {question}
            
            Provide a structured response that includes:
            1. Category classification
            2. Priority level
            3. Responsible department
            4. Expected resolution timeline
            5. Helpful guidance for the citizen
            
            Response:"""
            
            PROMPT = PromptTemplate(
                template=prompt_template,
                input_variables=["context", "question"]
            )
            
            # Create QA chain
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=self.vector_store.as_retriever(
                    search_type="similarity",
                    search_kwargs={"k": 3}
                ),
                return_source_documents=True,
                chain_type_kwargs={"prompt": PROMPT}
            )
            
            logger.info("✅ QA chain created successfully")
            
        except Exception as e:
            logger.error(f"❌ Error creating QA chain: {e}")
    
    def analyze_complaint(self, complaint_text: str, language: str = 'en') -> Dict[str, Any]:
        """Analyze complaint using RAG system"""
        try:
            if not self.qa_chain:
                logger.warning("⚠️ QA chain not available, using fallback analysis")
                return self._fallback_analysis(complaint_text)
            
            # Prepare analysis query
            analysis_query = f"""
            Analyze this government complaint and provide structured information:
            
            Complaint: "{complaint_text}"
            Language: {language}
            
            Please categorize this complaint and provide:
            1. Category (Infrastructure, Utilities, Environment, Traffic, Healthcare, Education, or Other)
            2. Priority (low, medium, high, critical)
            3. Department (Public Works, Water Supply, Environment, Traffic Police, Healthcare, Education, or General Services)
            4. Sentiment (positive, neutral, negative)
            5. Expected resolution timeline
            6. Recommended actions
            """
            
            # Get response from QA chain
            with get_openai_callback() as cb:
                result = self.qa_chain({"query": analysis_query})
            
            # Parse the response
            response_text = result['result']
            source_docs = result.get('source_documents', [])
            
            # Extract structured information
            analysis = self._parse_analysis_response(response_text, complaint_text)
            
            # Add source information
            analysis['source_documents'] = [
                {
                    'content': doc.page_content[:200] + "...",
                    'metadata': doc.metadata
                }
                for doc in source_docs
            ]
            
            # Add token usage info
            analysis['token_usage'] = {
                'total_tokens': cb.total_tokens,
                'prompt_tokens': cb.prompt_tokens,
                'completion_tokens': cb.completion_tokens,
                'total_cost': cb.total_cost
            }
            
            logger.info(f"✅ RAG analysis completed. Tokens used: {cb.total_tokens}")
            return analysis
            
        except Exception as e:
            logger.error(f"❌ RAG analysis error: {e}")
            return self._fallback_analysis(complaint_text)
    
    def _parse_analysis_response(self, response_text: str, complaint_text: str) -> Dict[str, Any]:
        """Parse AI response into structured format"""
        try:
            # Try to extract structured information from response
            lines = response_text.lower().split('\n')
            
            analysis = {
                'category': 'Other',
                'priority': 'medium',
                'department': 'General Services',
                'sentiment': 'neutral',
                'timeline': '3-5 business days',
                'actions': [],
                'confidence': 0.8
            }
            
            # Extract category
            for line in lines:
                if 'category' in line:
                    if 'infrastructure' in line:
                        analysis['category'] = 'Infrastructure'
                        analysis['department'] = 'Public Works'
                    elif 'water' in line or 'utilities' in line:
                        analysis['category'] = 'Utilities'
                        analysis['department'] = 'Water Supply'
                    elif 'traffic' in line:
                        analysis['category'] = 'Traffic'
                        analysis['department'] = 'Traffic Police'
                    elif 'environment' in line:
                        analysis['category'] = 'Environment'
                        analysis['department'] = 'Environment'
                    elif 'health' in line:
                        analysis['category'] = 'Healthcare'
                        analysis['department'] = 'Healthcare'
                    elif 'education' in line:
                        analysis['category'] = 'Education'
                        analysis['department'] = 'Education'
                    break
            
            # Extract priority
            for line in lines:
                if 'priority' in line:
                    if 'critical' in line or 'urgent' in line:
                        analysis['priority'] = 'critical'
                        analysis['timeline'] = '24 hours'
                    elif 'high' in line:
                        analysis['priority'] = 'high'
                        analysis['timeline'] = '1-2 business days'
                    elif 'low' in line:
                        analysis['priority'] = 'low'
                        analysis['timeline'] = '5-7 business days'
                    break
            
            # Extract sentiment
            complaint_lower = complaint_text.lower()
            negative_words = ['angry', 'frustrated', 'terrible', 'worst', 'horrible', 'disgusted', 'furious']
            positive_words = ['thank', 'appreciate', 'good', 'excellent', 'satisfied', 'happy', 'pleased']
            
            if any(word in complaint_lower for word in negative_words):
                analysis['sentiment'] = 'negative'
            elif any(word in complaint_lower for word in positive_words):
                analysis['sentiment'] = 'positive'
            
            # Generate suggested response
            analysis['suggested_response'] = self._generate_response(analysis, complaint_text)
            
            return analysis
            
        except Exception as e:
            logger.error(f"❌ Error parsing analysis response: {e}")
            return self._fallback_analysis(complaint_text)
    
    def _generate_response(self, analysis: Dict[str, Any], complaint_text: str) -> str:
        """Generate appropriate response based on analysis"""
        
        category = analysis['category']
        priority = analysis['priority']
        department = analysis['department']
        timeline = analysis['timeline']
        
        response_templates = {
            'Infrastructure': f"Thank you for reporting this infrastructure issue. We've forwarded your complaint to the {department}. Expected resolution time: {timeline}. Our engineering team will assess the situation and provide updates.",
            
            'Utilities': f"Your utility service complaint has been received by the {department}. We will investigate and resolve this issue within {timeline}. Emergency repairs will be prioritized if this affects essential services.",
            
            'Traffic': f"Your traffic-related complaint has been forwarded to the {department}. They will investigate and take appropriate action within {timeline}. Safety measures will be evaluated and implemented as needed.",
            
            'Environment': f"Your environmental concern has been logged with the {department}. An inspection will be conducted and corrective measures implemented within {timeline}. We take environmental protection seriously.",
            
            'Healthcare': f"Your healthcare complaint has been forwarded to the {department}. A medical officer will review this matter within {timeline}. Patient safety and service quality are our top priorities.",
            
            'Education': f"Your education-related complaint has been sent to the {department}. An educational officer will investigate within {timeline}. Student welfare and educational quality are paramount to us.",
            
            'Other': f"Thank you for your complaint. We have forwarded it to the appropriate department for review. Expected response time: {timeline}. We will keep you updated on the progress."
        }
        
        base_response = response_templates.get(category, response_templates['Other'])
        
        # Add priority-specific messaging
        if priority == 'critical':
            base_response = f"🚨 URGENT: {base_response} This has been marked as critical priority and will receive immediate attention."
        elif priority == 'high':
            base_response = f"⚡ HIGH PRIORITY: {base_response} This will be expedited for faster resolution."
        
        return base_response
    
    def _fallback_analysis(self, complaint_text: str) -> Dict[str, Any]:
        """Fallback rule-based analysis when RAG is not available"""
        text = complaint_text.lower()
        
        # Category detection
        category = 'Other'
        department = 'General Services'
        
        if any(word in text for word in ['road', 'street', 'light', 'bridge', 'footpath', 'pothole']):
            category = 'Infrastructure'
            department = 'Public Works'
        elif any(word in text for word in ['water', 'supply', 'pipe', 'electricity', 'power', 'gas']):
            category = 'Utilities'
            department = 'Water Supply'
        elif any(word in text for word in ['traffic', 'signal', 'parking', 'vehicle', 'accident']):
            category = 'Traffic'
            department = 'Traffic Police'
        elif any(word in text for word in ['garbage', 'pollution', 'environment', 'waste', 'noise']):
            category = 'Environment'
            department = 'Environment'
        elif any(word in text for word in ['health', 'hospital', 'medical', 'doctor', 'clinic']):
            category = 'Healthcare'
            department = 'Healthcare'
        elif any(word in text for word in ['school', 'education', 'teacher', 'student', 'college']):
            category = 'Education'
            department = 'Education'
        
        # Priority detection
        priority = 'medium'
        timeline = '3-5 business days'
        
        if any(word in text for word in ['urgent', 'emergency', 'critical', 'immediate', 'danger']):
            priority = 'critical'
            timeline = '24 hours'
        elif any(word in text for word in ['important', 'serious', 'major', 'significant']):
            priority = 'high'
            timeline = '1-2 business days'
        elif any(word in text for word in ['minor', 'small', 'little', 'slight']):
            priority = 'low'
            timeline = '5-7 business days'
        
        # Sentiment analysis
        sentiment = 'neutral'
        negative_words = ['angry', 'frustrated', 'terrible', 'worst', 'horrible', 'disgusted']
        positive_words = ['thank', 'appreciate', 'good', 'excellent', 'satisfied', 'happy']
        
        if any(word in text for word in negative_words):
            sentiment = 'negative'
        elif any(word in text for word in positive_words):
            sentiment = 'positive'
        
        analysis = {
            'category': category,
            'priority': priority,
            'department': department,
            'sentiment': sentiment,
            'timeline': timeline,
            'confidence': 0.6,
            'source': 'fallback_analysis'
        }
        
        analysis['suggested_response'] = self._generate_response(analysis, complaint_text)
        
        return analysis
    
    def add_document(self, content: str, metadata: Dict[str, Any] = None):
        """Add new document to the knowledge base"""
        try:
            if not self.vector_store:
                logger.warning("⚠️ Vector store not initialized")
                return False
            
            doc = Document(page_content=content, metadata=metadata or {})
            self.vector_store.add_documents([doc])
            
            # Save updated vector store
            with open("vector_store.pkl", 'wb') as f:
                pickle.dump(self.vector_store, f)
            
            logger.info("✅ Document added to knowledge base")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error adding document: {e}")
            return False
    
    def search_similar_complaints(self, query: str, k: int = 5) -> List[Dict[str, Any]]:
        """Search for similar complaints in the knowledge base"""
        try:
            if not self.vector_store:
                return []
            
            docs = self.vector_store.similarity_search(query, k=k)
            
            return [
                {
                    'content': doc.page_content,
                    'metadata': doc.metadata,
                    'similarity_score': 0.8  # Placeholder, FAISS doesn't return scores by default
                }
                for doc in docs
            ]
            
        except Exception as e:
            logger.error(f"❌ Error searching similar complaints: {e}")
            return []