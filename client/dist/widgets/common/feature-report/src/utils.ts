import { getAppStore, SessionManager, portalUrlUtils, esri, type QueriableDataSource, CONSTANTS, AllDataSourceTypes, type SubtypeSublayerDataSource } from 'jimu-core'
import { type FeatureLayerDataSource } from 'jimu-arcgis'
import { type HTTPMethods } from '@esri/arcgis-rest-request'
import { type ItemRelationshipType } from '@esri/arcgis-rest-portal'
const fileSaver = require('file-saver')
const telemetryHeaders = {
  'X-Survey123-Request-Source': 'ExB/FeatureReportWidget',
  'Content-Type': 'application/x-www-form-urlencoded'
}

let surveyServices: any = {}

// let isGeneratingSampleTemplate: boolean = false
export const reportMergeCommonConfig = {
  templateItem: {
    typeKeyword: 'Print Template',
    type: 'Microsoft Word',
    typeKeywords: {
      survey123: 'Survey123',
      survey123Hub: 'Survey123 Hub',
      printTemplate: 'Print Template',
      featureReportTemplate: 'Feature Report Template',
      formPrefix: 'FormId_'
    },
    tags: [
      'Survey123',
      'ExB',
      'Print Template',
      'Feature Report Template'
    ]
  },
  reportItem: {
    typeKeywords: {
      survey123: 'Survey123',
      survey123Hub: 'Survey123 Hub',
      featureReport: 'Feature Report',
      templatePrefix: 'TemplateId_',
      formPrefix: 'FormId_'
    },
    tags: [
      'Survey123',
      'Feature Report'
    ],
    type: {
      docx: 'Microsoft Word',
      zip: 'Code Sample',
      pdf: 'PDF'
    }
  },
  maxPackageSize: 536871000,
  maxMergeSize: 536871000,
  maxFeatureCount: 2000,
  creditPerReport: 0.5,
  jobSucceededThreshold: 0.8,
  s3FileRetentionTime: 86400000
}

export const viewFeatureService = {
  fieldworker: {
    name: 'form',
    typeKeyword: 'FieldworkerView'
  },
  stakeholder: {
    name: 'results',
    typeKeyword: 'StakeholderView'
  }
}
/**
 * find the related survey from the privide layer
 * the layer maybe:
 *  the fieldworker view of the the source layer(Survey2Service relationship)
 *  the source layer of the survey
 *  the existing layer before creating the survey
 *  the stakeholder view of the source layer(Survey2Data relationship)
 *  other fs view of the source layer
 */
export function getSurveyFromLayer (datasource: FeatureLayerDataSource | SubtypeSublayerDataSource) {
  resetSurveyServices()
  const mainDs = datasource.getMainDataSource()
  let serviceItemId = datasource.itemId || mainDs?.itemId

  // SubtypeSublayer
  if (datasource.type === AllDataSourceTypes.SubtypeSublayer) {
    const parentDS: any = mainDs?.parentDataSource
    serviceItemId = parentDS?.itemId
  }

  // #21866
  if (!serviceItemId && mainDs?.url) {
    serviceItemId = (mainDs.layer as any)?.serviceItemId || ((mainDs as any)?.layerDefinition)?.serviceItemId
  }

  const rootDS: any = datasource.getRootDataSource()
  if (!serviceItemId && rootDS.itemId) {
    serviceItemId = rootDS.itemId
  }

  if (!serviceItemId) {
    console.warn('itemId is not existing in the seleted data source.')
    return Promise.resolve('')
  }
  // get fieldworker view
  return getRelatedSurvey(serviceItemId).then((id) => {
    if (id) {
      return id
    }
    return getSurveyIdFromSourceLayerOrFieldworkerView(serviceItemId)
  }).catch((e) => {
    console.log('failed to get the related survey item id')
  })
}

/**
 * extract the report related parameters from data source, including feature layer url, where, objectIds...
 * @param dataSource
 */
export function extractParamFromDataSource (dataSource: FeatureLayerDataSource | SubtypeSublayerDataSource) {
  let url = ''
  let where = ''
  let objectIds = ''
  if (!dataSource) {
    return {}
  }
  url = dataSource.url
  let isSelectionMode = false
  if (dataSource.isDataView) {
    // support data view
    const mainDs: QueriableDataSource = dataSource.getMainDataSource()
    url = mainDs.url
    // selection mode
    if (dataSource.dataViewId === CONSTANTS.SELECTION_DATA_VIEW_ID) {
      isSelectionMode = true
      where = ''
      // call the sync function getSelectedRecordshere to detect whether need to send feature to survey
      const records = dataSource.getSelectedRecords()

      const objectIdField = dataSource.getIdField() || 'objectid'
      objectIds = records.map((record: any) => {
        const feat = record.feature
        const oidField = objectIdField
        return feat.attributes[oidField]
      }).join(',')
      return {
        url: url,
        objectIds: objectIds
      }
    }
  }
  if (!isSelectionMode) {
    const query: any = dataSource.getCurrentQueryParams()
    if (dataSource.type === AllDataSourceTypes.SubtypeSublayer) {
      const subtypeCode = dataSource.layer.subtypeCode
      const subtypeField = dataSource.layer.subtypeField
      const subTypeWhere = `${subtypeField} = ${subtypeCode}`
      where = query.where ? `(${query.where}) and ${subTypeWhere}` : subTypeWhere
    } else {
      where = query.where
    }
    where = where || '1=1'
    return {
      url: url,
      where: where,
      orderByFields: query.orderByFields
    }
    // orderby?
  }
}

/**
 * get the feature count from the data source
 * @param dsParams
 * @param featureLayerUrl
 * @returns
 */
