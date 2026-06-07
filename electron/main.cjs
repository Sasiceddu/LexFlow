const { app, BrowserWindow } = require('electron')
const { spawn } = require('node:child_process')
const http = require('node:http')
const path = require('node:path')

const BACKEND_HEALTH_URL = 'http://localhost:3001/api/health'
const BACKEND_WAIT_TIMEOUT_MS = 5_000
const BACKEND_WAIT_INTERVAL_MS = 250

let managedBackendProcess = null

function getFrontendEntry() {
  return process.env.ELECTRON_START_URL || null
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function checkBackendHealth() {
  return new Promise((resolve) => {
    const request = http.get(BACKEND_HEALTH_URL, (response) => {
      response.resume()
      resolve(response.statusCode === 200)
    })

    request.setTimeout(1_000, () => {
      request.destroy()
      resolve(false)
    })

    request.on('error', () => {
      resolve(false)
    })
  })
}

function startBackendProcess() {
  const backendRoot = path.join(__dirname, '..', 'backend')
  const backendEntry = path.join(backendRoot, 'dist', 'server.js')

  managedBackendProcess = spawn(process.execPath, [backendEntry], {
    cwd: backendRoot,
    env: {
      ...process.env,
      PORT: '3001',
    },
    stdio: 'ignore',
    windowsHide: true,
  })

  managedBackendProcess.on('exit', () => {
    managedBackendProcess = null
  })
}

async function waitForBackend() {
  const startedAt = Date.now()

  while (Date.now() - startedAt < BACKEND_WAIT_TIMEOUT_MS) {
    if (await checkBackendHealth()) {
      return true
    }

    await sleep(BACKEND_WAIT_INTERVAL_MS)
  }

  return false
}

async function ensureBackendIsRunning() {
  if (await checkBackendHealth()) {
    return
  }

  startBackendProcess()
  await waitForBackend()
}

function stopManagedBackendProcess() {
  if (managedBackendProcess) {
    managedBackendProcess.kill()
    managedBackendProcess = null
  }
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

app.whenReady().then(async () => {
  await ensureBackendIsRunning()
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('before-quit', () => {
  stopManagedBackendProcess()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
