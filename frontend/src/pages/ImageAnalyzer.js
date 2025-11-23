import React, { useState, useRef } from "react";
import ImageInput from "../components/ImageInput";
import ResultsChart from "../components/ImageResultsChart";
import Webcam from "react-webcam";

const ImageAnalyzer = () => {
  const [result, setResult] = useState(null);
  const [usingWebcam, setUsingWebcam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const webcamRef = useRef(null);

  // Capture multiple frames from webcam
  const captureFrames = async (count = 8, delay = 150) => {
    const frames = [];
    for (let i = 0; i < count; i++) {
      const frame = webcamRef.current.getScreenshot();
      if (frame) frames.push(frame);
      await new Promise((r) => setTimeout(r, delay));
    }
    return frames;
  };

  // Call backend API
  const analyzeGender = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const frames = await captureFrames();
      const res = await fetch("http://127.0.0.1:5000/analyze/gender_frames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frames }),
      });

      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || "Analysis failed.");
    } catch (e) {
      setError("Failed to connect to backend.");
    }

    setLoading(false);
  };

  // Download as PDF (Text format)
  const downloadPDF = () => {
    const timestamp = new Date().toLocaleString();
    const content = `
GENDER ANALYSIS REPORT
Generated: ${timestamp}
${'='.repeat(60)}

ANALYSIS RESULTS
----------------
Detected Gender: ${result.gender === "uncertain" ? "Uncertain" : result.gender.toUpperCase()}
Confidence Level: ${(result.confidence * 100).toFixed(1)}%

DETAILED BREAKDOWN
------------------
${result.frame_genders ? result.frame_genders.map((frame, idx) => 
  `Frame ${idx + 1}: ${frame.gender} (${(frame.confidence * 100).toFixed(1)}%)`
).join('\n') : 'No frame data available'}

${'='.repeat(60)}
Analysis Method: AI-Powered Facial Recognition
Privacy: All data processed securely and not stored
${'='.repeat(60)}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gender_analysis_report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download as CSV
  const downloadCSV = () => {
    let csv = 'Analysis Type,Result,Confidence,Timestamp\n';
    const timestamp = new Date().toLocaleString();
    
    // Main result
    csv += `Gender Analysis,"${result.gender === "uncertain" ? "Uncertain" : result.gender.toUpperCase()}",${(result.confidence * 100).toFixed(1)}%,"${timestamp}"\n`;
    
    // Frame details if available
    if (result.frame_genders) {
      csv += '\nFrame Number,Detected Gender,Confidence\n';
      result.frame_genders.forEach((frame, idx) => {
        csv += `${idx + 1},"${frame.gender}",${(frame.confidence * 100).toFixed(1)}%\n`;
      });
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gender_analysis_report_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download as Excel (HTML table format)
  const downloadExcel = () => {
    const timestamp = new Date().toLocaleString();
    const htmlContent = `
      <html xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head>
        <meta charset="UTF-8">
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Gender Analysis</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #5A5A5A; color: white; font-weight: bold; }
          .header { background-color: #f0f0f0; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>Gender Analysis Report</h2>
        <p><strong>Generated:</strong> ${timestamp}</p>
        
        <h3>Summary</h3>
        <table>
          <tr>
            <td class="header">Detected Gender</td>
            <td>${result.gender === "uncertain" ? "Uncertain" : result.gender.toUpperCase()}</td>
          </tr>
          <tr>
            <td class="header">Confidence Level</td>
            <td>${(result.confidence * 100).toFixed(1)}%</td>
          </tr>
          <tr>
            <td class="header">Analysis Method</td>
            <td>AI-Powered Facial Recognition</td>
          </tr>
        </table>
        
        ${result.frame_genders ? `
        <h3>Frame-by-Frame Analysis</h3>
        <table>
          <thead>
            <tr>
              <th>Frame Number</th>
              <th>Detected Gender</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            ${result.frame_genders.map((frame, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${frame.gender}</td>
                <td>${(frame.confidence * 100).toFixed(1)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : ''}
        
        <br/>
        <p><em>Privacy Note: All data processed securely and not stored</em></p>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gender_analysis_report_${Date.now()}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-20 pb-12" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg" style={{ backgroundColor: '#5A5A5A' }}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4" style={{ color: '#000000' }}>
            Image Analyzer
          </h1>

          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#000000' }}>
            Discover personality traits through facial expressions and visual analysis
          </p>

          {/* Info Cards */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="backdrop-blur-sm rounded-xl px-6 py-3 transition-all" style={{ backgroundColor: 'rgba(200, 200, 200, 0.2)', border: '1px solid rgba(90, 90, 90, 0.3)' }}>
              <div className="font-bold text-lg" style={{ color: '#3A3A3A' }}>AI Powered</div>
              <div className="text-xs" style={{ color: '#000000' }}>Advanced Detection</div>
            </div>
            <div className="backdrop-blur-sm rounded-xl px-6 py-3 transition-all" style={{ backgroundColor: 'rgba(200, 200, 200, 0.2)', border: '1px solid rgba(90, 90, 90, 0.3)' }}>
              <div className="font-bold text-lg" style={{ color: '#4A4A4A' }}>Real-time</div>
              <div className="text-xs" style={{ color: '#000000' }}>Instant Results</div>
            </div>
            <div className="backdrop-blur-sm rounded-xl px-6 py-3 transition-all" style={{ backgroundColor: 'rgba(200, 200, 200, 0.2)', border: '1px solid rgba(90, 90, 90, 0.3)' }}>
              <div className="font-bold text-lg" style={{ color: '#5A5A5A' }}>Secure</div>
              <div className="text-xs" style={{ color: '#000000' }}>Privacy First</div>
            </div>
          </div>
        </div>

        {/* Webcam / Upload Section */}
        <div className="space-y-8 animate-slideIn">
          <div className="flex flex-col items-center space-y-6">
            {!usingWebcam ? (
              <>
                <ImageInput onResult={setResult} />
                <button
                  onClick={() => setUsingWebcam(true)}
                  className="px-8 py-3 rounded-full font-semibold text-white shadow-lg hover:scale-105 transition-all"
                  style={{ background: 'linear-gradient(to right, #5A5A5A, #4A4A4A)' }}
                >
                  Use Live Camera
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="rounded-3xl shadow-lg mb-4"
                  style={{ border: '4px solid #5A5A5A' }}
                  width={480}
                  height={360}
                />
                <div className="flex gap-4">
                  <button
                    onClick={analyzeGender}
                    disabled={loading}
                    className="px-8 py-3 rounded-full font-semibold text-white shadow-lg hover:scale-105 transition-all"
                    style={{ background: 'linear-gradient(to right, #4A4A4A, #5A5A5A)' }}
                  >
                    {loading ? "Analyzing..." : "Analyze Gender"}
                  </button>
                  <button
                    onClick={() => setUsingWebcam(false)}
                    className="px-8 py-3 rounded-full font-semibold transition-all"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.5)', 
                      border: '1px solid rgba(90, 90, 90, 0.3)',
                      color: '#000000'
                    }}
                  >
                    Back to Upload
                  </button>
                </div>
              </div>
            )}
          </div>
          {error && (
            <p className="mt-3 font-medium text-center" style={{ color: '#5A5A5A' }}>
              {error}
            </p>
          )}

          {/* Results Section */}
          {result && (
            <div className="animate-fadeIn">
              <ResultsChart result={result} />
              <div className="text-center mt-6 backdrop-blur-md p-6 rounded-2xl" style={{ backgroundColor: 'rgba(200, 200, 200, 0.2)', border: '1px solid rgba(90, 90, 90, 0.3)' }}>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#3A3A3A' }}>Gender Analysis Result</h3>
                <p className="text-lg" style={{ color: '#000000' }}>
                  Detected Gender:{" "}
                  <span className="font-semibold" style={{ color: '#000000' }}>
                    {result.gender === "uncertain" ? "Uncertain" : result.gender.toUpperCase()}
                  </span>
                </p>
                <p style={{ color: '#000000' }}>
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </p>
              </div>

              {/* Download Options */}
              <div className="mt-8 backdrop-blur-md p-6 rounded-2xl" style={{ backgroundColor: 'rgba(200, 200, 200, 0.2)', border: '1px solid rgba(90, 90, 90, 0.3)' }}>
                <h3 className="text-xl font-bold mb-4 text-center" style={{ color: '#3A3A3A' }}>
                  📥 Download Analysis Report
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* PDF Download */}
                  <button
                    onClick={downloadPDF}
                    className="flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-white shadow-lg hover:scale-105 transition-all"
                    style={{ background: 'linear-gradient(to right, #DC2626, #B91C1C)' }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Download PDF</span>
                  </button>

                  {/* Excel Download */}
                  <button
                    onClick={downloadExcel}
                    className="flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-white shadow-lg hover:scale-105 transition-all"
                    style={{ background: 'linear-gradient(to right, #059669, #047857)' }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download Excel</span>
                  </button>

                  {/* CSV Download */}
                  <button
                    onClick={downloadCSV}
                    className="flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-white shadow-lg hover:scale-105 transition-all"
                    style={{ background: 'linear-gradient(to right, #2563EB, #1D4ED8)' }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Download CSV</span>
                  </button>
                </div>
                <p className="text-center mt-4 text-sm" style={{ color: '#5A5A5A' }}>
                  💡 Choose your preferred format to save the analysis results
                </p>
              </div>
            </div>
          )}
        </div>

        {/* How it Works + Privacy sections remain unchanged */}
        {!result && (
          <div className="mt-16 backdrop-blur-xl rounded-3xl p-8 animate-fadeIn" style={{ backgroundColor: 'rgba(200, 200, 200, 0.2)', border: '1px solid rgba(90, 90, 90, 0.3)' }}>
            <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-3" style={{ color: '#000000' }}>
              <svg className="w-7 h-7" style={{ color: '#5A5A5A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How It Works
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(to bottom right, rgba(90, 90, 90, 0.2), rgba(74, 74, 74, 0.2))', border: '1px solid rgba(90, 90, 90, 0.3)' }}>
                  <span className="text-3xl">📸</span>
                </div>
                <h4 className="font-semibold mb-2" style={{ color: '#000000' }}>1. Upload or Capture</h4>
                <p className="text-sm" style={{ color: '#000000' }}>Choose an image or enable your webcam for live analysis.</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(to bottom right, rgba(74, 74, 74, 0.2), rgba(90, 90, 90, 0.2))', border: '1px solid rgba(90, 90, 90, 0.3)' }}>
                  <span className="text-3xl">🧠</span>
                </div>
                <h4 className="font-semibold mb-2" style={{ color: '#000000' }}>2. AI Analysis</h4>
                <p className="text-sm" style={{ color: '#000000' }}>AI detects gender and expressions from your live feed.</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(to bottom right, rgba(90, 90, 90, 0.2), rgba(74, 74, 74, 0.2))', border: '1px solid rgba(90, 90, 90, 0.3)' }}>
                  <span className="text-3xl">📊</span>
                </div>
                <h4 className="font-semibold mb-2" style={{ color: '#000000' }}>3. Get Results</h4>
                <p className="text-sm" style={{ color: '#000000' }}>See accurate gender predictions and analysis instantly.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-2xl p-6" style={{ backgroundColor: 'rgba(90, 90, 90, 0.1)', border: '1px solid rgba(90, 90, 90, 0.3)' }}>
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#5A5A5A' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold mb-2" style={{ color: '#000000' }}>🔒 Privacy & Security</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#000000' }}>
                Your images and camera feed are processed securely and never stored. All analysis is done in real time.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideIn { animation: slideIn 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default ImageAnalyzer;