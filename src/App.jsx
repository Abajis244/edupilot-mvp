import React, { useState } from 'react';
import { 
  BarChart3, 
  Target, 
  Sparkles, 
  Settings, 
  Copy, 
  CheckCircle2, 
  ArrowRight,
  FileSpreadsheet,
  Image as ImageIcon,
  Loader2,
  UploadCloud,
  X
} from 'lucide-react';

export default function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState('gap-report');
  const [copiedText, setCopiedText] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    diagnosticData: 'Q4 (Fraction to Decimal): 62% Incorrect\nQ7 (Finding LCM): 45% Incorrect\nQ10 (Word Problems): 80% Incorrect',
  });

  const [aiResponse, setAiResponse] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({ name: file.name }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (indexToRemove) => {
    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const generateWithGemini = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.diagnosticData) return;
    
    setIsGenerating(true);

    // Retrieve the API key from Vite environment variables
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!API_KEY) {
      alert("Missing VITE_GEMINI_API_KEY. Please add it to your environment variables.");
      setIsGenerating(false);
      return;
    }

    const prompt = `
      You are a Formative Assessment Specialist in Nigeria. Analyze the following diagnostic quiz data.
      Subject: ${formData.subject}
      Topic: ${formData.topic}
      Assessment Data: ${formData.diagnosticData}

      Return a raw JSON object with EXACTLY these three keys containing markdown-formatted strings:
      {
        "gapReport": "A concise, actionable analysis of the class's learning gaps based on the data.",
        "interventionLesson": "A short, targeted micro-lesson plan designed specifically to remediate only the gaps identified. Do not write a general lesson.",
        "canvaPrompts": "Provide 3 specific text-to-image prompts for Canva to create visual aids addressing these specific gaps."
      }
    `;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const data = await response.json();
      const jsonText = data.candidates[0].content.parts[0].text;
      
      // Clean potential markdown backticks from the API response
      const cleanedJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
      setAiResponse(JSON.parse(cleanedJson));
      setIsGenerated(true);
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate content. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
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
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            EduPilot
          </span>
          <span className="hidden md:inline ml-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
            Diagnostic MVP
          </span>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className={`lg:col-span-4 transition-all duration-500 ${isGenerated ? 'opacity-70 pointer-events-none hidden lg:block' : 'col-span-1 lg:col-span-6 lg:col-start-4'}`}>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Diagnostic Intervention</h1>
              <p className="text-slate-500 text-sm">Turn today's quiz data into tomorrow's targeted lesson plan.</p>
            </div>

            <form onSubmit={generateWithGemini} className="space-y-5">
              
              {/* File Upload (UI Mock for scanning) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Scanned Bubble Sheets</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors relative">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label className="relative cursor-pointer rounded-md bg-transparent font-medium text-blue-600 hover:text-blue-500">
                        <span>Select files</span>
                        <input type="file" multiple accept="image/*,.csv" className="sr-only" onChange={handleFileUpload} />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">Offline OCR sync ready.</p>
                  </div>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="flex items-center justify-between text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-md border border-blue-100">
                        <span className="truncate flex-1 font-medium">{file.name}</span>
                        <button type="button" onClick={() => removeFile(index)} className="ml-2 text-blue-500">
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input 
                  type="text" name="subject" value={formData.subject} onChange={handleInputChange}
                  placeholder="e.g., JSS2 Mathematics"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assessed Topic</label>
                <input 
                  type="text" name="topic" value={formData.topic} onChange={handleInputChange}
                  placeholder="e.g., Fractions & Decimals"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">OCR Diagnostic Output (Simulated)</label>
                <textarea 
                  name="diagnosticData" value={formData.diagnosticData} onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-24 resize-none font-mono text-xs"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isGenerating || !formData.subject || !formData.diagnosticData}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing Gaps...</span>
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5" />
                    <span>Generate Intervention Plan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {isGenerated && aiResponse && (
          <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
              
              <div className="bg-slate-50 border-b border-slate-200 px-2 pt-2">
                <div className="flex items-center justify-between px-4 pb-4 pt-2">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                    Analysis Complete
                  </h2>
                  <button onClick={resetForm} className="text-sm text-slate-500 hover:text-blue-600 font-medium">Start New</button>
                </div>
                
                <div className="flex space-x-1 px-2">
                  <button onClick={() => setActiveTab('gap-report')} className={`flex items-center px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'gap-report' ? 'bg-white text-blue-600 border-t border-l border-r border-slate-200 relative top-[1px]' : 'text-slate-500 hover:bg-slate-100'}`}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Gap Report
                  </button>
                  <button onClick={() => setActiveTab('intervention')} className={`flex items-center px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'intervention' ? 'bg-white text-blue-600 border-t border-l border-r border-slate-200 relative top-[1px]' : 'text-slate-500 hover:bg-slate-100'}`}>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Intervention Lesson
                  </button>
                  <button onClick={() => setActiveTab('canva-prompts')} className={`flex items-center px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'canva-prompts' ? 'bg-white text-blue-600 border-t border-l border-r border-slate-200 relative top-[1px]' : 'text-slate-500 hover:bg-slate-100'}`}>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Canva Visuals
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8 flex-grow overflow-y-auto bg-white relative group">
                <button onClick={() => copyToClipboard(activeTab === 'gap-report' ? aiResponse.gapReport : activeTab === 'intervention' ? aiResponse.interventionLesson : aiResponse.canvaPrompts)} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center space-x-2 text-sm shadow-sm">
                  {copiedText ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedText ? 'Copied!' : 'Copy'}</span>
                </button>

                <div className="prose prose-slate max-w-none">
                  {(activeTab === 'gap-report' ? aiResponse.gapReport : activeTab === 'intervention' ? aiResponse.interventionLesson : aiResponse.canvaPrompts).split('\n').map((line, index) => {
                      if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold text-slate-800 mt-6 mb-4">{line.replace('## ', '')}</h2>;
                      if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold text-slate-800 mt-5 mb-3">{line.replace('### ', '')}</h3>;
                      if (line.startsWith('**') && line.includes('**', 2)) return <p key={index} className="mb-2"><strong className="text-slate-800">{line.replace(/\*\*/g, '')}</strong></p>;
                      if (line.startsWith('- ') || line.startsWith('* ')) return <li key={index} className="ml-4 mb-1 text-slate-600">{line.substring(2).replace(/\*\*/g, '')}</li>;
                      if (line.trim() === '') return <br key={index} />;
                      return <p key={index} className="mb-4 text-slate-600 leading-relaxed">{line.replace(/\*\*/g, '')}</p>;
                  })}
                </div>
              </div>

              {activeTab === 'canva-prompts' && (
                <div className="bg-indigo-50 border-t border-indigo-100 p-4 flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h4 className="font-bold text-indigo-900 flex items-center"><Sparkles className="w-4 h-4 mr-2" />Ready for Canva</h4>
                    <p className="text-sm text-indigo-700 mt-1">Paste these targeted prompts into Canva's AI generator.</p>
                  </div>
                  <a href="https://www.canva.com" target="_blank" rel="noreferrer" className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm flex items-center justify-center space-x-2">
                    <span>Open Canva</span><ArrowRight className="w-4 h-4" />
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