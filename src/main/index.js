import { app, shell, BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/app_icon.png?asset'
import { init } from '../db/Config'
import { createTray } from './function/tray/CreateTray'
import './function/SiteInfoApi'
import './function/clip/Clip'
init()

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 400,
    height: height,
    show: false,
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// clipboard.startWatching()

// 최초 시작 시 현재 클립보드 내용 읽기
// const initialText = clipboard.readText()

// if (initialText) {
//   console.log('Initial clipboard:', initialText)
// }

// clipboard.on('text-changed', () => {
//   let currentText = clipboard.readText()
//   if (currentText.includes('http')) {
//     const url = new URL(currentText)
//     console.log(url.hostname)
//     console.log(url.host) // TODO 호스트 기준으로 데이터 분할
//     console.log(url.pathname)
//     console.log(url.searchParams)
//     console.log(url.search)
//   }

// console.log(currentText)
// })

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  createTray()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
