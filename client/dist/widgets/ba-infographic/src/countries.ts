import { ACLUtils } from '../node_modules/@arcgis/business-analyst-components/dist/stencil-components/dist/collection/ACLUtils'

interface Hierarchy {
  ID: string
  alias: string
  default: boolean
  geographyLevels: any
}
/** getCountries
 *      Returns data from GE for all countries (includes hierarchies)
 */
export const getCountries = async (langCode: string, geUrl: string, token?: string) => {
  if (!langCode || !geUrl) { throw new Error('invalid args') }

  let countriesUrl = geUrl + '/Geoenrichment/countries?f=pjson&appID=esriexperiencebuilder&langCode=' + langCode
  if (token && ACLUtils.hasText(token) && token !== 'undefined') {
    countriesUrl = countriesUrl + '&token=' + token
  }

  // console.log('%c ExB Setting - getCountries doing fetch:', 'color:orange;font-size:13pt;', geUrl, token, countriesUrl) // DEBUG ONLY @@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  const response: any = await fetch(countriesUrl)
  const data = await response.json()
  if (data?.error && data.error.message && data.error.message.includes('Invalid token')) {
    console.log('%c ERROR: getCountries invalid token, request failed', 'color:red;font-size:10pt;', token)
    throw new Error('invalid token')
  }
  return data.countries
}

/** getValidHierarchies
 *      Returns an arrar of valid hierarchies for a given country.  The 'countryData' is
 *      the result from a call to 'getCountries()'
 */
export const getValidHierarchies = (country: string, countryData: any) => {
  if (!country || !countryData) { throw new Error('invalid args') }

  const hierarchies: Hierarchy[] = []

  const countryInfo = countryData.find(o => o.id === country)
  if (countryInfo && countryInfo.hierarchies) {
    for (let ii = 0; ii < countryInfo.hierarchies.length; ii++) {
      const h = countryInfo.hierarchies[ii]
      // filter out landscape hierarchy
      if (h.ID !== 'landscape') {
        hierarchies.push({ ID: h.ID, alias: h.alias, default: h.default, geographyLevels: h.levelsInfo?.geographyLevels } as Hierarchy)
      }
    }
  }
  return hierarchies
}
