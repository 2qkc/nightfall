ipcMain.handle('process-video-local', async (event, inputPath) => {
    return new Promise((resolve, reject) => {
        const outputFileName = `NIGHTFALL_TIKTOK_${Date.now()}.mp4`;
        const outputPath = path.join(app.getPath('downloads'), outputFileName);

        ffmpeg(inputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions([
                '-crf 20',                  // معدل متوازن يمنع تيك توك من ضغط الفيديو بقسوة
                '-preset slow',             // ضغط هادئ يحافظ على تفاصيل البكسلات والحدّة
                '-pix_fmt yuv420p',         // التوافق الإجباري مع ألوان منصات الويب
                '-profile:v high',          // بروفايل عالي الجودة
                '-level 4.2',               // ليفل مدعوم بالكامل لمنع إعادة المعالجة الخاطئة
                '-b:a 192k',                // جودة صوت عالية
                '-movflags +faststart'      // ترويسة التشغيل السريع والاعتماد
            ])
            .save(outputPath)
            .on('end', () => {
                resolve(outputPath);
            })
            .on('error', (err) => {
                reject(err.message);
            });
    });
});