export function getDSFeatureCount (dsParams: any, featureLayerUrl: string): Promise<number> {
  if (!dsParams) {
    return Promise.resolve(0)
  }

  // selection mode
  if ('objectIds' in dsParams) {
    const objectIds = dsParams.objectIds
    if (!objectIds || !objectIds.length) {
      return Promise.resolve(0)
    }
    return Promise.resolve(objectIds.split(',').length)
  }

  // normal mode or view mode
  if ('where' in dsParams) {
    const where = dsParams.where || '1=1'
    const params: any = Object.assign({ url: featureLayerUrl, returnCountOnly: true }, getBaseRequestOptions())
    params.params = { where: where }
    return esri.restFeatureService.queryFeatures(params)
      .then((result: any) => {
        return result.count
      })
  }
  return Promise.resolve(0)
}

/**
 * get related item
 * @param serviceItemId
 * @param options
 * @returns
 */
export function getRelatedSurvey (serviceItemId: string, options?: {
  relationshipType?: ItemRelationshipType
  direction?: string
}): Promise<string> {
  if (!serviceItemId) {
    return Promise.resolve(null)
  }

  const defaultOption = {
    relationshipType: 'Survey2Service' as ItemRelationshipType,
    direction: 'reverse'
  }

  options = Object.assign(defaultOption, options || {})

  const params = {
    id: serviceItemId,
    relationshipType: 'Survey2Service' as ItemRelationshipType,
    direction: 'reverse' as 'forward' | 'reverse',
    authentication: SessionManager.getInstance().getSessionByUrl(getAppStore().getState().portalUrl)
  }
  return esri.restPortal.getRelatedItems(params).then((res) => {
    const formItem = res.relatedItems?.find(item => {
      const keywords = item.typeKeywords || []
      return keywords.includes('Survey123') && keywords.includes('Form')
    })
    if (formItem) {
      return formItem.id
    }
    return null
  })
}

/**
 * get survey item id when the service is source fs or field worker view
 * @param serviceItemId
 * @returns
 */
export function getSurveyIdFromSourceLayerOrFieldworkerView (serviceItemId: string): Promise<string> {
  const sessionManager = SessionManager.getInstance()
  const portalUrl = getAppStore().getState().portalUrl

  return esri.restPortal.getItem(serviceItemId, {
    portal: portalUrlUtils.getPortalRestUrl(portalUrl),
    authentication: sessionManager.getSessionByUrl(portalUrl)
  }).then((item) => {
    const keywords = item.typeKeywords || []
    if (keywords.includes('Hosted Service') && keywords.includes('Survey123')) {
      // find the item id, that is a 32 length string with lowercase letters and numbers
      const targetItem = keywords.find((keyword) => {
        return /^[a-z0-9]{32}$/.test(keyword)
      })
      if (targetItem) {
        const type = keywords.includes('Source') ? 'source' : (keywords.includes('StakeholderView') ? 'stakeholder' : 'fieldworker')
        surveyServices[type] = {
          itemId: item.id,
          url: item.url.replace(/^http:\/\//i, 'https://'),
          typeKeywords: item.typeKeywords,
          owner: item.owner,
          itemControl: item.itemControl,
          access: item.access,
          title: item.title,
          type: item.type
        }
      }
      return targetItem
    }
    return null
  })
}

/**
 * get item info
 * @param id
 * @returns
 */
export function getItemInfo (id) {
  return esri.restPortal.getItem(id, getBaseRequestOptions())
}

/**
 * get survey item info
 * @param serviceItemId
 * @returns
 */
export function getSurveyItemInfo (surveyItemId: string): Promise<any> {
  const params: any = Object.assign({ id: surveyItemId, relationshipType: 'Survey2Data' }, getBaseRequestOptions())
  return esri.restPortal.getItem(surveyItemId, params).then((item) => {
    const user = getAppStore().getState().user
    const userName = user ? user.username : ''

    // write the user role to the item info json
    // admin
    if (item.itemControl === 'admin') {
      item.isAdmin = true
    }
    // coowner
    if (item.itemControl === 'update') {
      item.isCoowner = true
    }
    /**
     * owner
     */
    if (item.owner === userName) {
      item.isOwner = true
    }
    return item
  })
}

/**
 * get survey templates
 * @param serviceItemId
 */
export function getReportTemplates (surveyItemId: string): Promise<any[]> {
  const credential = getCredentialInfo()
  const token = credential.token
  const username = credential.username

  return Promise.resolve(true)
    .then(() => {
      const params: any = Object.assign({ id: surveyItemId, relationshipType: 'Survey2Data' }, getBaseRequestOptions())
      return esri.restPortal.getRelatedItems(params)
    })
    .then((res: any) => {
      if (!res || res.error) {
        throw new Error('Failed to get related templates')
      }
      const config = {
        typeKeyword: 'Print Template',
        type: 'Microsoft Word'
      }
      const results = res.relatedItems.filter((item) => {
        // only type and typekeywords are matched
        return item.type === config.type && item.typeKeywords.indexOf(config.typeKeyword) !== -1
      })
      return results || []
    })
    .then((items) => {
      items.forEach((item) => {
        const templateUrl = getCustomPrintingFileUrl(item.id, username, token)
        item.modified = new Date(item.modified)
        item.url = templateUrl
        // todo: the template file name?
      })

      return items
    })
}

/**
 * execute sample report
 */
export function generateSampleReport (template: any, survey: any, dsParam: any, config: any, locale: string) {
  const surveyItemId = survey.id
  template.printing = true
  const featureLayerUrl = dsParam.url
  const where = dsParam.where
  const objectIds = dsParam.objectIds
  const orderByFields = dsParam.orderByFields ? dsParam.orderByFields.join(',') : ''

  const queryParams: any = {}
  if (where) {
    queryParams.where = where
  } else if (objectIds) {
    queryParams.objectIds = objectIds
  }
  if (orderByFields) {
    queryParams.orderByFields = orderByFields
  }

  const params: any = {
    queryParameters: queryParams ? JSON.stringify(queryParams) : '',
    templateItemId: template.id,
    surveyItemId: surveyItemId,
    featureLayerUrl: featureLayerUrl,
    outputReportName: config.reportName || ''
  }

  // Use outputReportName as outputPackageName if it doesn't have any variables and outputPackageName is not specified by user
  params.outputPackageName = params.outputReportName

  if (config.mergeFiles) {
    params.mergeFiles = config.mergeFiles
  }

  const lang = locale || 'en'
  const portalUrl = getCredentialInfo().portalUrl
  const token = getCredentialInfo().token

  const defautlParams = {
    // outputFormat: 'docx',
    portalUrl: portalUrl,
    utcOffset: '||' + _getLocalTimezoneOffset(),
    locale: '||' + lang,
    token: token,
    f: 'json'
  }
  const requestData = Object.assign(defautlParams, params || {})
  const body = new URLSearchParams()
  Object.keys(requestData).forEach((k) => {
    const value = requestData[k]
    body.append(k, value)
  })

  const url = getSurvey123RestApi() + '/featureReport/createSampleReport/submitJob'
  let testModeJobObj: any = null

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: telemetryHeaders,
      body
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        // watch the job
        testModeJobObj = res
        const jobId = testModeJobObj.jobId
        const checking = () => {
          checkJobStatus(jobId).then((statusObj) => {
            testModeJobObj = statusObj
            if (statusObj.jobStatus === 'esriJobSucceeded' || statusObj.jobStatus === 'esriJobPartialSucceeded') {
              // downloadFile(statusObj)
              if (statusObj.jobStatus === 'esriJobPartialSucceeded') {
                console.warn('Reports have been generated with some issues.')
              }
              // the downloading will break the promise, so will download files after this promise
              resolve(statusObj)
            } else if (statusObj.jobStatus === 'esriJobFailed') {
              console.error('Failed to generate sample report', statusObj)
              resolve(true)
            } else if (statusObj.error) {
              console.error('Failed to generate sample report', statusObj.error)
              resolve(true)
            } else {
              setTimeout(() => {
                checking()
              }, 1500)
            }
          }).catch((statusObj) => {
            console.error('Failed to generate sample report', statusObj)
            resolve(true)
          })
        }
        checking()
      })
  })
}

