/** @jsx jsx */
import { React, jsx, hooks, type AppInfo, css, AllDataSourceTypes, polished, type UseDataSource, Immutable, type IMDataSourceJson, DataSourceManager, type DataSource, type ImmutableArray, getAppStore } from 'jimu-core'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import { AppItemSelector } from './app-item-selector'
import { Select, Option, Radio, Tooltip, Button, Alert } from 'jimu-ui'
import { type SettingChangeFunction, getAppConfigAction } from 'jimu-for-builder'
import { type IMPrintTemplateProperties, type IMConfig, PrintTemplateType, ReportTypes, type ActiveItem, ReportTemplateTypes } from '../../config'
import { getNewConfigByCustomReportItem, getPortalUrlByUtility } from '../../utils/service-util'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'
import { initTemplateChoiceList, getWhetherIsTable } from '../util/util'
import { getNewConfigWidthNewTemplateItem, getReportTemplateTypes, checkDsIsOutputDs } from '../../utils/utils'
import Loading from './loading'

import defaultMessage from '../translations/default'

const { useState, useEffect } = React

interface Props {
  id: string
  template: IMPrintTemplateProperties
  config: IMConfig
  templateIndex: number
  onSettingChange?: SettingChangeFunction
}

const STYLE = css`
  .report-temp-tip-button {
    padding: 0;
  }
  .radio-con {
    cursor: pointer;
  }
  .warning-alert-con {
    position: absolute;
    top: ${polished.rem(50)};
    right: ${polished.rem(8)};
    left: ${polished.rem(8)};
  }
`

