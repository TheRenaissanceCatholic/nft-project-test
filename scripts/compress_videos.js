const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const inputDir = 'output/videos';  // Directory with your processed videos
const outputDir = 'output/compressed_videos';  // Directory for compressed videos
const quality = '23';  // CRF value (18-28, lower = better quality)
const preset = 'medium';  // Encoding preset (slower = better compression)

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Get all video files
const videoFiles = fs.readdirSync(inputDir).filter(file => file.endsWith('.mp4'));

console.log(`Found ${videoFiles.length} videos to compress`);

// Process each video
videoFiles.forEach((file, index) => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    
    // FFmpeg command with good quality settings
    const command = `ffmpeg -i "${inputPath}" -c:v libx264 -crf ${quality} -preset ${preset} -c:a aac -b:a 128k "${outputPath}"`;
    
    console.log(`\nProcessing ${index + 1}/${videoFiles.length}: ${file}`);
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error processing ${file}:`, error);
            return;
        }
        
        // Get file sizes
        const originalSize = fs.statSync(inputPath).size / (1024 * 1024); // Size in MB
        const compressedSize = fs.statSync(outputPath).size / (1024 * 1024); // Size in MB
        const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
        
        console.log(`✅ Completed: ${file}`);
        console.log(`Original size: ${originalSize.toFixed(2)}MB`);
        console.log(`Compressed size: ${compressedSize.toFixed(2)}MB`);
        console.log(`Reduction: ${reduction}%`);
    });
}); 