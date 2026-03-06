import { BrowserWindow } from 'electron'
import clipboard from 'electron-clipboard-extended'
import cheerio from 'cheerio'

import {
  saveSiteInfo,
  isHostExist,
  isUrlExist,
  getMinIdByHost
} from '../../../service/SiteInfoService'
clipboard.startWatching()

const initialText = clipboard.readText()

if (initialText) {
  console.log('Initial clipboard:', initialText)
}

clipboard.on('text-changed', async () => {
  let currentText = clipboard.readText()

  if (currentText.includes('http')) {
    const url = new URL(currentText)

    if (isUrlExist(currentText) === 1) return // 같은 URL이 이미 존재하면 저장하지 않음

    let parentId = null
    const title = await getWebTitle(currentText)
    const name = title ? title : currentText
    if (isHostExist(url.host) === 0) {
      parentId = saveSiteInfo(null, name, currentText, url.host) // parent directory
    } else {
      parentId = getMinIdByHost(url.host)
    }
    saveSiteInfo(parentId, name, currentText, url.host) // child site

    const win = BrowserWindow.getAllWindows()[0]
    if (win) {
      win.webContents.send('site-info-updated')
    }
  }
})

async function getWebTitle(url) {
  const res = await fetch(url)
  const html = await res.text()
  const $ = cheerio.load(html)
  return $('title').text()
}
