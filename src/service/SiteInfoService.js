import { insertSiteInfo, selectSiteInfos, existHost, existUrl, selectMinIdByHost, updateSiteInfoName, updateParentIdByIds, deleteSiteInfosByIds } from '../mapper/SiteInfoMapper'

export const saveSiteInfo = (parentId = null, name, url, host) => {
  return insertSiteInfo(parentId, name, url, host)
}

export const getSiteInfos = () => {
  return selectSiteInfos()
}

export const isHostExist = (host) => {
  return existHost(host)
}

export const isUrlExist = (url) => {
  return existUrl(url)
}

export const getMinIdByHost = (host) => {
  return selectMinIdByHost(host)
}

export const modifySiteInfoName = (id, name) => {
  return updateSiteInfoName(id, name)
}

export const modifyParentIdByIds = (ids, parentId) => {
  return updateParentIdByIds(ids, parentId)
}

export const removeSiteInfosByIds = (ids) => {
  return deleteSiteInfosByIds(ids)
}
