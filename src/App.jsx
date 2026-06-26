import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  Settings, 
  Copy, 
  CheckCircle2, 
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Clock,
  Loader2,
  Menu,
  UploadCloud,
  X
} from 'lucide-react';

export default function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState('lesson-plan');
  const [copiedText, setCopiedText] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const [formData, setFormData] = useState({
    level: 'university',
    subject: '',
    topic: '',
    curriculum: 'nuc',
    duration: '2 hours',
    context: ''
  });

  const [aiResponse, setAiResponse] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, we would process/upload these files. Here we just store the names.
    const newFiles = files.map(file => ({ name: file.name, type: file.type }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (indexToRemove) => {
    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.topic) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation delay (connecting to n8n & Gemini)
    setTimeout(() => {
      setAiResponse({
        lessonPlan: `## Lesson Plan: ${formData.topic}\n\n**Subject:** ${formData.subject}\n**Level:** ${formData.level.toUpperCase()}\n**Duration:** ${formData.duration}\n\n### 🎯 Objectives\nBy the end of this session, students will be able to:\n1. Define the core concepts of ${formData.topic}.\n2. Apply the principles to real-world Nigerian contexts.\n3. Analyze standard case studies within the ${formData.curriculum.toUpperCase()} framework.\n\n### 📝 Structure\n- **Introduction (15 mins):** Hook students with a local scenario.\n- **Core Concept Delivery (45 mins):** Interactive lecture and Q&A.\n- **Group Activity (30 mins):** Breakout sessions analyzing a case study.\n- **Conclusion & Assessment (30 mins):** Quick quiz and assignment brief.\n\n### 🛠 Resources Needed\n- Projector, Whiteboard, Printed Case Studies.`,
        
        lectureNotes: `## Lecture Notes: ${formData.topic}\n\n### 1. Introduction to the Topic\nWelcome everyone. Today we are diving into ${formData.topic}. This is a critical foundation for your understanding of ${formData.subject}.\n\n### 2. Core Principles\n* **Principle A:** This involves the theoretical framework...\n* **Principle B:** Often seen in local industries, for example...\n\n### 3. Real-World Application (Nigeria Context)\nConsider how this applies in Lagos or Abuja. When dealing with infrastructural constraints or market dynamics, ${formData.topic} becomes highly relevant because...\n\n### 4. Summary & Key Takeaways\nRemember the three pillars we discussed today. Next week, we will build upon this foundation.`,
        
        canvaPrompts: `## Canva Slide Generation Prompts\n*Use these prompts in Canva's Magic Design or text-to-image tools to build your deck instantly.*\n\n**Slide 1: Title Slide**\n- **Text:** "${formData.topic} - A Comprehensive Overview"\n- **Visual Concept:** Minimalist corporate tech background with a subtle Nigerian motif.\n\n**Slide 2: The Core Problem**\n- **Text:** "Why does this matter?"\n- **Visual Concept:** Generate an image of a bustling African market or a modern university lab to show real-world application.\n\n**Slide 3: The 3 Pillars**\n- **Text:** "Foundation, Application, Evaluation"\n- **Visual Concept:** A clean, 3-column infographic with modern icons (use Canva elements: 'foundation icon', 'rocket icon', 'chart icon').`
      });
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2500);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const resetForm = () => {
    setIsGenerated(false);
    setAiResponse(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            EduPilot
          </span>
          <span className="hidden md:inline ml-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
            Educator Co-Pilot MVP
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="hidden md:flex items-center space-x-2 text-slate-600 hover:text-blue-600 font-medium transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
            TA
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Form */}
        <div className={`lg:col-span-4 transition-all duration-500 ${isGenerated ? 'opacity-70 pointer-events-none hidden lg:block' : 'col-span-1 lg:col-span-6 lg:col-start-4'}`}>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Lesson Materials</h1>
              <p className="text-slate-500 text-sm">Let Gemini structure your curriculum and slide concepts instantly.</p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Education Level</label>
                  <select 
                    name="level" 
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="primary">Primary School</option>
                    <option value="secondary">Secondary School</option>
                    <option value="polytechnic">Polytechnic</option>
                    <option value="university">University</option>
                    <option value="corporate">Corporate Training</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Curriculum</label>
                  <select 
                    name="curriculum" 
                    value={formData.curriculum}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="waec">WAEC / NECO</option>
                    <option value="nuc">NUC Standard</option>
                    <option value="cambridge">Cambridge IGCSE</option>
                    <option value="custom">Custom / None</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject / Course Name</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Introduction to Computer Science"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specific Topic</label>
                <input 
                  type="text" 
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  placeholder="e.g., Data Structures and Algorithms"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                   <label className="block text-sm font-medium text-slate-700 mb-1">Class Duration</label>
                   <input 
                    type="text" 
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 hours"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Offline Reference Material Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Source Material (Photos / PDFs)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors relative">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label className="relative cursor-pointer rounded-md bg-transparent font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input type="file" multiple accept="image/*,.pdf" className="sr-only" onChange={handleFileUpload} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">Snap photos of textbook pages to base lessons on them.</p>
                  </div>
                </div>
                
                {/* Display uploaded files */}
                {uploadedFiles.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="flex items-center justify-between text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-md border border-blue-100">
                        <span className="truncate flex-1 font-medium">{file.name}</span>
                        <button type="button" onClick={() => removeFile(index)} className="ml-2 text-blue-500 hover:text-blue-700">
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Additional Context (Optional)</label>
                <textarea 
                  name="context"
                  value={formData.context}
                  onChange={handleInputChange}
                  placeholder="Add specific requirements, local examples to include, or student demographics..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-24 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isGenerating || !formData.subject || !formData.topic}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Orchestrating AI Workflow...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Materials</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Output / Results */}
        {isGenerated && aiResponse && (
          <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
              
              {/* Output Header & Tabs */}
              <div className="bg-slate-50 border-b border-slate-200 px-2 pt-2">
                <div className="flex items-center justify-between px-4 pb-4 pt-2">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                    Generation Complete
                  </h2>
                  <button 
                    onClick={resetForm}
                    className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors"
                  >
                    Start New
                  </button>
                </div>
                
                <div className="flex space-x-1 px-2">
                  <button 
                    onClick={() => setActiveTab('lesson-plan')}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'lesson-plan' ? 'bg-white text-blue-600 border-t border-l border-r border-slate-200 shadow-sm relative top-[1px]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Lesson Plan
                  </button>
                  <button 
                    onClick={() => setActiveTab('lecture-notes')}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'lecture-notes' ? 'bg-white text-blue-600 border-t border-l border-r border-slate-200 shadow-sm relative top-[1px]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Lecture Notes
                  </button>
                  <button 
                    onClick={() => setActiveTab('canva-prompts')}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'canva-prompts' ? 'bg-white text-blue-600 border-t border-l border-r border-slate-200 shadow-sm relative top-[1px]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Canva Prompts
                  </button>
                </div>
              </div>

              {/* Output Content Area */}
              <div className="p-6 md:p-8 flex-grow overflow-y-auto bg-white relative group">
                <button 
                  onClick={() => copyToClipboard(
                    activeTab === 'lesson-plan' ? aiResponse.lessonPlan : 
                    activeTab === 'lecture-notes' ? aiResponse.lectureNotes : 
                    aiResponse.canvaPrompts
                  )}
                  className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center space-x-2 text-sm font-medium shadow-sm"
                  title="Copy to clipboard"
                >
                  {copiedText ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedText ? 'Copied!' : 'Copy'}</span>
                </button>

                <div className="prose prose-slate max-w-none">
                  {/* Simulated Markdown Rendering */}
                  {(activeTab === 'lesson-plan' ? aiResponse.lessonPlan : 
                    activeTab === 'lecture-notes' ? aiResponse.lectureNotes : 
                    aiResponse.canvaPrompts).split('\n').map((line, index) => {
                      if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold text-slate-800 mt-6 mb-4">{line.replace('## ', '')}</h2>;
                      if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold text-slate-800 mt-5 mb-3">{line.replace('### ', '')}</h3>;
                      if (line.startsWith('**') && line.includes('**', 2)) return <p key={index} className="mb-2"><strong className="text-slate-800">{line.replace(/\*\*/g, '')}</strong></p>;
                      if (line.startsWith('- ') || line.startsWith('* ')) return <li key={index} className="ml-4 mb-1 text-slate-600">{line.substring(2).replace(/\*\*/g, '')}</li>;
                      if (line.match(/^\d+\./)) return <li key={index} className="ml-4 mb-1 text-slate-600 list-decimal">{line.substring(3).replace(/\*\*/g, '')}</li>;
                      if (line.trim() === '') return <br key={index} />;
                      return <p key={index} className="mb-4 text-slate-600 leading-relaxed">{line.replace(/\*\*/g, '')}</p>;
                  })}
                </div>
              </div>

              {/* Bottom Action Bar (Canva Workflow) */}
              {activeTab === 'canva-prompts' && (
                <div className="bg-indigo-50 border-t border-indigo-100 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h4 className="font-bold text-indigo-900 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Ready to design?
                    </h4>
                    <p className="text-sm text-indigo-700 mt-1">Copy the prompts above and paste them directly into Canva's Magic Design.</p>
                  </div>
                  <a 
                    href="https://www.canva.com/presentations/templates/" 
                    target="_blank"
                    rel="noreferrer"
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Open Canva Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}