/**
 * checkJobStatus
 */
export function checkJobStatus (jobId: string) {
  const params = {
    f: 'json',
    portalUrl: getCredentialInfo().portalUrl,
    token: getCredentialInfo().token
  }
  const body = new URLSearchParams()
  Object.keys(params).forEach((k) => {
    const value = params[k]
    body.append(k, value)
  })
  const url = `${getSurvey123RestApi()}/featureReport/jobs/${jobId}/status`
  return fetch(url, {
    method: 'POST',
    headers: telemetryHeaders,
    body
  })
    .then((res) => {
      return res.json()
    })
}

/**
 * check template syntax
 * @returns
 */
export function checkTemplateSyntax (file: any, featureLayerUrl: string, survey: any) {
  const params = {
    templateFile: file,
    featureLayerUrl: featureLayerUrl,
    surveyItemId: survey.id
  }

  return params.templateFile.slice(0, 1) // only the first byte
    .arrayBuffer() // try to read
    .catch(() => {
      console.warn('This file has changed. Please select this file again.')
    })
    .then(() => {
      const requestParms = Object.assign(params, {
        f: 'json',
        portalUrl: getCredentialInfo().portalUrl,
        token: getCredentialInfo().token
      })
      const formData = new FormData()
      Object.keys(requestParms).forEach((k) => {
        const value = requestParms[k]
        formData.append(k, value)
      })
      const url = `${getSurvey123RestApi()}/featureReport/checkTemplateSyntax`
      return fetch(url, {
        method: 'POST',
        headers: telemetryHeaders,
        body: formData
      })
        .then((res) => {
          return res.json()
        })
    })
    .then((res) => {
      if (!res.success) {
        console.error('failed to check the template syntax', res.details && res.details[0])
      }
      return res
      // update template itemt typekeywords append `Section Count <individual section count>|<summary section count>`
      // const settingString = getTemplateSectionSettingString({ individualSectionCount: res.individualSectionCount, summarySectionCount: res.summarySectionCount })
      // template.templateSectionSetting = [settingString]
    })
}

/**
 * create sample templates
 * @param templateTypes
 * @param surveyItemInfo
 * @param featureLayerUrl
 * @param allTemplates
 * @returns
 */
