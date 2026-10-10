const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.json());

app.post('/api/process-video', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'لم يتم رفع أي فيديو' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join('uploads', `output_${Date.now()}.mp4`);

    // أمر FFmpeg الدقيق لمنع تيك توك من إعادة الضغط وتخريب الجودة
    const ffmpegCommand = `ffmpeg -i "${inputPath}" -c:v libx264 -preset slow -crf 18 -r 60 -pix_fmt yuv420p -c:a aac "${outputPath}"`;

    console.log('[SYSTEM] Processing video on Render server...');

    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

        if (error) {
            console.error(`[ERROR] ${error.message}`);
            return res.status(500).json({ error: 'فشل في معالجة الفيديو' });
        }

        console.log('[SUCCESS] Video processed successfully!');
        
        res.download(outputPath, 'NIGHTFALL_PROTECTED_VIDEO.mp4', (err) => {
            if (err) console.error(err);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[SERVER] Nightfall running on port ${PORT}`);
});
