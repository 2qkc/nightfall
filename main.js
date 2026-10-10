const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');

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

// استقبال طلب المعالجة محلياً على جهازك
ipcMain.handle('process-video-local', async (event, inputPath) => {
    return new Promise((resolve, reject) => {
        const outputFileName = `NIGHTFALL_PROTECTED_${Date.now()}.mp4`;
        const outputPath = path.join(app.getPath('downloads'), outputFileName);

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
                resolve(outputPath);
            })
            .on('error', (err) => {
                reject(err.message);
            });
    });
});
