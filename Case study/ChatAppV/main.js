const { app, BrowserWindow } = require('electron');
    
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        contextIsolation: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true
    });
    win.loadURL('http://localhost:3000');
    
    app.on('window-all-closed', () => {
        if(process.platform !== 'darwin') {
            app.quit();
        }
    });
}

app.whenReady().then(() => {
    createWindow();
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
});