export function createSampleTemplates (templateTypes: string[], surveyItemInfo: any, featureLayerUrl: string, allTemplates: any[]) {
  const surveyItemId = surveyItemInfo.id
  // templateTypes: 'invididual' | 'summary' | 'summaryIndividual'
  // if all templates are not selected, do nothing
  if (!templateTypes || !templateTypes.length) {
    return
  }

  // generate template name
  const generateTemplateFileName = (tmptType) => {
    let name = sanitizeFilename(surveyItemInfo.title) + '_sampleTemplate' + tmptType.replace(/^\S/, (s) => s.toUpperCase())
    if (name.length > 250) {
      name = name.substr(0, 250)
    }

    // avoid duplicated template name, will append postfix to the template name, like  "_(1)" or "_(2)", etc.
    const hasDuplicatedFile = allTemplates.find((tmpt) => {
      return tmpt.name === name + '.docx'
    })
    if (hasDuplicatedFile) {
      let theCurrentIdx = 0
      allTemplates.filter((tmpt) => {
        if (tmpt.name === name + '.docx' || tmpt.name.startsWith(name + '_(')) {
          const regex = new RegExp(`${name}_\\((\\d+)\\)`)
          const match = tmpt.name.match(regex)
          if (match && !isNaN(match[1])) {
            if (Number(match[1]) > theCurrentIdx) {
              theCurrentIdx = Number(match[1])
            }
          }
          return true
        }
        return false
      })
      theCurrentIdx++
      name += '_(' + theCurrentIdx + ')'
    }
    return name
  }

  // create sample template
  // todo: call the generateExamTemplateFromServer function instead.
  const generateSampleTemplate = (templateType: string) => {
    const fileName = generateTemplateFileName(templateType)

    return getDefaultWordTemplate(featureLayerUrl, surveyItemId, templateType)
      .then((file) => {
        const settingString = getTemplateSectionSettingString({ templateType: templateType })
        return { fileBlob: file, fileName: fileName, templateSectionSetting: [settingString] }
      })
      .catch((err) => {
        return new Promise((resolve) => {
          let detail = getErrorStr(err)
          if (err && err.status === 500 && err.response instanceof Blob) {
            const reader = new FileReader()
            reader.onload = () => {
              const errorStr: any = reader.result
              let errorJson = {}
              try {
                errorJson = JSON.parse(errorStr || '{}')
                detail = getErrorStr(errorJson)
                resolve(detail)
              } catch (e) {
                resolve(detail)
              }
            }
            reader.readAsText(err.response)
          } else {
            resolve(detail)
          }
        }).then((detail) => {
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw { message: detail }
        })
      })
  }
  // upload sample template file
  const uploadSamplateTemplate = (file: { fileBlob, fileName, templateSectionSetting }) => {
    const templateFile = file.fileBlob.slice(0, file.fileBlob.size, '')
    templateFile.lastModifiedDate = new Date()
    templateFile.name = file.fileName + '.docx'
    // formData.append('file', templateFile, file.fileName + '.docx')
    const formData = {
      title: file.fileName,
      filename: file.fileName + '.docx',
      snippet: 'Sample template',
      file: templateFile
    }
    return addCustomPrintingItem(
      surveyItemInfo,
      formData as any,
      null,
      file.templateSectionSetting
    )
      .then((res) => {
        if (res && res.id) {
          return res
        } else {
          throw res.error
        }
      })
  }

  const promiseArr = []
  // sort createRreportTemplates to make sure summaryIndividual will firstly uploaded, then summary, then individual
  const types: string[] = ['summaryIndividual', 'summary', 'individual']
  types.forEach((type) => {
    if (templateTypes.includes(type)) {
    // this template type is selected
      promiseArr.push(generateSampleTemplate(type))
    }
  })

  // batch generateSampleTemplate
  return Promise.all(promiseArr)
    .then((files) => {
      // let result: any[] = []
      // generate succeed, upload template one by one
      return files.reduce((promise, currentFile) => {
        return promise.then((result) => {
          return uploadSamplateTemplate(currentFile).then((_res) => {
            currentFile.id = _res.id
            result.push(currentFile)
            return result
          })
        })
      }, Promise.resolve([]))
    })
    .catch((err) => {
      // todo: how to show error?
    })
}

/**
 * add custom printing file (e.g. word) as an item and
 * add a relationship from a survey to the item by survey2data relationship.
 * @param survey
 * @param itemParams
 * @param file: File
 * @return itemInfo
 */
function addCustomPrintingItem (surveyItemInfo: any, itemParams: any, currentUser: any, sectionTypeKeywords?: string[]): Promise<any> {
  let itemId
  const isSurveyOwner: boolean = surveyItemInfo.isOwner // currentUser.username === survey.getFormItemInfo('owner') ? true : false
  const isAdmin = surveyItemInfo.isAdmin // survey.isItemAdmin() && this._user.isAdmin()

  const user = getAppStore().getState().user

  return Promise.resolve(true)
    .then(() => {
      if (!surveyItemInfo || !itemParams) {
        throw Error('Failed to create custom print item.')
      }
      return true
    })
    // todo: check if the portal support survey2data relation
    // todo: check if the portal support view fs
    .then(() => {
      const ownerFolerId = surveyItemInfo.ownerFolder

      const reportTemplateConfig = reportMergeCommonConfig.templateItem ||
        {
          type: 'Microsoft Word',
          typeKeywords: {
            survey123: 'Survey123',
            survey123Hub: 'Survey123 Hub',
            printTemplate: 'Print Template',
            featureReportTemplate: 'Feature Report Template'
          },
          tags: [
            'Survey123',
            'Exb',
            'Print Template',
            'Feature Report Template'
          ]
        }
      // add custom printing as a portal item
      let typeKeywords = [reportTemplateConfig.typeKeywords.survey123, reportTemplateConfig.typeKeywords.survey123Hub, reportTemplateConfig.typeKeywords.printTemplate, reportTemplateConfig.typeKeywords.featureReportTemplate, surveyItemInfo.id]
      if (sectionTypeKeywords && sectionTypeKeywords.length) {
        typeKeywords = typeKeywords.concat(sectionTypeKeywords)
      }
      const params = Object.assign({
        item: {
          title: itemParams.title,
          type: reportTemplateConfig.type,
          tags: reportTemplateConfig.tags,
          snippet: itemParams.snippet,
          typeKeywords: typeKeywords
        },
        filename: itemParams.filename,
        file: itemParams.file,
        folderId: ownerFolerId
      }, getBaseRequestOptions())

      if (isSurveyOwner) {
        // if is survey owner, directly upload the template to owner folder
        return esri.restPortal.createItem(params) // this.arcgisItemService.addItem(itemParams, ownerFolerId)
      } else if (isAdmin) {
        // if is org admin
        params.folderId = null
        return esri.restPortal.createItem(params).then((_res) => {
          // get owner folder name
          return esri.restPortal.getUserContent(Object.assign({
            owner: surveyItemInfo.owner,
            folderId: ownerFolerId
          }, getBaseRequestOptions()))
            .then((folder) => {
              // and reassign it to survey owner
              return esri.restPortal.reassignItem(Object.assign({
                currentOwner: user.username,
                id: _res.id,
                owner: surveyItemInfo.owner,
                targetUsername: surveyItemInfo.owner,
                // https://developers.arcgis.com/rest/users-groups-and-items/reassign-item.htm If the item is to be moved to the root folder, specify the value as "/" (forward slash)
                targetFolderName: (folder && folder.currentFolder && folder.currentFolder.title) || '/'
              }, getBaseRequestOptions()))
                .then((reAssigned: { success: boolean, itemId: string }) => {
                  return {
                    success: reAssigned.success,
                    id: reAssigned.itemId
                  }
                })
            })
        })
      } else {
        //
      }
    })
    .catch((err) => {
      throw err.error || err
    })
    .then((res: any) => {
      if (!res || res.error) {
        throw Error(res && res.error)
      }
      itemId = res.id
      // add relationship from the survey to the item
      return esri.restPortal.addItemRelationship(Object.assign({
        originItemId: surveyItemInfo.id,
        owner: surveyItemInfo.owner,
        destinationItemId: itemId,
        relationshipType: 'Survey2Data'
      }, getBaseRequestOptions()))
    })
    .then((res: any) => {
      if (!res || res.error || !res.success) {
        throw Error(res && res.error)
      }

      return shareCustomPrintingItem(surveyItemInfo.id, itemId)
    })
    .then((res: any) => {
      return {
        success: true,
        id: itemId
      }
      // todo: share the custom print item to be identical with the stakholder view
    })
}

