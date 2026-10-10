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

// ترميز الخداع المتقدم لتجاوز الفحص المتكرر وإلغاء الضغط الثاني
ipcMain.handle('process-video-local', async (event, inputPath) => {
    return new Promise((resolve, reject) => {
        const outputFileName = `NIGHTFALL_STEALTH_${Date.now()}.mp4`;
        const outputPath = path.join(app.getPath('downloads'), outputFileName);

        ffmpeg(inputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions([
                '-profile:v high',
                '-level 4.1',               // ليفل آمن جداً يتوافق مع كل الهواتف ولا يثير الشك
                '-crf 15',                  // جودة حادة جداً
                '-preset slow',
                '-pix_fmt yuv420p',
                '-r 60',                    // تثبيت الفريمات على 60 حصرياً لمنع إعادة المعالجة
                '-g 120',                   // مفتاح الـ GOP لمنع الفحص الآلي من كشف التعديل
                '-keyint_min 60',
                '-b:v 10M',                 // معدل بث مثالي لا يستفز الخوارزمية ولا تضغطه
                '-b:a 320k',
                '-map_metadata -1',         // مسح كامل لأي بصمة برمجية أو أداة تعديل (خدعة الكاميرا الحقيقية)
                '-movflags +faststart'
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
