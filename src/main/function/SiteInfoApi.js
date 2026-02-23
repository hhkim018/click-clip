import { shell, ipcMain } from 'electron'
import { saveSiteInfo, getSiteInfos } from '../../service/SiteInfoService'

// handle/invoke는 값을 반환할 수 있고, on/send는 단방향 전송만

ipcMain.on('open-url', (_, url) => {
  shell.openExternal(url)
})

ipcMain.handle('get-site-info', () => {
  return getSiteInfos()
})

ipcMain.handle('insert-site-info', (_, { parentId, name, url }) => {
  return saveSiteInfo(parentId, name, url)
})

ipcMain.handle('insert-test-data', () => {
  const testData = [
    { parentId: null, name: 'Google', url: 'https://www.google.com' },
    { parentId: null, name: 'GitHub', url: 'https://github.com' },
    { parentId: null, name: 'Naver', url: 'https://www.naver.com' },
    { parentId: null, name: 'Stack Overflow', url: 'https://stackoverflow.com' }
  ]
  testData.forEach(({ parentId, name, url }) => {
    saveSiteInfo(parentId, name, url)
  })
  return getSiteInfos()
})
