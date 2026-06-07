const { spawn } = require('node:child_process')
const path = require('node:path')
const electronPath = require('electron')

const appRoot = path.join(__dirname, '..')
const env = { ...process.env }

delete env.ELECTRON_RUN_AS_NODE

const electronProcess = spawn(electronPath, ['.'], {
  cwd: appRoot,
  env,
  stdio: 'inherit',
  windowsHide: false,
})

electronProcess.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0)
})
