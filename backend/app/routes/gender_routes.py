# app/routes/gender_routes.py
import os
import base64
import io
import numpy as np
from PIL import Image, ImageOps, ImageEnhance
from flask import Blueprint, request, jsonify
from deepface import DeepFace
import cv2

gender_bp = Blueprint("gender_bp", __name__)

def pil_from_b64(b64str):
    """Convert base64 string to PIL Image"""
    try:
        header, data = b64str.split(",", 1) if "," in b64str else (None, b64str)
        img_data = base64.b64decode(data)
        return Image.open(io.BytesIO(img_data)).convert("RGB")
    except Exception as e:
        print(f"Error decoding base64: {e}")
        return None

def preprocess_face(pil_img):
    """
    Enhanced preprocessing for better gender detection
    """
    try:
        # Convert to numpy array for OpenCV processing
        img_np = np.array(pil_img)
        
        # 1. Apply histogram equalization for better contrast
        img_yuv = cv2.cvtColor(img_np, cv2.COLOR_RGB2YUV)
        img_yuv[:,:,0] = cv2.equalizeHist(img_yuv[:,:,0])
        img_np = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2RGB)
        
        # 2. Denoise the image
        img_np = cv2.fastNlMeansDenoisingColored(img_np, None, 10, 10, 7, 21)
        
        # 3. Sharpen the image
        kernel = np.array([[-1,-1,-1],
                          [-1, 9,-1],
                          [-1,-1,-1]])
        img_np = cv2.filter2D(img_np, -1, kernel)
        
        # Convert back to PIL
        pil_img = Image.fromarray(img_np)
        
        # 4. Enhance brightness and contrast
        enhancer = ImageEnhance.Brightness(pil_img)
        pil_img = enhancer.enhance(1.2)
        
        enhancer = ImageEnhance.Contrast(pil_img)
        pil_img = enhancer.enhance(1.3)
        
        # 5. Resize to optimal size for DeepFace
        pil_img = pil_img.resize((224, 224), Image.Resampling.LANCZOS)
        
        return pil_img
    except Exception as e:
        print(f"Preprocessing error: {e}")
        # Fallback to simple resize
        return pil_img.resize((224, 224), Image.Resampling.LANCZOS)

def analyze_single_frame(img, temp_path, detector_backend='retinaface', model_name='Facenet512'):
    """
    Analyze a single frame with multiple fallback strategies
    """
    results = []
    
    # Try different detector backends in order of accuracy
    detectors = ['retinaface', 'mtcnn', 'opencv', 'ssd']
    
    for detector in detectors:
        try:
            # Save image temporarily
            img.save(temp_path)
            
            # Run DeepFace analysis
            analysis = DeepFace.analyze(
                img_path=temp_path,
                actions=['gender', 'age'],  # Age can help validate results
                detector_backend=detector,
                enforce_detection=True,
                silent=True
            )
            
            # Handle both list and dict responses
            if isinstance(analysis, list):
                analysis = analysis[0]
            
            # Extract gender information
            gender_dict = analysis.get('gender', {})
            
            # DeepFace returns gender as a dict: {'Man': 99.5, 'Woman': 0.5}
            if isinstance(gender_dict, dict):
                man_conf = gender_dict.get('Man', 0)
                woman_conf = gender_dict.get('Woman', 0)
                
                if man_conf > woman_conf:
                    gender = 'man'
                    confidence = man_conf / 100.0
                else:
                    gender = 'woman'
                    confidence = woman_conf / 100.0
            else:
                # Fallback for different response formats
                gender = str(gender_dict).lower()
                confidence = 0.85
            
            # Get face region info for quality check
            region = analysis.get('region', {})
            face_confidence = region.get('confidence', 1.0) if region else 1.0
            
            results.append({
                'gender': gender,
                'confidence': confidence,
                'face_confidence': face_confidence,
                'detector': detector,
                'age': analysis.get('age', None),
                'raw_scores': gender_dict
            })
            
            # If we got a high confidence result, return it
            if confidence > 0.85 and face_confidence > 0.9:
                break
                
        except ValueError as e:
            # No face detected with this detector
            print(f"No face detected with {detector}: {e}")
            continue
        except Exception as e:
            print(f"Error with detector {detector}: {e}")
            continue
    
    return results

