const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // Essas opções são importantes para o renderer.js funcionar!
            nodeIntegration: true,
            contextIsolation: false, 
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Escuta o evento 'run-html' do renderer
ipcMain.on('run-html', (event, htmlContent) => {
    const resultWindow = new BrowserWindow({
        width: 800,
        height: 600,
        parent: mainWindow, // Mostra a janela filha na frente da principal
        modal: false, // Permite interagir com a janela principal
    });

    const tempHtmlPath = path.join(app.getPath('temp'), 'temp_run.html');
    fs.writeFileSync(tempHtmlPath, htmlContent);

    resultWindow.loadFile(tempHtmlPath);

    // Limpa o arquivo temporário quando a janela é fechada
    resultWindow.on('closed', () => {
        if (fs.existsSync(tempHtmlPath)) {
            fs.unlinkSync(tempHtmlPath);
        }
    });
});

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});