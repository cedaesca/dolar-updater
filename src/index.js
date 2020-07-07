const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const dbConnect = require('./database/connection');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createConfigWindow = () => {
  const window = new BrowserWindow({
    width: 450,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  });

  window.loadFile(path.join(__dirname, 'views', 'config.html'));

  if (process.env.NODE_ENV !== 'production') {
    const menu = Menu.buildFromTemplate([
      {
        label: 'DevTools',
        click() {
          window.webContents.openDevTools();
        }
      }
    ]);

    window.setMenu(menu);
  } else {
    window.setMenu(null);
  }

};

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'views', 'index.html'));

  const menuTemplate = [
    {
      label: 'Ajustes',
      submenu: [
        {
          label: 'Configurar base de datos',
          click() {
            createConfigWindow();
          }
        }
      ]
    },
    {
      label: 'Herramientas',
      submenu: [
        {
          label: 'Testear conexión con base de datos',
          click: async () => {
            const sequelize = dbConnect();

            try {
              await sequelize.authenticate();
            } catch (err) {
              return mainWindow.webContents.send('connection-tested', false);
            }

            await sequelize.close();
            
            mainWindow.webContents.send('connection-tested', true);
          }
        }
      ]
    }
  ];

  if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
      label: 'DevTools',
      click() {
        mainWindow.webContents.openDevTools();
      }
    });
  }

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  mainWindow.setMenu(mainMenu);

  mainWindow.webContents.on('new-window', (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });

  ipcMain.on('settings-saved', () => {
    mainWindow.webContents.send('settings-saved');
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
