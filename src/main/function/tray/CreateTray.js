import { app, nativeImage, Tray, Menu } from 'electron'
import icon from '../../../../resources/app_icon_tray.png?asset'

export const createTray = () => {
  const trayIcon = nativeImage.createFromPath(icon).resize({ width: 18, height: 18 })
  trayIcon.setTemplateImage(true)
  const tray = new Tray(trayIcon)

  // 트레이 아이콘에 마우스 오른쪽 클릭 시 나타날 메뉴 생성
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => {
        app.show() // 창을 표시
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit() // 앱 종료
      }
    }
  ])

  // 트레이 아이콘에 메뉴 연결
  tray.setContextMenu(contextMenu)

  // 트레이 아이콘을 클릭이벤트
  tray.on('click', () => {})
}
