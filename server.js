const ffmpeg = require('fluent-ffmpeg');

// دالة المعالجة الحقيقية للفيديو
app.post('/process-video', (req, res) => {
    const inputPath = req.file.path;
    const outputPath = `outputs/processed_${Date.now()}.mp4`;

    ffmpeg(inputPath)
        // الحفاظ على أقصى جودة ورفع Bitrate
        .videoCodec('libx264')
        .outputOptions([
            '-crf 18',                  // جودة عالية جداً بدون ضغط ملحوظ
            '-preset slow',              // معالجة بطيئة لضمان أفضل جودة وحجم
            '-pix_fmt yuv420p',
            '-movflags +faststart',
            '-metadata title="NightFall Ultra 4K"' // تعديل الميتا داتا
        ])
        .save(outputPath)
        .on('end', () => {
            // إرسال الملف المعالج الحقيقي بعد انتهاء الرندر
            res.download(outputPath);
        })
        .on('error', (err) => {
            console.error('Render Error:', err);
            res.status(500).send('فشل الرندر');
        });
});