@gender_bp.route("/analyze/gender_frames", methods=["POST"])
def analyze_gender_frames():
    """
    Analyze multiple frames and return aggregated gender prediction
    """
    data = request.get_json()
    frames = data.get("frames", [])
    
    if not frames:
        return jsonify({"error": "No frames received"}), 400
    
    print(f"📸 Received {len(frames)} frames for analysis")
    
    # Store all frame results
    all_results = []
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, "frame.jpg")
    
    for idx, b64 in enumerate(frames):
        try:
            # Convert base64 to image
            img = pil_from_b64(b64)
            if img is None:
                print(f"❌ Frame {idx}: Invalid image data")
                continue
            
            # Preprocess the image
            img = preprocess_face(img)
            
            # Analyze this frame
            frame_results = analyze_single_frame(img, temp_path)
            
            if frame_results:
                all_results.extend(frame_results)
                print(f"✅ Frame {idx}: {frame_results[0]['gender']} ({frame_results[0]['confidence']:.2f})")
            else:
                print(f"❌ Frame {idx}: No face detected")
                
        except Exception as e:
            print(f"❌ Frame {idx} error: {e}")
            continue
    
    # Clean up temp file
    if os.path.exists(temp_path):
        try:
            os.remove(temp_path)
        except:
            pass
    
    # Check if we have any results
    if not all_results:
        return jsonify({
            "error": "No valid faces detected in any frame",
            "suggestion": "Please ensure your face is clearly visible and well-lit"
        }), 400
    
    # Aggregate results with weighted voting
    gender_scores = {'man': 0.0, 'woman': 0.0}
    total_weight = 0.0
    
    for result in all_results:
        gender = result['gender']
        confidence = result['confidence']
        face_conf = result['face_confidence']
        
        # Weight by both gender confidence and face detection confidence
        weight = confidence * face_conf
        gender_scores[gender] += weight
        total_weight += weight
    
    # Normalize scores
    if total_weight > 0:
        gender_scores['man'] /= total_weight
        gender_scores['woman'] /= total_weight
    
    # Determine final gender
    final_gender = 'man' if gender_scores['man'] > gender_scores['woman'] else 'woman'
    final_confidence = max(gender_scores['man'], gender_scores['woman'])
    
    # Calculate certainty level
    if final_confidence >= 0.90:
        certainty = "very_high"
    elif final_confidence >= 0.75:
        certainty = "high"
    elif final_confidence >= 0.60:
        certainty = "moderate"
    else:
        certainty = "low"
    
    # Prepare response
    response = {
        "gender": final_gender,
        "confidence": round(final_confidence, 3),
        "certainty": certainty,
        "frames_analyzed": len(frames),
        "successful_detections": len(all_results),
        "gender_scores": {
            "man": round(gender_scores['man'], 3),
            "woman": round(gender_scores['woman'], 3)
        },
        "message": f"Detected as {final_gender} with {certainty} certainty"
    }
    
    # Add warning if confidence is low
    if final_confidence < 0.70:
        response["warning"] = "Low confidence detection. Please try with better lighting and clearer face view."
    
    print(f"\n{'='*60}")
    print(f"🎯 FINAL RESULT: {final_gender.upper()}")
    print(f"📊 Confidence: {final_confidence:.1%}")
    print(f"📈 Scores - Man: {gender_scores['man']:.1%}, Woman: {gender_scores['woman']:.1%}")
    print(f"✅ Successful: {len(all_results)}/{len(frames)} frames")
    print(f"{'='*60}\n")
    
    return jsonify(response)


@gender_bp.route("/analyze/gender_single", methods=["POST"])
def analyze_gender_single():
    """
    Analyze a single image for gender detection
    """
    data = request.get_json()
    image_b64 = data.get("image")
    
    if not image_b64:
        return jsonify({"error": "No image provided"}), 400
    
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, "single_frame.jpg")
    
    try:
        # Convert and preprocess
        img = pil_from_b64(image_b64)
        if img is None:
            return jsonify({"error": "Invalid image data"}), 400
        
        img = preprocess_face(img)
        
        # Analyze
        results = analyze_single_frame(img, temp_path)
        
        # Clean up
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        if not results:
            return jsonify({"error": "No face detected in image"}), 400
        
        # Return best result
        best_result = max(results, key=lambda x: x['confidence'] * x['face_confidence'])
        
        return jsonify({
            "gender": best_result['gender'],
            "confidence": round(best_result['confidence'], 3),
            "detector_used": best_result['detector'],
            "age_estimate": best_result.get('age'),
            "raw_scores": best_result['raw_scores']
        })
        
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


@gender_bp.route("/test/gender", methods=["GET"])
def test_gender():
    """Test endpoint to verify gender detection service"""
    return jsonify({
        "status": "Gender Detection API is running! ✅",
        "endpoints": {
            "/analyze/gender_frames": "POST - Analyze multiple frames",
            "/analyze/gender_single": "POST - Analyze single image",
            "/test/gender": "GET - This test endpoint"
        },
        "supported_detectors": ["retinaface", "mtcnn", "opencv", "ssd"],
        "requirements": "DeepFace, OpenCV, PIL"
    })