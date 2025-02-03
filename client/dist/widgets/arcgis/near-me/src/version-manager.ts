import { WidgetVersionManager, OrderRule, type WidgetUpgradeInfo, DataSourceManager } from 'jimu-core'
import { AnalysisTypeName, type IMConfig } from './config'
import { defaultConfigInfo } from './setting/constants'
import { getAllFieldsNames, getUseDataSourcesForAllDs } from './common/utils'

class VersionManager extends WidgetVersionManager {
  versions: any[] = [{
    version: '1.13.0',
    description: 'To avoid crash, reset the previous configuration from beta release',
    upgrader: (oldConfig: IMConfig) => {
      let newConfig = oldConfig
      //Add settings for promptTextMessage which is newly added in configuration
      newConfig = newConfig.setIn(['generalSettings', 'promptTextMessage'], '')
      newConfig = newConfig.setIn(['generalSettings', 'promptTextMsgStyleSettings'], {
        fontFamily: 'Avenir Next',
        fontBold: false,
        fontItalic: false,
        fontUnderline: false,
        fontStrike: false,
        fontColor: 'var(--black)',
        fontSize: '12px'
      })
      //Reset the previous analysis configuration (as those are of beta version and in this first release version we did major changes)
      if (newConfig.configInfo) {
        for (const dsId in newConfig.configInfo) {
          newConfig = newConfig.setIn(['configInfo', dsId], defaultConfigInfo)
        }
      }
      return newConfig
    }
  }, {
    version: '1.14.0',
    description: 'Upgrade search settings and analysis settings config',
    upgrader: (oldConfig: IMConfig) => {
      let newConfig = oldConfig
      //Add the following settings which is newly added in configuration
      if (newConfig.configInfo) {
        for (const dsId in newConfig.configInfo) {
          const oldSearchSettingConfig = oldConfig.configInfo[dsId].searchSettings
          //values depends on previous config
          newConfig = newConfig.setIn(['configInfo', dsId, 'searchSettings', 'showInputAddress'], true)
          newConfig = newConfig.setIn(['configInfo', dsId, 'searchSettings', 'headingLabelStyle'], {
            fontFamily: 'Avenir Next',
            fontBold: false,
            fontItalic: false,
            fontUnderline: false,
            fontStrike: false,
            fontColor: 'var(--black)',
            fontSize: '13px'
          })
          newConfig = newConfig.setIn(['configInfo', dsId, 'searchSettings', 'sketchTools'], {
            showPoint: oldSearchSettingConfig.showSketchTools,
            showPolyline: oldSearchSettingConfig.showSketchTools,
            showPolygon: oldSearchSettingConfig.showSketchTools
          })
          newConfig = newConfig.setIn(['configInfo', dsId, 'analysisSettings', 'displayMapSymbols'], false)
          newConfig = newConfig.setIn(['configInfo', dsId, 'analysisSettings', 'showDistFromInputLocation'], oldSearchSettingConfig.showDistFromInputLocation)
          newConfig = newConfig.setIn(['configInfo', dsId, 'analysisSettings', 'onlyShowLayersResult'], oldSearchSettingConfig.onlyShowLayersResult)
        }
      }
      return newConfig
    }
  }, {
    version: '1.15.0',
    description: 'Upgrade analysis setting config for fieldsToExport, group, sub-group and use data sources with fields',
    upgradeFullInfo: true,
    upgrader: async (oldInfo: WidgetUpgradeInfo) => {
      let newConfig = oldInfo.widgetJson.config
      const defaultSubGroupFeaturesInfo = {
        subGroupFeaturesByField: '',
        subGroupFeaturesOrder: OrderRule.Asc,
        sortSubGroupsByCount: false,
        noValueSubGroupLabel: ''
      }
      //In earlier version functionality, fieldsToExport config parameter was not present in the config
      //In order to get the data source for getting all the fields for fieldsToExport
      //We need to create the data source using the configured use data source
      const defArr: Array<Promise<any>> = []
      const createdDs = []
      if (newConfig.configInfo) {
        const dsManager = DataSourceManager.getInstance()
        for (const dsId in newConfig.configInfo) {
          newConfig.configInfo[dsId].analysisSettings.layersInfo.length > 0 &&
            newConfig.configInfo[dsId].analysisSettings.layersInfo.forEach(async (layerInfo) => {
              if (layerInfo.useDataSource && !createdDs.includes(layerInfo.useDataSource.dataSourceId)) {
                //create the data source only once as we can configure multiple same analysis layers
                createdDs.push(layerInfo.useDataSource.dataSourceId)
                defArr.push(dsManager.createDataSourceByUseDataSource(layerInfo.useDataSource))
              }
            })
        }
      }
      //Wait for all the created data sources
      await Promise.allSettled(defArr)
      //Add the following settings which is newly added in configuration
      if (newConfig.configInfo) {
        for (const dsId in newConfig.configInfo) {
          newConfig.configInfo[dsId].analysisSettings.layersInfo.length > 0 &&
            newConfig.configInfo[dsId].analysisSettings.layersInfo.forEach(async (layerInfo, i) => {
              newConfig = newConfig.setIn(['configInfo', dsId, 'analysisSettings', 'layersInfo', i, 'analysisInfo', 'fieldsToExport'], getAllFieldsNames(layerInfo.useDataSource.dataSourceId))
              if (layerInfo.analysisInfo.analysisType !== AnalysisTypeName.Summary) {
                newConfig = newConfig.setIn(['configInfo', dsId, 'analysisSettings', 'layersInfo', i, 'analysisInfo', 'includeApproxDistance'], false)
              }
              if (layerInfo.analysisInfo.analysisType === AnalysisTypeName.Proximity) {
                //values depends on previous config
                const oldSortGroupsByCountConfig = oldInfo.widgetJson.config.configInfo[dsId].analysisSettings.layersInfo[i].analysisInfo.sortGroupsByCount
                newConfig = newConfig.setIn(['configInfo', dsId, 'analysisSettings', 'layersInfo', i, 'analysisInfo', 'groupFeatures', 'sortGroupsByCount'], oldSortGroupsByCountConfig)
                newConfig = newConfig.setIn(['configInfo', dsId, 'analysisSettings', 'layersInfo', i, 'analysisInfo', 'groupFeatures', 'noValueGroupLabel'], '')
                //add default subgroup info, as in earlier version functionality of subGroupFeatures was not present
                newConfig = newConfig.setIn(['configInfo', dsId, 'analysisSettings', 'layersInfo', i, 'analysisInfo', 'subGroupFeatures'], defaultSubGroupFeaturesInfo)
              }
            })
        }
      }
      let widgetJson = oldInfo.widgetJson.set('config', newConfig)
      widgetJson = widgetJson.set('useDataSources', getUseDataSourcesForAllDs(widgetJson.config.configInfo))
      const updatedInfo = { ...oldInfo, widgetJson }
      return updatedInfo
    }
  }, {
    version: '1.16.0',
    description: 'Upgrade analysis settings config',
    upgrader: async (oldConfig: IMConfig) => {
      let newConfig = oldConfig
      const defArr: Array<Promise<any>> = []
      const createdDs = []
      const dsManager = DataSourceManager.getInstance()
      if (newConfig.configInfo) {
        for (const dsId in newConfig.configInfo) {
          newConfig = newConfig.setIn(['configInfo', dsId, 'analysisSettings', 'displayAllLayersResult'], false)
          newConfig.configInfo[dsId].analysisSettings.layersInfo.length > 0 &&
            newConfig.configInfo[dsId].analysisSettings.layersInfo.forEach(async (layerInfo, i) => {
              if (layerInfo.useDataSource && !createdDs.includes(layerInfo.useDataSource.dataSourceId)) {
                //create the data source only once as we can configure multiple same analysis layers
                createdDs.push(layerInfo.useDataSource.dataSourceId)
                defArr.push(dsManager.createDataSourceByUseDataSource(layerInfo.useDataSource))
              }
            })
        }
      }
      //Wait for all the created data sources
      await Promise.allSettled(defArr)

      //Add the following settings which is newly added in configuration
      if (newConfig.configInfo) {
        for (const dsId in newConfig.configInfo) {
          newConfig = newConfig.setIn(['configInfo', dsId, 'analysisSettings', 'displayAllLayersResult'], false)
          newConfig = newConfig.setIn(['configInfo', dsId, 'analysisSettings', 'enableProximitySearch'], false)
          newConfig.configInfo[dsId].analysisSettings.layersInfo.length > 0 &&
            newConfig.configInfo[dsId].analysisSettings.layersInfo.forEach(async (layerInfo, i) => {
              const layerDs = dsManager.getDataSource(layerInfo.useDataSource.dataSourceId)
              // if the layer's geomtry is polygon then only add the returnIntersectedPolygons property in the analysis info config
              if (layerDs?.getGeometryType() === 'esriGeometryPolygon' && (layerInfo.analysisInfo.analysisType === AnalysisTypeName.Closest || layerInfo.analysisInfo.analysisType === AnalysisTypeName.Proximity)) {
                newConfig = newConfig.setIn(['configInfo', dsId, 'analysisSettings', 'layersInfo', i, 'analysisInfo', 'returnIntersectedPolygons'], false)
              }
            })
        }
      }
      return newConfig
    }
  }]
}

export const versionManager = new VersionManager()
