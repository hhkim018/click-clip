import db from '../db/Config'

export const insertSiteInfo = (parentId, name, url, host) => {
  const query = db.prepare('INSERT INTO SITE_INFO(parent_id,name,url,host) VALUES(?,?,?,?)')
  const result = query.run(parentId, name, url, host)
  return result.lastInsertRowid
}

export const selectSiteInfos = () => {
  const query = db.prepare('SELECT * FROM SITE_INFO')
  return query.all()
}

export const existHost = (host) => {
  const query = db.prepare('SELECT EXISTS(SELECT 1 FROM SITE_INFO WHERE HOST = ?) AS result')
  return query.get(host).result
}

export const selectMinIdByHost = (host) => {
  const query = db.prepare('SELECT MIN(id) AS id FROM SITE_INFO WHERE HOST = ?')
  return query.get(host).id
}
