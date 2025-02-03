/** @jsx jsx */
import { React, jsx, css, type AllWidgetProps, appActions, type IMState, ReactRedux, type ImmutableArray, classNames, hooks } from 'jimu-core'
import { WidgetPlaceholder, defaultMessages as jimuiDefaultMessage } from 'jimu-ui'
import { JimuMapViewComponent, type JimuMapView, type JimuMapViewGroup } from 'jimu-arcgis'
import { type IMConfig, ModeType, type PrintTemplateProperties, type OutputDataSourceWarningOption } from '../config'
import widgetPrintOutlined from 'jimu-icons/svg/outlined/brand/widget-print.svg'
import defaultMessage from './translations/default'
import Classic from './component/classic'
import CompactPrint from './component/compact'
import { checkIsCustomTemplate, checkIsReportsTemplateAvailable } from '../utils/utils'
import { versionManager } from '../version-manager'
import OutputDataSourceListProps from './component/output-datasource-list'
const { useState, useRef, useEffect } = React
type PrintProps = AllWidgetProps<IMConfig>

const Widget = (props: PrintProps) => {
  const { id, config, dispatch, useMapWidgetIds, layoutId, layoutItemId, locale, controllerWidgetId } = props
  const nls = hooks.useTranslation(defaultMessage, jimuiDefaultMessage)
  const selectionIsSelf = ReactRedux.useSelector((state: IMState) => {
    const selection = state?.appRuntimeInfo?.selection
    const selectionIsSelf = !!(selection && selection.layoutId === layoutId && selection.layoutItemId === layoutItemId)
    return selectionIsSelf
  })

  const isSetLayoutRef = useRef(false)
  const showUtilityErrorRemindTimeoutRef = useRef(null)

  const [jimuMapView, setJimuMapView] = useState(null as JimuMapView)
  const [errorTip, setErrorTip] = useState(nls('printPlaceholder'))
  const [templateList, setTemplateList] = useState(null as ImmutableArray<PrintTemplateProperties>)
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0)
  const [outputDataSourceWarning, setOutputDataSourceWarning] = useState(null as OutputDataSourceWarningOption)
  const [showPlaceholder, setShowPlaceholder] = useState(false)
  const [showUtilityErrorRemind, setUtilityErrorRemind] = useState(false)

  const STYLE = css`
    .jimu-widget-placeholder {
      border: none;
    }
    &.surface-1 {
      border: none !important;
    }
    .checkbox-con:hover {
      color: var(--ref-palette-neutral-1100);
    }
  `
  useEffect(() => {
    setListLayoutInWidgetState()
    // eslint-disable-next-line
  }, [selectionIsSelf])

  useEffect(() => {
    getTemplateList()
    // eslint-disable-next-line
  }, [config])

  useEffect(() => {
    checkShowPlaceholder(jimuMapView, templateList, config)
    // eslint-disable-next-line
  }, [templateList, config, jimuMapView])

  const getTemplateList = () => {
    const isCustomTemplate = checkIsCustomTemplate(config?.printServiceType, config?.printTemplateType)
    let template = isCustomTemplate ? config?.printCustomTemplate : config?.printOrgTemplate
    if (config?.supportCustomReport || config?.supportReport) {
      const { defaultCustomReportItem, defaultReportTemplate, supportCustomReport, supportReport } = config
      template = template?.filter(templateItem => {
        const option = {
          defaultCustomReportItem,
          defaultReportTemplate,
          supportCustomReport,
          supportReport,
          reportOptions: templateItem?.reportOptions,
          reportTypes: templateItem?.reportTypes
        }
        const isReportTemplateAvailable = checkIsReportsTemplateAvailable(option)
        return isReportTemplateAvailable
      })
    }
    setTemplateList(template)
  }

  const setListLayoutInWidgetState = () => {
    if (layoutId && id && layoutItemId && !isSetLayoutRef.current && selectionIsSelf) {
      dispatch(
        appActions.widgetStatePropChange(id, 'layoutInfo', {
          layoutId,
          layoutItemId
        })
      )
      isSetLayoutRef.current = true
    }
  }

  const handleSelectedTemplateIndexChange = (index: number) => {
    setSelectedTemplateIndex(index)
  }

  const handleActiveViewChange = (jimuMapView: JimuMapView): void => {
    // Async errors
    if (jimuMapView === null || undefined === jimuMapView) {
      setErrorTip(nls('chooseMapTip'))
      setJimuMapView(null)
      return // skip null
    }

    if (jimuMapView.view.type !== '2d') {
      setErrorTip(nls('chooseMapTip'))
      setJimuMapView(null)
      return // skip 2D
    }

    if (!useMapWidgetIds || useMapWidgetIds?.length === 0) {
      setErrorTip(nls('printPlaceholder'))
    }

    setJimuMapView(jimuMapView)// 2d
  }

  const handleViewGroupCreate = (viewGroup: JimuMapViewGroup): void => {
    // setViewGroup(viewGroup)
  }

  // Render placeholder
  const renderWidgetPlaceholder = (): React.ReactElement => {
    return <WidgetPlaceholder icon={widgetPrintOutlined} widgetId={id} message={getErrorTip()} />
  }

  const getErrorTip = (): string => {
    let errMsg = errorTip
    if (jimuMapView && (!config?.useUtility)) {
      errMsg = ''
    }
    return errMsg
  }

  const toggleUtilityErrorRemind = (isShow = false) => {
    setUtilityErrorRemind(isShow)
    if (isShow) {
      clearTimeout(showUtilityErrorRemindTimeoutRef.current)
      showUtilityErrorRemindTimeoutRef.current = setTimeout(() => {
        setUtilityErrorRemind(false)
      }, 5000)
    }
  }

  // Render map content
  const renderMapContent = () => {
    return (
      <JimuMapViewComponent
        useMapWidgetId={useMapWidgetIds?.[0]}
        onActiveViewChange={handleActiveViewChange}
        onViewGroupCreate={handleViewGroupCreate}
      />
    )
  }

  const checkShowPlaceholder = hooks.useEventCallback((jimuMapView?: JimuMapView, templateList?: ImmutableArray<PrintTemplateProperties>, config?: IMConfig) => {
    const { defaultCustomReportItem, defaultReportTemplate, supportCustomReport, supportReport } = config
    let showPlaceholder = false
    if (!jimuMapView || !config?.useUtility) {
      showPlaceholder = true
      setShowPlaceholder(showPlaceholder)
      return
    }

    if (supportReport || supportCustomReport) {
      let noTemplateAvailable = true
      templateList?.forEach(templateItem => {
        const option = {
          defaultCustomReportItem,
          defaultReportTemplate,
          supportCustomReport,
          supportReport,
          reportOptions: templateItem?.reportOptions,
          reportTypes: templateItem?.reportTypes
        }
        const isReportTemplateAvailable = checkIsReportsTemplateAvailable(option)
        if (isReportTemplateAvailable) {
          noTemplateAvailable = false
        }
      })
      if (noTemplateAvailable) {
        errorTip && setErrorTip(nls('reportTemplateRemind'))
        showPlaceholder = true
      }
    }

    if (!templateList || templateList?.length === 0) {
      showPlaceholder = true
      setErrorTip(null)
    }

    setShowPlaceholder(showPlaceholder)
  })

  const handleWarningLabelChange = (option: OutputDataSourceWarningOption) => {
    setOutputDataSourceWarning(option)
  }

  return (
    <div className={classNames('w-100 h-100', { 'surface-1': config?.modeType === ModeType.Classic })} css={STYLE}>
      <div className='map'>
        <div>{renderMapContent()}</div>
      </div>

      {
        config?.modeType === ModeType.Classic && <div className='w-100 h-100'>
          {!showPlaceholder && <Classic
            outputDataSourceWarning={outputDataSourceWarning}
            handleSelectedTemplateIndexChange={handleSelectedTemplateIndexChange}
            useMapWidgetIds={useMapWidgetIds}
            id={id}
            locale={locale}
            config={config}
            jimuMapView={jimuMapView}
            templateList={templateList}
            showUtilityErrorRemind={showUtilityErrorRemind}
            toggleUtilityErrorRemind={toggleUtilityErrorRemind}
          />}
          {showPlaceholder && renderWidgetPlaceholder()}
        </div>
      }

      {
        config?.modeType === ModeType.Compact && <div className='w-100 h-100'>
          <CompactPrint
            showPlaceholder={showPlaceholder}
            outputDataSourceWarning={outputDataSourceWarning}
            useMapWidgetIds={useMapWidgetIds}
            id={id}
            config={config}
            locale={locale}
            jimuMapView={jimuMapView}
            templateList={templateList}
            controllerWidgetId={controllerWidgetId}
            errorTip={getErrorTip()}
            showUtilityErrorRemind={showUtilityErrorRemind}
            toggleUtilityErrorRemind={toggleUtilityErrorRemind}
          />
        </div>
      }

      {
        (config?.supportReport || config?.supportCustomReport) && <OutputDataSourceListProps id={id} reportOptions={templateList?.[selectedTemplateIndex]?.reportOptions} handleWarningLabelChange={handleWarningLabelChange}/>
      }
    </div>
  )
}
Widget.versionManager = versionManager
export default Widget
