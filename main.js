const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: '#050508',
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // تحميل واجهتك الأصلية الموجودة في مجلد public
    mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));

    // فتح روابط تيك توك تلقائياً في المتصفح الخارجي عند النقر عليها
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.app.quit();
});