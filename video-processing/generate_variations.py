import cv2
import numpy as np
import os
import random
from pathlib import Path
import json

def generate_color_variation(video_path, output_path, hue_shift, saturation_scale, value_scale):
    """
    Generate a color variation of a video by adjusting HSV values
    """
    # Read the video
    cap = cv2.VideoCapture(video_path)
    
    # Get video properties
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    # Create output video writer
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        # Convert to HSV
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        
        # Apply color transformations
        hsv[:,:,0] = (hsv[:,:,0] + hue_shift) % 180  # Hue shift
        hsv[:,:,1] = np.clip(hsv[:,:,1] * saturation_scale, 0, 255)  # Saturation scale
        hsv[:,:,2] = np.clip(hsv[:,:,2] * value_scale, 0, 255)  # Value scale
        
        # Convert back to BGR
        modified_frame = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
        
        # Write the frame
        out.write(modified_frame)
    
    # Release everything
    cap.release()
    out.release()

def generate_metadata(variation_id, hue_shift, saturation_scale, value_scale):
    """
    Generate metadata for a video variation
    """
    # Convert HSV values to more readable color descriptions
    hue_name = get_hue_name(hue_shift)
    saturation_level = "High" if saturation_scale > 1.2 else "Low" if saturation_scale < 0.8 else "Normal"
    brightness_level = "Bright" if value_scale > 1.2 else "Dark" if value_scale < 0.8 else "Normal"
    
    return {
        "name": f"Rose NFT #{variation_id}",
        "description": f"A unique rose variation with {hue_name} petals, {saturation_level} saturation, and {brightness_level} brightness",
        "animation_url": f"ipfs://YOUR_VIDEO_CID_{variation_id}/rose_{variation_id}.mp4",
        "content_type": "video/mp4",
        "attributes": [
            {
                "trait_type": "Color",
                "value": hue_name
            },
            {
                "trait_type": "Saturation",
                "value": saturation_level
            },
            {
                "trait_type": "Brightness",
                "value": brightness_level
            },
            {
                "trait_type": "Duration",
                "value": "20 seconds"
            }
        ]
    }

def get_hue_name(hue_shift):
    """
    Convert hue shift to color name
    """
    hue = (hue_shift % 180) / 180.0
    if 0 <= hue < 0.083:
        return "Red"
    elif 0.083 <= hue < 0.167:
        return "Orange"
    elif 0.167 <= hue < 0.25:
        return "Yellow"
    elif 0.25 <= hue < 0.417:
        return "Green"
    elif 0.417 <= hue < 0.583:
        return "Cyan"
    elif 0.583 <= hue < 0.75:
        return "Blue"
    elif 0.75 <= hue < 0.917:
        return "Purple"
    else:
        return "Pink"

def main():
    # Create output directories
    output_dir = Path("output/videos")
    metadata_dir = Path("output/metadata")
    output_dir.mkdir(parents=True, exist_ok=True)
    metadata_dir.mkdir(parents=True, exist_ok=True)
    
    # Input video path
    input_video = "input/rose.mp4"  # You'll need to put your video here
    
    # Generate 5 test variations
    for i in range(1, 6):
        # Generate random color variations
        hue_shift = random.randint(0, 180)  # Full hue range
        saturation_scale = random.uniform(0.7, 1.3)  # Saturation variation
        value_scale = random.uniform(0.7, 1.3)  # Brightness variation
        
        print(f"\nGenerating variation {i}/5")
        print(f"Hue shift: {hue_shift}")
        print(f"Saturation scale: {saturation_scale:.2f}")
        print(f"Brightness scale: {value_scale:.2f}")
        
        # Generate video variation
        output_path = output_dir / f"rose_{i}.mp4"
        generate_color_variation(input_video, str(output_path), hue_shift, saturation_scale, value_scale)
        
        # Generate metadata
        metadata = generate_metadata(i, hue_shift, saturation_scale, value_scale)
        
        # Save metadata
        with open(metadata_dir / f"{i}.json", "w") as f:
            json.dump(metadata, f, indent=2)
        
        print(f"Generated variation {i}/5")

if __name__ == "__main__":
    main() 