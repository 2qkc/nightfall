const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 750,
        backgroundColor: '#000000',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

// الخدعة الجذرية (Fake Encoding / Metadata Spoofing) لتجاوز ضغط تيك توك
ipcMain.handle('process-video-local', async (event, inputPath) => {
    return new Promise((resolve, reject) => {
        const outputFileName = `NIGHTFALL_FAKED_${Date.now()}.mp4`;
        const outputPath = path.join(app.getPath('downloads'), outputFileName);

        ffmpeg(inputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions([
                // إجبار التشفير على بروفايل High L4.2 مع خداع ترويسة العرض
                '-profile:v high',
                '-level 4.2',
                '-crf 12',                          // جودة جنونية شبه خالية من الضغط
                '-preset veryslow',                 // ضغط أقصى لإعادة صياغة البكسلات بالكامل
                '-pix_fmt yuv420p',
                '-maxrate 25M',                     // حجز سرعة نقل وهمية عالية جداً
                '-bufsize 30M',
                '-bsf:v h264_mp4toannexb',          // إعادة هيكلة الترويسة لتبدو كبث مباشر أو ملف مرجعي
                '-metadata creator="NIGHTFALL_ENGINE"', // بصمة تضليل خوارزمية المنصة
                '-movflags +faststart+use_metadata_tags'
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
