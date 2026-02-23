import { app } from 'electron'
import { join } from 'path'
import Database from 'better-sqlite3'

const dbPath = join(app.getPath('userData'), 'clickClip.db')
const db = new Database(dbPath, { verbose: console.log })

export const init = () => {
  // DDL 실행
  db.exec(`CREATE TABLE IF NOT EXISTS site_info(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER,
    name TEXT,
    url TEXT,
    host TEXT
    )`)
}

export default db