/**
 * share custom printint item
 * @param surveyItemId
 * @param customPrintingItemId
 */
export function shareCustomPrintingItem (surveyItemId: any, customPrintingItemId: string): Promise<boolean> {
  return getStakeholderViewFeatureService(surveyItemId)
    .then((stakeholderViewInfo) => {
      /**
       * check if stakeholder view is existed
       * if yes, need to share the customPrinting item with the sharing setting of stakeholder
       * But need to check if the portal supports view fs, if not, we should use source fs (#1775)
       */
      let targetItemId, itemOwner, folderId
      if (stakeholderViewInfo) {
        targetItemId = stakeholderViewInfo.id || stakeholderViewInfo.itemId
        itemOwner = stakeholderViewInfo.owner
        folderId = stakeholderViewInfo.ownerFolder
      }

      if (!targetItemId) {
        throw new Error('NO_TARGET_ITEM_ID')
      }
      return getUserItem({
        itemId: targetItemId, //customPrintingItemId,
        itemOwner: itemOwner,
        folderId: folderId
      })
    })
    .then((result: any) => {
      if (!result || result.error) {
        console.log(result.error)
      }

      // get stakehodler item sharing info
      const sharing: any = result.sharing
      const sharingParams: any = {}

      if (sharing.access === 'public') { sharingParams.everyone = true }
      if (sharing.access === 'org') { sharingParams.org = true }
      sharingParams.groups = sharing.groups
      sharingParams.items = [customPrintingItemId]
      sharingParams.itemOwner = result.item?.owner || getCredentialInfo().username
      /**
       * when the items will be shared with groups that have item update capability so that any member of such groups can update the items that are shared with them.
       */
      sharingParams.confirmItemControl = true

      const params = Object.assign({}, sharingParams, {
        items: sharingParams.items.join(','),
        groups: sharingParams.groups.join(',')
      }, getBaseRequestOptions())
      // esri.restPortal.getSharingUrl
      return shareItem(params)
      // return this.arcgisItemService.shareItems(params, {
      //   itemOwner: survey.getFormItemInfo('owner')
      // });
    })
    .then((result: any) => {
      if (!result || result.error || !result.results) {
        console.log(result.error)
      }
      if (result.results) {
        const errors = result.results.filter((obj, i) => !obj.success)
        if (errors.length > 0) {
          console.log(errors.map((err, i) => err.error.message).join('; '))
        }
        return true
      }
    }).catch((err) => {
      if (err && err.message === 'NO_TARGET_ITEM_ID') {
        return false
      }
    })
}

