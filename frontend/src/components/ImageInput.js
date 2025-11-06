import React, { useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";

function ImageInput({ onResult }) {
  const [useCamera, setUseCamera] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Upload file to backend when "Analyze" is clicked
  const handleAnalyzeUpload = async () => {
    if (!uploadedFile) {
      setError("Please upload an image first");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", uploadedFile);

    try {
      const res = await axios.post("http://localhost:5000/analyze/image", formData);
      onResult(res.data);
      setError("");
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // On file selection
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file");
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be less than 10MB");
      return;
    }
    
    setUploadedFile(file);
    setError("");
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFileUpload({ target: { files: [file] } });
      } else {
        setError("Please drop a valid image file");
      }
    }
  };

  // Capture from webcam and analyze
  const captureAndAnalyze = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      setError("Failed to capture image from webcam");
      return;
    }

    setLoading(true);
    setError("");

    const blob = await (await fetch(imageSrc)).blob();
    const formData = new FormData();
    formData.append("image", blob, "captured.jpg");

    try {
      const res = await axios.post("http://localhost:5000/analyze/image", formData);
      onResult(res.data);
      setError("");
    } catch (err) {
      setError("Failed to analyze captured image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setUploadedFile(null);
    setPreview(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="backdrop-blur-xl rounded-3xl p-8 shadow-2xl transition-all duration-300" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(90, 90, 90, 0.3)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(to bottom right, #5A5A5A, #4A4A4A)' }}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>Image Input</h2>
          <p className="text-sm" style={{ color: '#000000' }}>Upload or capture your image</p>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            setUseCamera((prev) => !prev);
            setUploadedFile(null);
            setPreview(null);
            setError("");
          }}
          className="w-full px-6 py-3 border-2 rounded-xl font-semibold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          style={{ 
            backgroundColor: 'rgba(90, 90, 90, 0.1)', 
            borderColor: 'rgba(90, 90, 90, 0.3)',
            color: '#3A3A3A'
          }}
        >
          {useCamera ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Switch to Upload
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use Camera
            </>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {useCamera ? (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border-2 shadow-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderColor: 'rgba(90, 90, 90, 0.3)' }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                className="w-full rounded-2xl"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm flex items-center gap-2" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#5A5A5A' }}></div>
                  Live Camera
                </div>
              </div>
            </div>
            <button
              onClick={captureAndAnalyze}
              disabled={loading}
              className="w-full px-8 py-4 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              style={{ background: 'linear-gradient(to right, #5A5A5A, #4A4A4A)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  📸 Capture & Analyze
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Upload Area */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="block cursor-pointer"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'scale-105' 
                    : ''
                }`}
                style={{
                  borderColor: dragActive ? '#5A5A5A' : 'rgba(90, 90, 90, 0.3)',
                  backgroundColor: dragActive ? 'rgba(90, 90, 90, 0.1)' : 'transparent'
                }}>
                  {preview ? (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="max-h-80 max-w-full mx-auto rounded-xl shadow-2xl border-2" 
                          style={{ borderColor: 'rgba(90, 90, 90, 0.3)' }}
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            clearImage();
                          }}
                          className="absolute -top-3 -right-3 text-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
                          style={{ backgroundColor: '#5A5A5A' }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-center gap-2 font-semibold" style={{ color: '#3A3A3A' }}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Image ready for analysis
                      </div>
                      <p className="text-sm" style={{ color: '#000000' }}>Click here to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <svg className="w-20 h-20 mx-auto animate-bounce" style={{ color: '#5A5A5A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div>
                        <p className="text-lg mb-2 font-semibold" style={{ color: '#000000' }}>
                          {dragActive ? "Drop your image here!" : "Drag & drop your image here"}
                        </p>
                        <p className="text-sm mb-4" style={{ color: '#000000' }}>or click to browse</p>
                        <div className="inline-block px-6 py-2 border rounded-lg text-sm" style={{ backgroundColor: 'rgba(90, 90, 90, 0.1)', borderColor: 'rgba(90, 90, 90, 0.3)', color: '#3A3A3A' }}>
                          Supports: JPG, PNG, GIF (max 10MB)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>

            <button
              onClick={handleAnalyzeUpload}
              disabled={loading || !uploadedFile}
              className="w-full px-8 py-4 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              style={{ background: 'linear-gradient(to right, #5A5A5A, #4A4A4A)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing your image...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  🧠 Analyze Image
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="border rounded-xl p-4 flex items-center gap-3 animate-shake" style={{ backgroundColor: 'rgba(90, 90, 90, 0.1)', borderColor: 'rgba(90, 90, 90, 0.5)', color: '#5A5A5A' }}>
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="mt-6 border rounded-xl p-5" style={{ backgroundColor: 'rgba(90, 90, 90, 0.05)', borderColor: 'rgba(90, 90, 90, 0.3)' }}>
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#3A3A3A' }}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Tips for best results
        </h4>
        <ul className="text-xs space-y-2" style={{ color: '#000000' }}>
          <li className="flex items-start gap-2">
            <span className="mt-0.5" style={{ color: '#5A5A5A' }}>•</span>
            <span>Use clear, well-lit photos with good contrast</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5" style={{ color: '#5A5A5A' }}>•</span>
            <span>Face should be clearly visible and centered</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5" style={{ color: '#5A5A5A' }}>•</span>
            <span>Avoid heavy filters or editing for accurate results</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5" style={{ color: '#5A5A5A' }}>•</span>
            <span>Front-facing photos work best</span>
          </li>
        </ul>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default ImageInput;