const ReportTemplateSetting = (props: Props) => {
  const nls = hooks.useTranslation(defaultMessage)
  const { id, template, config, templateIndex, onSettingChange } = props

  const [reportItem, setReportItem] = useState(null as ActiveItem)
  const [portalUrl, setPortalUrl] = useState(null)
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    setReportItem(template?.customReportItem)
    //eslint-disable-next-line
  }, [templateIndex])

  useEffect(() => {
    getPortalUrlByUtility(config.useUtility).then(portalUrl => {
      setPortalUrl(portalUrl)
    })
  }, [config.useUtility])

  const toggleLoading = (isShow: boolean = false) => {
    setShowLoading(isShow)
  }

  const handleServiceReportChange = (reportTemplate: string, item) => {
    const index = item.key

    let isHaveNoneItem = false
    if (config.supportCustomReport && template?.reportTypes === ReportTypes.CustomReport) {
      isHaveNoneItem = !config.defaultCustomReportItem
    } else if (config.supportReport && template?.reportTypes === ReportTypes.ServiceReport) {
      isHaveNoneItem = !config.defaultReportTemplate
    }

    const reportTemplateChoiceList = initTemplateChoiceList(config?.reportTemplateChoiceList?.asMutable({ deep: true }), isHaveNoneItem)
    let reportOptions = null
    const isNoneOption = reportTemplateChoiceList[index].reportTemplate === 'None' && isHaveNoneItem && Number(index) === 0
    if (isNoneOption) {
      reportTemplate = ''
    } else {
      reportOptions = reportTemplateChoiceList[index]?.reportOptions || null
    }
    const newTemplate = template.set('reportOptions', reportOptions).set('report', reportTemplate)
    const newConfig = getNewConfigWidthNewTemplateItem(config, templateIndex, newTemplate?.asMutable({ deep: true }))
    onSettingChange({
      id: id,
      config: newConfig
    })
  }

  const handleCustomLayoutChange = async (appInfo: AppInfo) => {
    const customReportId = appInfo.id
    const newReportItem = {
      id: customReportId,
      title: appInfo.title
    }
    setReportItem(newReportItem)
    toggleLoading(true)
    getNewConfigByCustomReportItem(config, newReportItem, templateIndex).then(newConfig => {
      toggleLoading(false)
      onSettingChange({
        id: id,
        config: newConfig
      })
    }, err => {
      setReportItem(template?.customLayoutItem || null)
      toggleLoading(false)
    })
  }

  const useCustomReport = () => {
    let newTemplateItem = template.set('reportTypes', ReportTypes.CustomReport)
    setReportItem(config?.defaultCustomReportItem || null)
    newTemplateItem = newTemplateItem.set('customReportItem', null).set('reportOptions', null)
    const newConfig = getNewConfigWidthNewTemplateItem(config, templateIndex, newTemplateItem?.asMutable({ deep: true }))
    onSettingChange({
      id: id,
      config: newConfig
    })
  }

  const handleUseServiceReport = () => {
    let newTemplateItem = template.set('reportTypes', ReportTypes.ServiceReport)
    let reportOptions = null
    const report = config?.defaultReportTemplate || ''
    if (config?.defaultReportTemplate) {
      config?.reportTemplateChoiceList?.forEach(item => {
        if (item.reportTemplate === config?.defaultReportTemplate) {
          reportOptions = item.reportOptions
        }
      })
    }
    newTemplateItem = newTemplateItem.set('report', report).set('reportOptions', reportOptions)

    const newConfig = getNewConfigWidthNewTemplateItem(config, templateIndex, newTemplateItem?.asMutable({ deep: true }))
    onSettingChange({
      id: id,
      config: newConfig
    })
  }

  const checkIsShowCustomReportSetting = (): boolean => {
    return template?.reportTypes === ReportTypes.CustomReport && config.supportCustomReport
  }

  const handleDsChange = (useDataSources: UseDataSource[], key: string) => {
    const isDsOutputDs = checkDsIsOutputDs(useDataSources[0]?.dataSourceId)
    const newTemplate = template.setIn(['reportOptions', 'reportSectionOverrides', key, 'exbDatasource'], useDataSources).setIn(['reportOptions', 'reportSectionOverrides', key, 'isDsOutputDs'], isDsOutputDs)
    const newConfig = getNewConfigWidthNewTemplateItem(config, templateIndex, newTemplate?.asMutable({ deep: true }))

    const widgets = getAppStore().getState().appStateInBuilder.appConfig?.widgets
    const widgetJson = widgets[id]
    const updateWidgetJson = { id: id } as any
    const appConfigAction = getAppConfigAction()
    const newUseDataSources = widgetJson.useDataSources?.asMutable({ deep: true }) || [] as any
    if (!checkWhetherDsInUseDataSources(useDataSources[0], newUseDataSources) && useDataSources[0]) {
      newUseDataSources.push(useDataSources[0])
    }

    updateWidgetJson.config = newConfig
    updateWidgetJson.useDataSources = newUseDataSources
    appConfigAction.editWidget(updateWidgetJson).exec()
  }

  const checkWhetherDsInUseDataSources = (ds: UseDataSource, useDataSources: ImmutableArray<UseDataSource>): boolean => {
    if (!ds || !useDataSources) return false
    return useDataSources?.some(u => u.dataSourceId === ds.dataSourceId)
  }

  const getReportSelection = () => {
    const supportCustomReport = config.supportCustomReport
    const useServiceReport = !template?.reportTypes || template?.reportTypes === ReportTypes.ServiceReport || !supportCustomReport
    const reportTemplateChoiceList = initTemplateChoiceList(config?.reportTemplateChoiceList?.asMutable({ deep: true }), !config?.defaultReportTemplate)
    const showRadio = supportCustomReport && !config?.defaultCustomReportItem
    return (
      <div role='group' aria-label={nls('report')}>
        {showRadio && <SettingRow>
          <div className='d-flex radio-con align-items-center' title={nls('useServiceReport')} onClick={handleUseServiceReport}>
            <Radio className='mr-1' checked={useServiceReport} title={nls('useServiceReport')}/>
            <span>{nls('useServiceReport')}</span>
          </div>
        </SettingRow>}

        {showRadio && <SettingRow>
            <div className='d-flex radio-con align-items-center' title={nls('useCustomReport')} onClick={useCustomReport}>
              <Radio checked={template?.reportTypes === ReportTypes.CustomReport} className='mr-1' title={nls('useCustomReport')}/>
              <span>{nls('useCustomReport')}</span>
            </div>
          </SettingRow>}

        {useServiceReport && <SettingRow>
          <Select
            value={template?.report || 'None'}
            onChange={(e, item) => { handleServiceReportChange(e.target.value, item) }}
            size='sm'
            disabled={config?.printTemplateType === PrintTemplateType.OrganizationTemplate}
            aria-label={nls('report')}
          >
            {reportTemplateChoiceList?.map((report, index) => {
              return (<Option
                key={index}
                value={report?.reportTemplate}
                title={report?.reportTemplate}
              >
                {report?.reportTemplate}
              </Option>)
            })}
          </Select>
        </SettingRow>}

        {checkIsShowCustomReportSetting() && <SettingRow>
          <AppItemSelector
            portalUrl={portalUrl}
            activeItem={reportItem}
            itemtype='Pro Report'
            excludeType='Pro Report Template'
            size='sm'
            placeholder={nls('selectReportItemPlaceholder')}
            onChange={handleCustomLayoutChange}
          />
        </SettingRow>}

        {showLoading && <Loading className='mt-2' text={nls('checkingReport')}/>}

        {checkIsShowRemind() && <div className='warning-alert-con'>
          <Alert type='warning' text={nls('notSupportReport')} withIcon />
        </div>}
      </div>
    )
  }

  const shouldHideDataSource = (dsJson: IMDataSourceJson): boolean => {
    const isTable = getWhetherIsTable(dsJson)
    if (isTable) {
      return true
    }
    const dsManager = DataSourceManager.getInstance()
    let isLayerInMapService = false
    const checkIsMapService = (ds: DataSource) => {
      if (!isLayerInMapService) {
        if (ds?.parentDataSource?.type === 'MAP_SERVICE') {
          isLayerInMapService = true
        } else if (ds?.parentDataSource?.parentDataSource) {
          checkIsMapService(ds?.parentDataSource?.parentDataSource)
        }
      }
    }
    const dataSource = dsManager.getDataSource(dsJson.id)
    checkIsMapService(dataSource)
    return isLayerInMapService
  }

  const getReportSectionOverridesSetting = () => {
    const reportSectionOverrides = template?.reportOptions?.reportSectionOverrides || Immutable({})
    const reportSectionOverridesLength = Object.keys(reportSectionOverrides)?.length
    if (reportSectionOverridesLength === 0) return

    return <div className='mt-3'>
      {Object.keys(reportSectionOverrides).map((key, index) => {
        const reportItem = reportSectionOverrides[key]
        return (
          <SettingRow label={key} flow='wrap' key={index}>
            <DataSourceSelector
              types={Immutable([AllDataSourceTypes.FeatureLayer])}
              useDataSources={reportItem?.exbDatasource}
              mustUseDataSource
              onChange={ds => { handleDsChange(ds, key) }}
              widgetId={id}
              closeDataSourceListOnChange
              aria-describedby='list-empty-tip'
              hideDataView
              hideDs={shouldHideDataSource}
              // hideTabs={Immutable(['OUTPUT'])}
            />
          </SettingRow>
        )
      })}
    </div>
  }

  const checkIsReportRPTX = hooks.useEventCallback(() => {
    if (!template?.reportOptions) return true
    const reportTemplateType = getReportTemplateTypes(template?.reportOptions)
    const isRPTXReport = reportTemplateType === ReportTemplateTypes.RPTX
    return isRPTXReport
  })

  const checkIsShowRemind = hooks.useEventCallback(() => {
    const onlyHasDefaultReport = config?.supportReport && config?.defaultReportTemplate && !config?.supportCustomReport
    const noCustomReport = template?.reportTypes === ReportTypes.CustomReport && !template?.customReportItem
    if (onlyHasDefaultReport && noCustomReport) {
      return !showLoading
    } else {
      return (!checkIsReportRPTX() && !showLoading)
    }
  })

  const checkIsShowReportSectionOverridesSetting = (): boolean => {
    const isRPTXReport = checkIsReportRPTX()
    return !showLoading && isRPTXReport
  }

  const getLabel = () => {
    return (
      <div className='d-flex align-items-center'>
        <div className='mr-1'>{nls('report')}</div>
        <Tooltip
          title={nls('reportRemind')}
          showArrow
          placement='left'
        >
          <Button className='report-temp-tip-button' type='tertiary' aria-label={nls('reportRemind')}>
            <InfoOutlined size='s'/>
          </Button>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className='custom-layout-setting-con mt-2' css={STYLE}>
      <SettingRow flow='wrap' label={getLabel()}/>
      {getReportSelection()}
      {checkIsShowReportSectionOverridesSetting() && getReportSectionOverridesSetting()}
    </div>
  )
}
export default ReportTemplateSetting