// get stakeholder view feature service
export function getStakeholderViewFeatureService (surveyItemId: any): Promise<any> {
  const cache = getSurveyService('stakeholder')
  if (cache) {
    return Promise.resolve(cache)
  }
  return Promise.resolve(true)
    .then(() => {
      /**
       * for hosted feature service > looking for stakholder view typekeyword
       * for non-hosted feature service > skip it
       */
      let queryString = `type:Feature Service AND typekeywords:${surveyItemId} AND typekeywords:${viewFeatureService.stakeholder.typeKeyword}`
      queryString += ' AND ((typekeywords:Hosted Service AND typekeywords:View Service) OR (NOT typekeywords:Hosted Service))'

      const params = {
        q: queryString,
        portalUrl: getCredentialInfo().portalUrl,
        authentication: SessionManager.getInstance().getSessionByUrl(getAppStore().getState().portalUrl)
      }
      return esri.restPortal.searchItems(params).then((res: any) => {
        if (!res || res.error) { throw new Error(JSON.stringify(res)) }
        if (res.results && res.results.length === 0) { return null }
        return res.results[0]
      })
    })
    .then((res) => {
      if (res) {
        setSurveyService('stakeholder', {
          itemId: res.id,
          url: res.url.replace(/^http:\/\//i, 'https://'),
          typeKeywords: res.typeKeywords,
          owner: res.owner,
          itemControl: res.itemControl,
          access: res.access,
          title: res.title,
          type: res.type
        })
      }
      return res
    })
}

/**
 * getUserItem
 * @param options
 * @param commonParams
 */
export function getUserItem (
  options: {
    itemId: string
    itemOwner: string
    folderId?: string
  }
): Promise<any> {
  // options
  options = Object.assign({
    itemId: null,
    itemOwner: null
  }, options || {})

  let userUrl = `${esri.restPortal.getPortalUrl(getBaseRequestOptions())}/content/users/${options.itemOwner}`
  if (options.folderId) {
    userUrl = `${userUrl}/${options.folderId}`
  }

  const url = `${userUrl}/items/${options.itemId}`
  const session = SessionManager.getInstance().getMainSession()
  // const url = `${getAppStore().getState().portalUrl}/sharing/rest/`
  const reqParam = {
    httpMethod: 'GET' as HTTPMethods,
    authentication: session
  }

  return esri.restRequest.request(url, reqParam)
  // return esri.restRequest.get
  // return get(url, null, null, commonParams);
}

/**
 * share item
 * @param options
 * @returns
 */
function shareItem (
  options: {
    itemId: string
    itemOwner: string
    folderId?: string
    confirmItemControl?: boolean
    groups?: any
    items?: string
    org?: any
  }
) {
  options = Object.assign({
    itemId: null,
    itemOwner: null
  }, options || {})

  const url = `${esri.restPortal.getPortalUrl(getBaseRequestOptions())}/content/users/${options.itemOwner}/shareItems`
  const session = SessionManager.getInstance().getMainSession()
  const requestOptions = {
    confirmItemControl: options.confirmItemControl,
    groups: options.groups,
    items: options.items,
    org: options.org
  }
  const reqParam = {
    params: requestOptions,
    httpMethod: 'POST' as HTTPMethods,
    authentication: session
  }

  return esri.restRequest.request(url, reqParam)
}

/**
 * set survey service
 * @param type
 * @param obj
 */
export function setSurveyService (type: string, obj: any) {
  surveyServices[type] = obj
}

/**
 * get survey service
 * @param type
 * @returns
 */
export function getSurveyService (type?: string) {
  return type ? surveyServices[type] : surveyServices
}

/**
 * reset survey services
 */
export function resetSurveyServices () {
  surveyServices = {}
}
/**
 * upload template, including editing existing template and upload new template
 * @param template
 * @param templates
 * @param surveyItemInfo
 * @returns
 */
export function uploadTemplate (template: any, templates: any[], surveyItemInfo: any, editDisabled?: boolean, ignoreUpdateRequest?: boolean): Promise<any> {
  const templateItemParam = {
    title: template.title,
    snippet: template.snippet ? template.snippet : '',
    typeKeywords: template.typeKeywords
  }

  const nameValid = checkTemplateNameValid(template, templates)

  // nofile
  if (!template.name && !template.file) {
    template.noFile = true
    return
  }

  // name invalid or no file
  if (!nameValid || template.noFile === true) {
    return
  }
  return Promise.resolve(true)
    .then(() => {
      if (template.id) {
        if (!editDisabled && !ignoreUpdateRequest) {
          if (template.file) {
            // upload
            return updateCustomPrintingItem(
              surveyItemInfo,
              template,
              templateItemParam,
              template.templateSectionSetting,
              template.file
            )
          } else {
          // edit existing template
            return updateCustomPrintingItem(
              surveyItemInfo,
              template,
              templateItemParam,
              template.templateSectionSetting
            )
          }
        } else {
          return template
        }
      } else {
        const formParam: any = Object.assign({}, templateItemParam)
        formParam.file = template.file
        return addCustomPrintingItem(
          surveyItemInfo,
          formParam,
          template.templateSectionSetting
        )
      }
    })
}

/**
 * get survey123 url
 */
export function getSurvey123Url (): string {
  const obj = getAppStore().getState().queryObject

  const objStr = obj ? obj.survey123 : ''
  const urlString = objStr ? decodeURIComponent(objStr + '') : ''
  const val = _urlParamToJson(urlString)
  const queryObj = val

  /**
   * Beijing-R-D-Center/ExperienceBuilder/issues/88
   * we need to check url host to see which survey123 host url we will use
   * wabbuild.esri.com > survey123dec.arcgis.com
   * experiencedev.arcgis.com > survey123dev.arcgis.com
   * experienceqa.arcgis.com > survey123qa.arcgis.com
   * experience.arcgis.com > survey123.arcgis.com
   * default > survey123.arcgis.com
   *
   */
  let url = 'https://survey123.arcgis.com'
  // todo: in the future, if feature report supports on premise, need to read survey url from portal
  // if (surveyUrlFromPortal) {
  //   url = this.surveyUrlFromPortal
  // }
  let env = window.jimuConfig.hostEnv as any
  if (queryObj && queryObj.env) {
    env = queryObj.env + ''
    // when the env is a url: refer to: https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/5975#issuecomment-2866368
    if (env.startsWith('http://') || env.startsWith('https://')) {
      return env
    }
  }

  // if the url mode is like https://survey123${subName}.arcgis.com, will let the env from url work,
  // otherwise, ignore the env from url.
  let isNormalSurveyUrl = true
  if (url !== 'https://survey123.arcgis.com') {
    const matchRst = url.match(/https:\/\/survey123(\.[^\.]*)\.arcgis\.com/)
    isNormalSurveyUrl = !!((matchRst && matchRst.length))
  }
  if (env && env !== 'prd' && env !== 'prod' && isNormalSurveyUrl) {
    url = `https://survey123${env}.arcgis.com`
  }
  return url
}

/**
 * get survey123 rest url
 */
export function getSurvey123RestApi (): string {
  return getSurvey123Url() + '/api'
}

/**
 * update custom printing file (e.g. word)
 * @param survey: Survey item info
 * @param template: template item info
 * @param templateParam: new template item parameter
 * @return iteminfo : ArcGISPortal.Item
 */
function updateCustomPrintingItem (survey: any, template: any, templateParam: any, sectionTypeKeywords: string[], customPrintingFile?: File): Promise<any> {
  // let isSupportViewFS: boolean = true
  const itemId = template.id
  const params: any = Object.assign({}, templateParam, { type: reportMergeCommonConfig.templateItem.type })

  return new Promise((resolve, reject) => {
    if (!survey || !templateParam || !itemId) {
      throw new Error('Missing parameter.')
    }
    resolve(true)
  })
    .then((_isSupportViewFS: boolean) => {
      if (customPrintingFile) {
        params.file = customPrintingFile
      }

      // append sectionCountTypeKeywords to TypeKeywords
      if (sectionTypeKeywords && sectionTypeKeywords.length) {
        let typeKeywordsArr = params.typeKeywords || []
        const finderIndex = typeKeywordsArr.findIndex((item) => item.match(/Section Count .*\|.*/g))
        if (finderIndex > -1) {
          typeKeywordsArr[finderIndex] = sectionTypeKeywords[0]
        } else {
          typeKeywordsArr = typeKeywordsArr.concat(sectionTypeKeywords)
        }
        params.typeKeywords = typeKeywordsArr.join(',')
      }
      params.folderId = survey.ownerFolder
      params.itemOwner = survey.owner
      params.owner = survey.owner
      return esri.restPortal.updateItem(Object.assign({
        item: Object.assign({ id: itemId }, params)
      }, getBaseRequestOptions()))
    })
    .then((res: any) => {
      if (!res || res.error || !res.success) {
        throw new Error(res.error)
      }
      // let item = survey.getReportTemplateItem({ id: itemId }) || {}
      template = Object.assign(template, params)
      return template
    })
}

/**
 * delete printTemplate
 * @param template
 */
export function deleteReportTemplate (template: any, surveyItemInfo: any): Promise<any> {
  // template.isDeleting = true
  const itemId = template.id
  return new Promise((resolve, reject) => {
    if (!surveyItemInfo || !itemId) {
      throw new Error('Failed to delte report template')
    }
    resolve(true)
  })
    .then((res: boolean) => {
      return esri.restPortal.removeItem(Object.assign({ id: itemId, owner: surveyItemInfo.owner }, getBaseRequestOptions()))
    })
    .then((res: any) => {
      if (!res || res.error || !res.success) {
        throw new Error(res.error)
      }
      return itemId
    })
    // .catch((err: any) => {
    //   console.error('Failed to delete report template', err)
    // })
}

/**
 * check the name validation
 * @param thisEditingTemplate
 * @param printTemplates
 * @returns
 */
export function checkTemplateNameValid (thisEditingTemplate: any, printTemplates: any[]) {
  const thisTitle = thisEditingTemplate.title
  const finder = printTemplates.find((item) => {
    return item.title === thisTitle
  })

  if (
    thisTitle &&
    thisTitle.length > 0 &&
    (!finder || (finder && finder.id === thisEditingTemplate.id))
  ) {
    // template name is valid
    return true
  } else {
    return false
  }
}

export function generateExamTemplateFromServer (featureLayerUrl: string, surveyItemInfo: any, type: 'summaryIndividual' | 'summary' | 'individual') {
  // if (isGeneratingSampleTemplate) {
  //   return
  // }
  let fileName = sanitizeFilename(surveyItemInfo.title) + '_sampleTemplate' + type.replace(/^\S/, (s) => s.toUpperCase())
  if (fileName.length > 250) {
    fileName = fileName.substr(0, 250)
  }

  return getDefaultWordTemplate(featureLayerUrl, surveyItemInfo.id, type).then((res) => {
    if (res) {
      fileSaver.saveAs((res as any).slice(0, (res as any).size, ''), fileName + '.docx')
    } else {
      console.error('Failed to generate sample template')
    }
    return true
    // isGeneratingSampleTemplate = false
  }).catch((err) => {
    return new Promise((resolve) => {
      let detail = getErrorStr(err)
      if (err && err.status === 500 && err.response instanceof Blob) {
        const reader = new FileReader()
        reader.onload = () => {
          const errorStr: any = reader.result
          let errorJson = {}
          try {
            errorJson = JSON.parse(errorStr || '{}')
            detail = getErrorStr(errorJson)
            resolve(detail)
          } catch (e) {
            resolve(detail)
          }
        }
        reader.readAsText(err.response)
      } else {
        resolve(detail)
      }
    }).then((detail) => {
      console.error('Failed to generate sample template', detail)
    })

    // isGeneratingSampleTemplate = false
  })
}

/**
 * genetae quick reference ual
 * @param options
 * @returns
 */
export function getReportQuickReferenceUrl (featureLayerUrl: string, surveyItemId: string, locale: string) {
  const url = `${getSurvey123Url()}/featureReport/quickReference?`
  const params = {
    surveyItemId: surveyItemId,
    featureLayerUrl: featureLayerUrl,
    locale: locale || 'en',
    portalUrl: getCredentialInfo().portalUrl,
    token: getCredentialInfo().token
  }
  const queryParams = []
  const keySort = [
    'surveyItemId',
    'featureLayerUrl',
    'locale',
    'portalUrl',
    'token'
  ]

  Object.keys(params)
    .sort((a, b) => {
      // sort params in url
      return keySort.indexOf(a) - keySort.indexOf(b)
    })
    .forEach((key) => {
      const keyVal = params[key]
      if (keyVal) {
        queryParams.push(`${key}=${keyVal}`)
      }
    })
  return url + queryParams.join('&')
}

/**
 * get custom printing file url (e.g. word)
 * @param itemId: String
 * @return string
 */
function getCustomPrintingFileUrl (itemId: string, username: string, token: string): string {
  const portalUrl = getAppStore().getState().portalUrl
  return `${portalUrlUtils.getItemUrl(portalUrl, itemId)}/data?username=${username}&token=${token}`
}

/**
 * get Template Section Setting String `Section Count 1|2`
 * @param options
 */
function getTemplateSectionSettingString (options: { individualSectionCount?: number, summarySectionCount?: number, templateType?: string }) {
  let individualSectionCount = 0
  let summarySectionCount = 0
  if (options.templateType) {
    switch (options.templateType) {
      case 'individual':
        individualSectionCount = 1
        break
      case 'summary':
        summarySectionCount = 1
        break
      case 'summaryIndividual':
        individualSectionCount = 1
        summarySectionCount = 1
        break
      default:
        //
        break
    }
  } else {
    individualSectionCount = options.individualSectionCount
    summarySectionCount = options.summarySectionCount
  }
  return `Section Count ${individualSectionCount}|${summarySectionCount}`
}

/**
 * get and parse error message form server
 * @param err
 * @returns
 */
function getErrorStr (err) {
  let detail = ''
  if (err) {
    if (typeof err === 'string') {
      detail = err
    } else if (err.error && typeof err.error === 'string') {
      detail = err.error
    } else if (err.error && err.error.message) {
      detail = err.error.message
    } else if (!detail && err.status && err.statusText) {
      detail = err.status + ' ' + err.statusText
    } else if (!detail && err.status && !err.statusText) {
      detail = 'Error code: ' + err.status
    }
  }
  return detail
}
/**
 * getDefaultWordTemplate
 */
function getDefaultWordTemplate (featureLayerUrl, surveyItemId, contentType) {
  const portalUrl = getCredentialInfo().portalUrl
  const token = getCredentialInfo().token

  const url = getSurvey123RestApi() + '/featureReport/createSampleTemplate'
  // return this.request.post(url, params)
  // request the blob content

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    for (const key in telemetryHeaders) {
      xhr.setRequestHeader(key, telemetryHeaders[key])
    }
    xhr.responseType = 'blob'

    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response
        resolve(blob)
      } else {
        reject(xhr)
      }
    }

    const para = `featureLayerUrl=${featureLayerUrl}&surveyItemId=${surveyItemId}&contentType=${contentType}&portalUrl=${portalUrl}&token=${token}`
    xhr.send(para)
  })
}

