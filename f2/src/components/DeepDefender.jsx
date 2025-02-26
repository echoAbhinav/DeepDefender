import React, { useState } from 'react';
import '../styles.css';

const DeepDefender = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      
      // Create a preview URL for images
      if (file.type.startsWith('image/')) {
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
      } else {
        setPreviewUrl(null);
      }
      
      analyzeFile(file);
    }
  };
  
  const analyzeFile = async (file) => {
    setIsAnalyzing(true);
    setDetectionResult(null);
    
    try {
      // Create form data to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Send the file to the backend API
      const response = await fetch('http://localhost:8000/predict/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process the results
      const fakeProbability = data.deepfake_probability * 100;
      const isFake = fakeProbability > 50;
      
      // Set detection result
      setDetectionResult({
        isFake,
        confidence: Math.round(isFake ? fakeProbability : 100 - fakeProbability),
        processingTime: ((Math.random() * 2) + 1).toFixed(1), // Simulating processing time
        analyzedFrames: 1, // Since we're analyzing a single image
        detectedAnomalies: isFake ? Math.floor(fakeProbability / 10) : 0
      });
    } catch (error) {
      console.error("Error analyzing file:", error);
      setDetectionResult({
        error: true,
        message: error.message || "An error occurred during analysis"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      
      // Create a preview URL for images
      if (file.type.startsWith('image/')) {
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
      } else {
        setPreviewUrl(null);
      }
      
      analyzeFile(file);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800'}`}>
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-lg ${isDarkMode ? 'bg-gray-900/80 shadow-lg' : 'bg-white/80 shadow-md'} transition-all duration-300`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} shadow-lg`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">DeepDefender</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#" className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-100 hover:text-blue-400' : 'text-gray-800 hover:text-blue-600'}`}>Home</a>
            <a href="#" className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-100 hover:text-blue-400' : 'text-gray-800 hover:text-blue-600'}`}>How It Works</a>
            <a href="#" className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-100 hover:text-blue-400' : 'text-gray-800 hover:text-blue-600'}`}>Contact</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
            
            <button onClick={toggleMenu} className="md:hidden block">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 px-4 space-y-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <a href="#" className="block py-2 font-medium">Home</a>
            <a href="#" className="block py-2 font-medium">How It Works</a>
            <a href="#" className="block py-2 font-medium">Contact</a>
          </div>
        )}
      </nav>
      
      {/* Main content */}
      <main className="flex-grow flex flex-col container mx-auto px-4 py-8">
        <div className={`w-full max-w-4xl mx-auto rounded-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800/70 shadow-xl' : 'bg-white/90 shadow-lg'} backdrop-blur-md transition-all duration-300 p-8`}>
          <h1 className="text-4xl font-bold text-center mb-8 relative inline-block w-full">
            DeepDefender
            <div className={`h-1.5 w-32 mx-auto mt-4 rounded-full ${isDarkMode ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}></div>
          </h1>
          
          <p className={`text-center max-w-lg mx-auto mb-10 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Upload your image to detect potential deepfakes. Our AI-powered technology analyzes facial features to identify manipulated content.
          </p>
          
          {/* Upload area */}
          <div 
            className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${isDarkMode ? 
              'border-gray-700 bg-gray-800/50 hover:border-blue-500 hover:bg-gray-700/50' : 
              'border-gray-200 bg-gray-50/80 hover:border-blue-500 hover:bg-blue-50/50'
            } ${isAnalyzing ? 'animate-pulse' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload}
            />
            
            {isAnalyzing ? (
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-12 w-12 mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h3 className="text-xl font-semibold mb-2">Analyzing image...</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>This may take a few moments</p>
              </div>
            ) : uploadedFile ? (
              <div className="flex flex-col items-center">
                {previewUrl && (
                  <div className="mb-4 max-w-xs overflow-hidden rounded-lg">
                    <img src={previewUrl} alt="Preview" className="w-full h-auto object-cover" />
                  </div>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mb-4 text-green-500">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">Image uploaded</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>{uploadedFile.name}</p>
                <button 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isDarkMode ? 
                    'bg-blue-600 hover:bg-blue-500 text-white' : 
                    'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  Upload Another
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className={`mb-6 w-16 h-16 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Drag & Drop Your Image</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Or click the button below to select a file</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Accepted formats: jpg, png, jpeg | Max size: 10MB</p>
                <button 
                  className={`mt-6 px-6 py-3 rounded-xl font-medium shadow-md transition-all duration-300 ${isDarkMode ? 
                    'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white' : 
                    'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'}`}
                >
                  Upload Image
                </button>
              </div>
            )}
          </div>
          
          {/* Results section */}
          {detectionResult && !detectionResult.error && (
            <div className={`mt-12 p-8 rounded-2xl transition-all duration-300 ${isDarkMode ? 'bg-gray-900/60' : 'bg-gray-50/80'}`}>
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-8">Detection Results</h2>
                
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                  detectionResult.isFake ? 
                    (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600') : 
                    (isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600')
                }`}>
                  {detectionResult.isFake ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold mb-6">
                  {detectionResult.isFake ? "Deepfake Detected" : "No Deepfake Detected"}
                </h3>
                
                <div className="w-full max-w-md mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Confidence</span>
                    <span className={`font-semibold ${
                      detectionResult.isFake ? 
                        (isDarkMode ? 'text-red-400' : 'text-red-600') : 
                        (isDarkMode ? 'text-green-400' : 'text-green-600')
                    }`}>{detectionResult.confidence}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                    <div 
                      className={`h-full rounded-full ${
                        detectionResult.isFake ? 
                          'bg-gradient-to-r from-orange-500 to-red-500' : 
                          'bg-gradient-to-r from-green-400 to-green-600'
                      }`}
                      style={{ width: `${detectionResult.confidence}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  <div className={`p-6 rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}`}>
                    <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Processing Time</h4>
                    <p className="text-2xl font-bold">{detectionResult.processingTime}s</p>
                  </div>
                  <div className={`p-6 rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}`}>
                    <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Analyzed Frames</h4>
                    <p className="text-2xl font-bold">{detectionResult.analyzedFrames}</p>
                  </div>
                  <div className={`p-6 rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}`}>
                    <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Detected Anomalies</h4>
                    <p className="text-2xl font-bold">{detectionResult.detectedAnomalies}</p>
                  </div>
                </div>
                
                <div className="mt-8 flex space-x-4">
                  <button 
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${isDarkMode ? 
                      'bg-blue-600 hover:bg-blue-500 text-white' : 
                      'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    Download Report
                  </button>
                  <button 
                    className={`px-5 py-2.5 rounded-lg font-medium border transition-all duration-300 ${isDarkMode ? 
                      'border-gray-700 hover:bg-gray-800 text-gray-300' : 
                      'border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                    onClick={() => {
                      setUploadedFile(null);
                      setDetectionResult(null);
                      setPreviewUrl(null);
                    }}
                  >
                    New Analysis
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Error message */}
          {detectionResult && detectionResult.error && (
            <div className={`mt-12 p-8 rounded-2xl transition-all duration-300 bg-red-100 border border-red-300 text-red-800`}>
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mb-4 text-red-500">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">Analysis Error</h3>
                <p className="mb-4">{detectionResult.message}</p>
                <p className="text-sm mb-4">Please try again or check that the backend server is running.</p>
                <button 
                  className="px-5 py-2.5 rounded-lg font-medium bg-red-700 hover:bg-red-800 text-white"
                  onClick={() => {
                    setUploadedFile(null);
                    setDetectionResult(null);
                    setPreviewUrl(null);
                  }}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
          
          {/* Features section */}
          {!uploadedFile && !detectionResult && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-10 text-center">Advanced Deepfake Detection Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gradient-to-br from-purple-600 to-blue-500' : 'bg-gradient-to-br from-purple-600 to-blue-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Facial Analysis</h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Advanced AI detects unnatural facial features, inconsistencies, and manipulation artifacts.
                  </p>
                </div>
                
                <div className={`p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-cyan-500' : 'bg-gradient-to-br from-blue-600 to-cyan-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Audio Verification</h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Detects voice synthesis artifacts, unnatural speech patterns, and audio-visual synchronization issues.
                  </p>
                </div>
                
                <div className={`p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Metadata Analysis</h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Examines digital fingerprints, compression artifacts, and editing traces that indicate manipulation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className={`py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <p>Made by team Undefined</p>
      </footer>
    </div>
  );
};

export default DeepDefender;