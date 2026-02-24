import { BrowserWindow } from 'electron'
import clipboard from 'electron-clipboard-extended'
import { saveSiteInfo, isHostExist, isUrlExist, getMinIdByHost } from '../../../service/SiteInfoService'
clipboard.startWatching()

const initialText = clipboard.readText()

if (initialText) {
  console.log('Initial clipboard:', initialText)
}

clipboard.on('text-changed', () => {
  let currentText = clipboard.readText()

  if (currentText.includes('http')) {
    const url = new URL(currentText)

    if (isUrlExist(currentText) === 1) return // 같은 URL이 이미 존재하면 저장하지 않음

    let parentId = null

    if (isHostExist(url.host) === 0) {
      parentId = saveSiteInfo(null, url.host, currentText, url.host) // parent directory
    } else {
      parentId = getMinIdByHost(url.host)
    }
    saveSiteInfo(parentId, url.host, currentText, url.host) // child site

    const win = BrowserWindow.getAllWindows()[0]
    if (win) {
      win.webContents.send('site-info-updated')
    }
  }
})