/**
 * getBaseRequestOptions
 * @returns
 */
function getBaseRequestOptions (): any {
  const sessionManager = SessionManager.getInstance()
  const portalUrl = getAppStore().getState().portalUrl
  const portal = portalUrlUtils.getPortalRestUrl(portalUrl)

  return {
    authentication: sessionManager.getSessionByUrl(portalUrl),
    portal: portal
  }
}

/**
 * sanitize file name
 * @param str
 * @returns
 */
export function sanitizeFilename (str: string) {
  // only allow latin word, number, unserscore, - and dot
  const allowedRe = /[^\w\-\.]/g
  const sanitized = str.replace(allowedRe, '_')
  return sanitized.trim()
}

/**
 * parse a url parameter to json, if the parameter string is simple, keep it as string
 * @param str  eg: 0.q2:pie1.q3:{"type":"map","basemapItemId":"{itemId}"}2.q11:{"type":"wordCloud","show":"response"}
 * @param urlKey
 */
function _urlParamToJson (str: string): any {
  if (!str) {
    return null
  }
  str = str + ''
  const subObjs = str.split('')
  if (subObjs.length < 2 && str.split(':').length < 2) {
    // this url parameter has no sub parameters
    if (str.split(',').length > 1) {
      // consider it as an array
      return str.split(',')
    } else {
      return str
    }
  } else {
    const obj = {}
    subObjs.forEach((subStr) => {
      const keyVals = (subStr + '').split(':')
      if (keyVals.length > 1) {
        const key = keyVals[0]
        let val = (Array.isArray(keyVals.slice(1)) ? keyVals.slice(1) : []).join(':') as any
        if (val.length && val[0] === '{') {
          // try to parse it to a json
          val = _stringToJson(val)
        }
        if (typeof val === 'string') {
          if (val.split(',').length > 1) {
            // consider it as an array
            val = val.split(',')
          }
        }
        obj[key] = val
      }
    })
    return obj
  }
}

