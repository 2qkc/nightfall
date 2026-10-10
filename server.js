const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// تعيين مسار الـ ffmpeg تلقائياً ليعمل على سيرفر Render
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// رفع حد حجم البيانات المستقبلة للملفات الكبيرة (500 ميجابايت)
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// زيادة مهلة الاتصال للسيرفر (10 دقائق) لتجنب انقطاع الرفع
app.use((req, res, next) => {
    req.setTimeout(600000);
    res.setTimeout(600000);
    next();
});

// التأكد من وجود مجلدات الحفظ
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('outputs')) fs.mkdirSync('outputs');

// إعداد استقبال الملفات المؤقتة
const upload = multer({ dest: 'uploads/' });

// نقطة استقبال الفيديو ومعالجته
app.post('/process-video', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('لم يتم إرسال أي ملف فيديو.');
    }

    const inputPath = req.file.path;
    const outputFileName = `processed_${Date.now()}.mp4`;
    const outputPath = path.join('outputs', outputFileName);

    console.log(`[RENDER] Starting processing for: ${req.file.originalname}`);

    ffmpeg(inputPath)
        .videoCodec('libx264')
        .outputOptions([
            '-crf 18',
            '-preset slow',
            '-pix_fmt yuv420p',
            '-movflags +faststart',
            '-metadata title="NightFall Ultra 4K"'
        ])
        .save(outputPath)
        .on('end', () => {
            console.log(`[SUCCESS] Processing finished: ${outputFileName}`);
            res.download(outputPath, outputFileName, (err) => {
                try {
                    fs.unlinkSync(inputPath);
                    fs.unlinkSync(outputPath);
                } catch (e) {}
            });
        })
        .on('error', (err) => {
            console.error('Render Error:', err);
            res.status(500).send('فشل الرندر والمعالجة على السيرفر');
            try {
                fs.unlinkSync(inputPath);
            } catch (e) {}
        });
});

app.get('/', (req, res) => {
    res.send('NIGHTFALL Server is Running & Ready!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
