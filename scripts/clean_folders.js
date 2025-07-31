const fs = require('fs');
const path = require('path');

// Folders to clean
const folders = [
    'video-processing/output/videos',
    'video-processing/output/metadata'
];

// Clean each folder
folders.forEach(folder => {
    if (fs.existsSync(folder)) {
        console.log(`Cleaning folder: ${folder}`);
        const files = fs.readdirSync(folder);
        
        files.forEach(file => {
            const filePath = path.join(folder, file);
            fs.unlinkSync(filePath);
            console.log(`Deleted: ${file}`);
        });
        
        console.log(`✅ Cleaned ${folder}`);
    } else {
        console.log(`Folder doesn't exist: ${folder}`);
    }
});

console.log('\nAll folders cleaned!'); 