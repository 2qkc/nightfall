const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// مسار معالجة الفيديو بالـ FFmpeg للسيرفر
app.post('/process-video', (req, res) => {
    const { inputPath } = req.body;
    
    if (!inputPath || !fs.existsSync(inputPath)) {
        return res.status(400).json({ error: 'مسار الفيديو غير موجود أو غير صحيح' });
    }

    const outputFileName = `NIGHTFALL_SERVER_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, 'downloads', outputFileName);

    // تأكد من وجود مجلد التحميلات
    if (!fs.existsSync(path.join(__dirname, 'downloads'))) {
        fs.mkdirSync(path.join(__dirname, 'downloads'));
    }

    // أمر الـ FFmpeg المعدل لتجاوز ضغط تيك توك والحفاظ على الجودة
    const ffmpegCommand = `ffmpeg -i "${inputPath}" -c:v libx264 -profile:v high -level 4.1 -crf 18 -preset medium -pix_fmt yuv420p -r 60 -g 120 -b:v 6M -b:a 192k -map_metadata -1 -movflags +faststart "${outputPath}"`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`خطأ في المعالجة: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }

        res.json({
            success: true,
            message: 'تمت معالجة الفيديو بنجاح عبر السيرفر!',
            outputPath: outputPath
        });
    });
});

const PORT = process.0 || 3000;
app.listen(PORT, () => {
    console.log(`سيرفر المعالجة يعمل بكفاءة على المنفذ ${PORT}`);
});
