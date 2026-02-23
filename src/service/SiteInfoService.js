import { insertSiteInfo, selectSiteInfos, existHost, selectMinIdByHost } from '../mapper/SiteInfoMapper'

export const saveSiteInfo = (parentId = null, name, url, host) => {
  return insertSiteInfo(parentId, name, url, host)
}

export const getSiteInfos = () => {
  return selectSiteInfos()
}

export const isHostExist = (host) => {
  return existHost(host)
}

export const getMinIdByHost = (host) => {
  return selectMinIdByHost(host)
}
