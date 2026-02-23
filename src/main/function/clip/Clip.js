import { BrowserWindow } from 'electron'
import clipboard from 'electron-clipboard-extended'
import { saveSiteInfo, isHostExist, getMinIdByHost } from '../../../service/SiteInfoService'
clipboard.startWatching()

const initialText = clipboard.readText()

if (initialText) {
  console.log('Initial clipboard:', initialText)
}

clipboard.on('text-changed', () => {
  let currentText = clipboard.readText()

  if (currentText.includes('http')) {
    const url = new URL(currentText)
    let parentId = null

    console.log(url.hostname)
    console.log(url.host) // TODO 호스트(포트포함) 기준으로 데이터 분할
    console.log(url.pathname)
    console.log(url.searchParams)
    console.log(url.search)

    if (isHostExist(url.host) === 0) {
      // 기존에 host 겹치는게 없다면
      parentId = saveSiteInfo(null, url.host, currentText, url.host) // parent director
    } else {
      parentId = getMinIdByHost(url.host) // 기존에 호스트가 있다면
    }
    saveSiteInfo(parentId, url.host, currentText, url.host) // child site

    const win = BrowserWindow.getAllWindows()[0]
    if (win) {
      win.webContents.send('site-info-updated')
    }
  }
})
