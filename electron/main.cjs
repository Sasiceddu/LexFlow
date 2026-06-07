const { app, BrowserWindow } = require('electron')
const path = require('node:path')

function getFrontendEntry() {
  return process.env.ELECTRON_START_URL || null
}

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'LexFlow',
    width: 1200,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  const devUrl = getFrontendEntry()

  if (devUrl) {
    mainWindow.loadURL(devUrl)
    return
  }

  mainWindow.loadFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'))
}

app.setName('LexFlow')

app.whenReady().then(() => {
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
