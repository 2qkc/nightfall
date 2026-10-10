const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// زيادة مهلة السيرفر لتبقى مفتوحة لمدة 10 دقائق كاملة للمعالجة الثقيلة
 

const uploadDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'downloads');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

// رفع الحد الأقصى لحجم الملف إلى 500 ميجابايت
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 500 * 1024 * 1024 } 
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/process-video', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('لم يتم إرسال أي فيديو أو أن حجمه أكبر من المسموح.');
    }

    const inputPath = req.file.path;
    const outputFileName = `NIGHTFALL_PROTECTED_${Date.now()}.mp4`;
    const outputPath = path.join(outputDir, outputFileName);

    // أمر FFmpeg السريع والمحسن لضغط الفيديوهات الكبيرة بدون انهيار الذاكرة
    const ffmpegCommand = `ffmpeg -i "${inputPath}" -c:v libx264 -profile:v high -level 4.1 -crf 20 -preset fast -pix_fmt yuv420p -r 60 -g 120 -b:v 5M -b:a 192k -map_metadata -1 -movflags +faststart "${outputPath}"`;

    exec(ffmpegCommand, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

        if (error) {
            console.error(`خطأ FFmpeg: ${error.message}`);
            return res.status(500).send('فشلت المعالجة بسبب ضغط الملف.');
        }

        res.download(outputPath, outputFileName, (err) => {
            setTimeout(() => {
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            }, 10000);
        });
    });
});

app.listen(PORT, () => {
    console.log(`NIGHTFALL Server running on port ${PORT}`);
});
