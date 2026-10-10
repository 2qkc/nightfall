ipcMain.handle('process-video-local', async (event, inputPath) => {
    return new Promise((resolve, reject) => {
        const outputFileName = `NIGHTFALL_PRO_${Date.now()}.mp4`;
        const outputPath = path.join(app.getPath('downloads'), outputFileName);

        ffmpeg(inputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions([
                '-crf 16',                  // جودة عالية جداً تمنع التكسير
                '-preset slow',             // معالجة عميقة للحفاظ على تفاصيل الحواف
                '-pix_fmt yuv420p',         // توافق ألوان الويب والمنصة
                '-profile:v high',          // بروفايل عالي يجبر الخوارزمية على التعامل مع الفيديو باحترافية
                '-level 4.2',               // ليفل متوافق تماماً مع مشغلات تيك توك
                '-b:v 12M',                 // معدل بث مرتفع يمنع الضغط التدميري
                '-b:a 320k',                // صوت نقي وعالي الجودة
                '-movflags +faststart'      // ترويسة التشغيل السريع
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