function _stringToJson (str: string): any {
  let result = str
  try {
    result = JSON.parse(str)
  } catch (e) {
    result = str
  }
  return result
}

/**
 * get local timezone offset
 */
function _getLocalTimezoneOffset () {
  const timezoneOffsetMin = (new Date()).getTimezoneOffset()
  let offsetHrs: any = Math.abs(timezoneOffsetMin / 60)
  let offsetMin: any = Math.abs(timezoneOffsetMin % 60)

  if (offsetHrs < 10) {
    offsetHrs = '0' + offsetHrs
  }

  if (offsetMin < 10) {
    offsetMin = '0' + offsetMin
  }

  // Add an opposite sign to the offset
  const direction = (timezoneOffsetMin <= 0) ? '+' : '-'
  const timezoneOffset = direction + offsetHrs + ':' + offsetMin

  // "±hh:mm"
  return timezoneOffset
}

/**
 * get credentialInfo
 * @returns
 */
function getCredentialInfo () {
  const portalUrl = getAppStore().getState().portalUrl
  const session = SessionManager.getInstance().getSessionByUrl(portalUrl)
  const token = session ? session.token : ''
  const user = getAppStore().getState().user
  const username = user ? user.username : ''
  return {
    token: token,
    portalUrl: portalUrl,
    username: username
  }
}

export function downloadFile (jobObj, openInNewtab?) {
  const token = getCredentialInfo().token

  if (!jobObj || !jobObj.resultInfo || !jobObj.resultInfo.resultFiles) {
    return
  }
  const resultFiles = jobObj.resultInfo.resultFiles

  resultFiles.forEach((item, idx) => {
    const downloadUrl = item.url
    if (!downloadUrl) {
      const itemId = item.id || ''
      const portalUrl = getAppStore().getState().portalUrl
      return `${portalUrlUtils.getItemUrl(portalUrl, itemId)}/data?token=${token}`
    }

    if (idx > 0) {
      setTimeout(() => {
        startDownload(downloadUrl, openInNewtab)
      }, 3000)
    } else {
      startDownload(downloadUrl, openInNewtab)
    }
  })
}

function startDownload (url: string, openInNewtab = false) {
  let cachedFun: any = null
  // prevent showing the leave-page-prompt when downloading
  if (!openInNewtab) {
    cachedFun = window.onbeforeunload
    window.onbeforeunload = null
  }
  try {
    const a = document.createElement('a')
    a.style.display = 'block'
    document.body.appendChild(a)
    a.setAttribute('href', url)
    a.setAttribute('download', 'true')
    if (openInNewtab) {
      a.setAttribute('target', '_blank')
    }
    a.click()
    a.remove()
  } catch { } finally {
    if (!openInNewtab) {
      window.onbeforeunload = cachedFun
    }
  }
}
