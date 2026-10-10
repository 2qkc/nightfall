const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

// قراءة الواجهة الأصلية من مجلد public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// مسار معالجة الفيديو بالسرعة القصوى
app.post('/api/process-video', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'لم يتم رفع أي فيديو' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(uploadDir, `output_${Date.now()}.mp4`);

    const ffmpegCommand = `ffmpeg -i "${inputPath}" -c:v libx264 -preset slow -crf 18 -r 60 -pix_fmt yuv420p -c:a aac "${outputPath}"`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

        if (error) {
            return res.status(500).json({ error: 'فشل في معالجة الفيديو' });
        }
        
        res.download(outputPath, 'NIGHTFALL_PRO_FINAL.mp4', (err) => {
            if (err) console.error(err);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[SERVER] Nightfall running on port ${PORT}`);
});
