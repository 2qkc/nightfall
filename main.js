const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

// تعيين مسار الـ ffmpeg للتطبيق المحلي
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

// معالجة الفيديو محلياً بأعلى إعدادات متوازنة لتثبيت جودة تيك توك
ipcMain.handle('process-video-local', async (event, inputPath) => {
    return new Promise((resolve, reject) => {
        const outputFileName = `NIGHTFALL_PRO_${Date.now()}.mp4`;
        const outputPath = path.join(app.getPath('downloads'), outputFileName);

        ffmpeg(inputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions([
                '-crf 16',
                '-preset slow',
                '-pix_fmt yuv420p',
                '-profile:v high',
                '-level 4.2',
                '-b:v 12M',
                '-b:a 320k',
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
