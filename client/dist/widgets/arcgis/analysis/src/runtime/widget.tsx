/** @jsx jsx */
import { type JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import {
  React, jsx, type AllWidgetProps, loadArcGISJSAPIModules, css, uuidv1, Immutable, hooks, lodash, SessionManager, type IMState, ReactRedux, type ImmutableObject, dataSourceUtils, DataSourceManager,
  MutableStoreManager
} from 'jimu-core'
import { type IMConfig, type SubmissionData, type ToolConfig, ToolType, type StandardToolConfig, type HistoryItemWithDs, type StandardToolOption, type AnalysisGPJobSubmitted, type CustomToolOutput } from '../config'
import defaultMessages from './translations/default'
import { Alert, AlertPopup, defaultMessages as jimuiDefaultMessages, Loading, Tab, Tabs } from 'jimu-ui'
import HistoryList from './history/history-list'

import 'calcite-components' // Needed to pull calcite in for ArcGis* components
import '@arcgis/analysis-tool-app/dist/analysis-tool-app/analysis-tool-app.css'
import '@arcgis/analysis-components/dist/analysis-components/analysis-components.css'
// @ts-expect-error
import { setAssetPath as setAnalysisComponentsAssetPath } from '@arcgis/analysis-components'
// @ts-expect-error
import { setAssetPath as setAnalysisToolAppAssetPath } from '@arcgis/analysis-tool-app'

import { defineCustomElements } from '@arcgis/app-components/dist/loader'

import { defineCustomElements as geoenrichmentComponentsDefineCustomElements } from '@arcgis/geoenrichment-components/dist/loader'

import { defineCustomElements as arcgisRasterFunctionEditorDefineCustomElements } from '@arcgis/arcgis-raster-function-editor/dist/loader'

import HistoryDetail from './history/history-detail'
import { type AnalysisGPJobStatus, AnalysisJobStatus, isWarningCreditMessage, type AnalysisJobResults } from '@arcgis/analysis-shared-utils'
import { type GPFeatureRecordSetLayer, type AnalysisToolData } from '@arcgis/analysis-ui-schema'
import { addLayerToMapByDs, createDsByResults, getCustomToolResultIndexByDsMapKey, getDsJsonFromArcGISService, getNextResultDsId, jobDidComplete, removeEmptyResults } from './utils'
import { useHistoryList } from '../utils/history'
import AnalysisTool from './analysis-tool'
import { Placeholder } from './components/placeholder'
import { deleteToolsHasNoMatchedUtility, destroyDataSources, filterHistoryItemMessages, getMessageLevel, useAnalysisEnginesAccess, useGetDisplayedToolName, wait } from '../utils/util'
import ToolList from './analysis-tool/tool-list'
import { type AlertType } from 'jimu-ui/lib/components/alert/type'
import { getAnalysisAssetPath, getAssetsPathByFolderName, useToolInfoStrings } from '../utils/strings'

import { type AnalysisToolAppContainerCustomEvent } from '@arcgis/analysis-tool-app'
import { AnalysisCoreEvents, notifyJobStatus } from '../utils/events'
import { ClientJobIdPrefix, cancelJob } from '@arcgis/analysis-core'
import { getAppConfigAction } from 'jimu-for-builder'
import { type FeatureLayerDataSourceConstructorOptions } from 'jimu-core/data-source'
import { versionManager } from '../version-manager'

const { useState, useMemo, useCallback, useEffect, useRef } = React

const useStyle = (isRTL: boolean, hideBorder: boolean) => {
  return useMemo(() => {
    return css`
      ${hideBorder && css`
        border: none !important;
      `}
      .jimu-tab {
        0.625rem;
      }
      .tab-nav {
        height: 2.5rem;
        .nav-link:not(:disabled):not(.disabled).active {
          font-weight: 600;
        }
        .nav-link:not(.active) {
          border-bottom: 1px solid var(--ref-palette-neutral-300);
          font-weight: 500;
        }
        .nav-item+.nav-item {
          margin-left: 0;
        }
      }
      .tab-content {
        flex-basis: 0;
      }
      .job-status-alert {
        position: absolute;
        bottom: 0.25rem;
        left: 0.25rem;
        right: 0.25rem;
        width: auto !important;
        z-index: 1;
      }
      .flip-icon {
        transform: ${`rotate(${isRTL ? 180 : 0}deg)`};
      }
    `
  }, [hideBorder, isRTL])
}

interface Props extends AllWidgetProps<IMConfig> {
  mutableStateProps: {
    toolId: string
    input: {
      [parameterName: string]: GPFeatureRecordSetLayer
    }
  }
}

const Widget = (props: Props) => {
  const { useMapWidgetIds, portalUrl, config, widgetId, theme, mutableStateProps, locale } = props

  const { toolList } = config

  useEffect(() => {
    defineCustomElements(window, { resourcesUrl: getAssetsPathByFolderName('arcgis-app-assets') })
    geoenrichmentComponentsDefineCustomElements(window, { resourcesUrl: getAssetsPathByFolderName('arcgis-geoenrichment-components-assets') })
    arcgisRasterFunctionEditorDefineCustomElements(window, { resourcesUrl: getAssetsPathByFolderName('arcgis-raster-function-editor-assets') })
    setAnalysisToolAppAssetPath(getAnalysisAssetPath())
    setAnalysisComponentsAssetPath(getAnalysisAssetPath())
    // import css for @arcgis/geoenrichment-components
    const headElement = document.getElementsByTagName('head')?.[0]
    const linkClassName = 'arcgis-geoenrichment-components-theme-data-browser'
    if (headElement) {
      if (!headElement.getElementsByClassName(linkClassName)?.length) {
        const linkElement = document.createElement('link')
        linkElement.className = linkClassName
        linkElement.rel = 'stylesheet'
        linkElement.href = `${getAssetsPathByFolderName('arcgis-geoenrichment-components-assets')}geoenrichment/themes/data-browser.css`
        headElement.appendChild(linkElement)
      }
    }

    // since in builder, layout will stop propagation for click event on #app,
    // and the sketch tools clear function is called in a document click event listener (useCapture = false)
    // so need to remove the analysis sketch tools manully here
    let documentClickHandler
    if (window.jimuConfig.isInBuilder) {
      documentClickHandler = (event: MouseEvent) => {
        const clickedElement = event.target

        const elementName = (clickedElement as HTMLElement).tagName

        if (elementName.includes('ANALYSIS-')) {
          const sketchTools = document.querySelector('arcgis-sketch-layer-editor-tools')
          const refElement = sketchTools?.refElement

          // only remove if the sketch tool is created inner analysis-layer-input, avoid affecting other widgets that use the sketch tool
          if (sketchTools && refElement?.tagName === 'ANALYSIS-LAYER-INPUT') {
            (refElement as any)?.removeAnalysisSketch()
          }
        }
      }
      document.addEventListener('click', documentClickHandler, true)
    }

    return () => {
      if (documentClickHandler) {
        document.removeEventListener('click', documentClickHandler, true)
      }
    }
  }, [])

  const translate = hooks.useTranslation(defaultMessages, jimuiDefaultMessages)
  const toolInfoStrings = useToolInfoStrings()

  const [currentJimuMapView, setCurrentJimuMapView] = useState<JimuMapView>(null)

  useEffect(() => {
    if (!useMapWidgetIds?.[0]) {
      setCurrentJimuMapView(null)
    }
  }, [useMapWidgetIds])

  const [selectedTab, setSelectedTab] = useState('tools')

  const [currentToolId, setCurrentToolId] = useState('')

  const prevToolListLength = hooks.usePrevious(toolList.length)
  useEffect(() => {
    // if only has one tool, open it directly
    if (toolList.length === 1 && currentToolId !== toolList[0].id) {
      setCurrentToolId(toolList[0].id)
      return
    }
    // if the second tool is added, show tool list
    if (prevToolListLength === 1 && toolList.length === 2) {
      setCurrentToolId('')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolList.length])

  const currentToolInfo = useMemo(() => {
    if (!currentToolId || !toolList.length) {
      return null
    }
    return toolList.find((t) => t.id === currentToolId)
  }, [currentToolId, toolList])

  const [backFromToolId, setBackFromToolId] = useState('')

  const updateMutableStateInput = useCallback((value) => {
    MutableStoreManager.getInstance().updateStateValue(widgetId, 'input', value)
  }, [widgetId])

  const updateMutableStateToolId = useCallback((value) => {
    MutableStoreManager.getInstance().updateStateValue(widgetId, 'toolId', value)
  }, [widgetId])

  const onToolBack = useCallback(() => {
    setBackFromToolId(currentToolId)
    setCurrentToolId('')
    setOpenedTool(null)

    updateMutableStateToolId(null)
    updateMutableStateInput(null)
  }, [currentToolId, updateMutableStateInput, updateMutableStateToolId])

  const [portal, setPortal] = useState<__esri.Portal>()
  const PortalModule = useRef<typeof __esri.Portal>()

  const updatePortal = useCallback(() => {
    const Portal = PortalModule.current
    const newPortal = new Portal({ url: portalUrl })
    return newPortal.load().then(() => {
      // add fake user
      if (!newPortal?.user) {
        newPortal.user = { portal: newPortal, sourceJSON: {} } as __esri.PortalUser
      }
      setPortal(newPortal)
    })
  }, [portalUrl])

  useEffect(() => {
    loadArcGISJSAPIModules([
      'esri/portal/Portal'
    ]).then(modules => {
      const [Portal] = modules as [typeof __esri.Portal]
      PortalModule.current = Portal

      updatePortal()
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [loaded, setLoaded] = useState(false)
  // if has multiple tools or no tool, load tool list directly
  useEffect(() => {
    if (toolList.length !== 1) {
      setLoaded(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // if only have one tool, will display the tool directly, analysis-tool-app-container will fetch toolJSON use portal, so must wait for portal init
  useEffect(() => {
    if (!loaded && toolList.length === 1 && portal) {
      setLoaded(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portal])

  const dsOrderRef = useRef(1)

  const { historyList, historyListFromMap, historyListFromTools, setHistoryListFromTools } = useHistoryList(widgetId, currentJimuMapView, config, dsOrderRef)

  const [jobStatusAlertInfo, setJobStatusAlertInfo] = useState<{ type: AlertType, text: string }>(null)

  const getDisplayedToolName = useGetDisplayedToolName()

  const showJobStatusAlert = useCallback((historyItem: HistoryItemWithDs) => {
    const { jobStatus, messages } = historyItem.jobInfo
    const hasWarnings = messages.some((message: __esri.GPMessage) => message?.type === 'warning' && !isWarningCreditMessage(message))
    const jobCompleted = jobDidComplete(jobStatus)

    // Map each completed job status to a translated string
    const unsuccessfulJobStatusStringMap = {
      [AnalysisJobStatus.Failed]: 'jobAlertStatusFailed',
      [AnalysisJobStatus.Canceled]: 'jobAlertStatusCancelled',
      [AnalysisJobStatus.TimedOut]: 'tobAlertStatusTimedOut',
      [AnalysisJobStatus.Deleted]: 'jobAlertStatusDeleted'
    }

    const tool = toolList.find((tool) => tool.id === historyItem.toolId)
    const translatedToolName = getDisplayedToolName(tool)

    // Get alert message based on job status and warnings
    let alertMessageString: string
    let type: AlertType = 'success'
    if (jobCompleted) {
      if (jobStatus === AnalysisJobStatus.Succeeded) {
        alertMessageString = hasWarnings ? 'jobAlertStatusSucceededWithWarnings' : 'jobAlertStatusSucceededWithoutWarnings'
        type = hasWarnings ? 'warning' : 'success'
      } else {
        alertMessageString = unsuccessfulJobStatusStringMap[jobStatus as keyof typeof unsuccessfulJobStatusStringMap]
        type = 'error'
      }
    } else {
      alertMessageString = 'submittedAlertLabel'
    }

    const text = translate(alertMessageString, { toolName: translatedToolName })

    setJobStatusAlertInfo({ type, text })
  }, [getDisplayedToolName, toolList, translate])

  const handleJobStart = useCallback((toolId: string, jobInfo: __esri.JobInfo, submissionData: SubmissionData) => {
    const toolInfo = toolList.find((tool) => tool.id === toolId)
    if (!toolInfo) {
      return
    }
    jobInfo.messages = filterHistoryItemMessages(jobInfo.messages, toolInfo.type, getMessageLevel(toolInfo))
    const newHistoryItem: HistoryItemWithDs = {
      ...submissionData,
      id: uuidv1(),
      category: 'tools',
      toolId,
      jobInfo,
      startTimestamp: new Date().getTime(), // UTC timestamp
      endTimestamp: undefined,
      results: null
    }
    setHistoryListFromTools((list) => {
      return [...list, newHistoryItem]
    })
    showJobStatusAlert(newHistoryItem)
    setSelectedTab('history')
    setCurrentHistoryId('')
  }, [setHistoryListFromTools, showJobStatusAlert, toolList])

  const handleJobStatusChange = useCallback(async (jobInfo: __esri.JobInfo, results?: __esri.ParameterValue[]) => {
    const historyIndex = historyListFromTools.findIndex((item) => item.jobInfo?.jobId === jobInfo?.jobId)
    if (historyIndex === -1) {
      return
    }
    const originHistory = historyListFromTools[historyIndex]
    const { toolId } = originHistory
    const toolInfo = toolList.find((tool) => tool.id === toolId)
    if (!toolInfo) {
      return
    }
    jobInfo.messages = filterHistoryItemMessages(jobInfo.messages, toolInfo.type, getMessageLevel(toolInfo))
    const historyProps: Partial<HistoryItemWithDs> = {}
    historyProps.jobInfo = jobInfo

    // Check if job finished
    if (jobDidComplete(jobInfo.jobStatus)) {
      // if (jobInfo.jobStatus !== 'job-succeeded' && jobInfo.jobStatus !== 'job-cancelled') {
      //   // This is set for instances where analysisCoreResultDataComplete is not called.
      //   history.endTimestamp = Date.now()
      // }
      historyProps.endTimestamp = Date.now()
    }

    if (results) {
      const filteredResults = removeEmptyResults(results)
      historyProps.results = filteredResults
    }

    // update the end timestamp and results for history first
    setHistoryListFromTools((list) => {
      const newList = [...list]
      const history = { ...newList[historyIndex], ...historyProps }
      newList[historyIndex] = history

      if (jobDidComplete(history.jobInfo.jobStatus)) {
        showJobStatusAlert(history)
      }
      return newList
    })

    if (results) {
      const { dsMap, dsCreateError } = await createDsByResults(widgetId, toolInfo.type, historyProps.results, toolInfo.config.output, originHistory, dsOrderRef)
      if (toolInfo.type !== ToolType.Custom && (toolInfo.config as StandardToolConfig).output.addResultLayersToMapAuto && dsMap) {
        if (dsMap.size === 1) {
          const ds = Array.from(dsMap.values())[0]
          addLayerToMapByDs(ds, currentJimuMapView, toolInfo.id)
        } else {
          // for standard tools has multiple layers in result, if open add to map auto,
          // use feature service url to create a new temp dataSource to ensure all layers are added to map as a whole like map viewer,
          // destroy the dataSource after added to map
          const featureServiceUrls = new Set<string>(
            results
              .map((r) => (r.value as any)?.url)
              .filter((url) => !!url)
              .map((url) => dataSourceUtils.getFullArcGISServiceUrl(url, false))
          )
          for (const serviceUrl of featureServiceUrls) {
            try {
              const dsId = getNextResultDsId(widgetId, dsOrderRef.current)
              const dsJson = await getDsJsonFromArcGISService(serviceUrl, dsId)
              const ds = await DataSourceManager.getInstance().createDataSource({
                id: dsId,
                dataSourceJson: Immutable(dsJson).set('label', dataSourceUtils.getLabelFromArcGISServiceUrl(serviceUrl))
              } as FeatureLayerDataSourceConstructorOptions)

              await addLayerToMapByDs(ds, currentJimuMapView, toolInfo.id)
              DataSourceManager.getInstance().destroyDataSource(dsId)
            } catch (error) {
              console.log('add to map auto error', error)
            }
          }
        }
      }
      if (toolInfo.type === ToolType.Custom && dsMap) {
        const addToMapAutoInfo = (toolInfo.config as StandardToolConfig).output.addResultLayersToMapAuto
        dsMap.forEach((ds, key) => {
          const index = getCustomToolResultIndexByDsMapKey(key)
          const paramName = results[index].paramName
          const allowAddToMapAuto = addToMapAutoInfo?.[paramName]
          if (allowAddToMapAuto) {
            addLayerToMapByDs(ds, currentJimuMapView, toolInfo.id, toolInfo.config.output as CustomToolOutput, paramName)
          }
        })
      }
      // after data source is created, update the history list
      setHistoryListFromTools((list) => {
        const newList = [...list]
        newList[historyIndex] = { ...newList[historyIndex], dsMap, dsCreateError }
        return newList
      })
    }
  }, [currentJimuMapView, historyListFromTools, setHistoryListFromTools, showJobStatusAlert, toolList, widgetId])

  // use widgetContainer to listen to analysisCore events to ensure the task can be finished even if the tool panel is closed
  const [widgetContainer, setWidgetContainer] = useState<HTMLDivElement>(null)

  const [jobStartInfo, setJobStartInfo] = useState<{ toolId: string, jobInfo: __esri.JobInfo, submissionData: SubmissionData }>()
  const [jobStatusChangeInfo, setJobStatusChangeInfo] = useState<{ jobInfo: __esri.JobInfo, results?: __esri.ParameterValue[] }>()

  useEffect(() => {
    if (jobStartInfo) {
      const { toolId, jobInfo, submissionData } = jobStartInfo
      handleJobStart(toolId, jobInfo, submissionData)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobStartInfo])

  useEffect(() => {
    if (jobStatusChangeInfo) {
      const { jobInfo, results } = jobStatusChangeInfo
      handleJobStatusChange(jobInfo, results)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobStatusChangeInfo])

  useEffect(() => {
    if (widgetContainer) {
      widgetContainer.addEventListener(AnalysisCoreEvents.JobSubmited, (e: AnalysisToolAppContainerCustomEvent<AnalysisGPJobSubmitted>) => {
        const { toolId, submissionData, jobInfo } = e.detail
        setJobStartInfo({ toolId, jobInfo, submissionData })
      })
      widgetContainer.addEventListener(AnalysisCoreEvents.JobStatus, (e: AnalysisToolAppContainerCustomEvent<AnalysisGPJobStatus>) => {
        const { jobInfo } = e.detail
        setJobStatusChangeInfo({ jobInfo })
      })
      widgetContainer.addEventListener(AnalysisCoreEvents.ResultDataComplete, (e: AnalysisToolAppContainerCustomEvent<AnalysisJobResults>) => {
        const { jobInfo, results } = e.detail
        if (jobInfo.jobId.includes(ClientJobIdPrefix)) {
          // For sync jobs JobSubmited and ResultDataComplete events are emitted at the same time,
          // so the update of results should delay to make sure the history item created.
          setTimeout(() => {
            setJobStatusChangeInfo({ jobInfo, results })
          })
        } else {
          setJobStatusChangeInfo({ jobInfo, results })
        }
      })
    }
  }, [widgetContainer])

  const [currentHistoryId, setCurrentHistoryId] = useState('')

  useEffect(() => {
    if (!historyList.length) {
      setCurrentHistoryId('')
    }
  }, [historyList?.length])

  const currentHistoryDetail = useMemo(() => {
    if (!currentHistoryId) {
      return null
    }
    return historyList.find((h) => h.id === currentHistoryId)
  }, [historyList, currentHistoryId])

  const currentHistoryToolInfo = useMemo(() => {
    return toolList.find((tool) => tool.id === currentHistoryDetail?.toolId)
  }, [currentHistoryDetail?.toolId, toolList])

  const [openedTool, setOpenedTool] = useState<{ toolInfo: ToolConfig, jobParams: AnalysisToolData, toolUiParameters?: AnalysisToolData }>(null)
  const [openedHistoryId, setOpenedHistoryId] = useState('')

  const handleOpenTool = (historyId: string) => {
    // when open tool, reset currentToolId and openedTool first, then set openedTool in next render, this can force render the AnalysisTool
    // this can fix both credit clean and console error when click "open tool"
    onToolBack()
    setOpenedHistoryId(historyId)
  }

  useEffect(() => {
    if (openedHistoryId) {
      const historyItem = historyList.find((h) => h.id === openedHistoryId)
      if (!historyItem) {
        return
      }
      const toolInfo = toolList.asMutable({ deep: true }).find((tool) => tool.id === historyItem.toolId)
      if (!toolInfo) {
        return
      }
      setOpenedTool({
        toolInfo,
        jobParams: historyItem?.jobParams,
        toolUiParameters: historyItem?.toolUiParameters
      })
      setSelectedTab('tools')
      setOpenedHistoryId('')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedHistoryId])

  const handleRemoveHistory = (historyId: string) => {
    const index = historyListFromTools.findIndex((h) => h.id === historyId)
    if (index < 0) {
      return
    }
    const newHistoryList = [...historyListFromTools]
    const removedHistory = newHistoryList.splice(index, 1)[0]
    if (removedHistory.dsMap) {
      destroyDataSources([removedHistory.dsMap], widgetId)
    }
    setHistoryListFromTools(newHistoryList)
  }

  const [historyIdToCancel, setHistoryIdToCancel] = useState('')

  const handleCancelJob = async (historyId: string) => {
    const index = historyListFromTools.findIndex((h) => h.id === historyId)
    const historyItemToCancel = historyListFromTools[index]
    const tool = toolList.find((tool) => tool.id === historyItemToCancel.toolId)
    if (!tool) {
      return
    }
    const jobInfo = historyItemToCancel.jobInfo
    if (jobInfo.jobStatus !== AnalysisJobStatus.Executing) {
      return
    }
    const { jobStatus, messages } = await cancelJob(historyItemToCancel.jobInfo, widgetContainer)

    // for case: job already completed in waitForJobCompletion, but cancelJob return an uncompleted status, like: job-cancelling (depend on the two promises's return order)
    if (jobDidComplete(historyItemToCancel.jobInfo.jobStatus) && !jobDidComplete(jobStatus)) {
      return
    }

    // for case: cancelJob throw error, so after cancelJob, the job is still uncompleted, but cancelJob interrupt the waitForJobCompletion polling, start a new polling here
    if (!jobDidComplete(jobStatus)) {
      let newJobInfo = jobInfo
      while (!jobDidComplete(newJobInfo.jobStatus)) {
        await wait(500)
        newJobInfo = await newJobInfo.checkJobStatus()
        // notify on every update while cancelling
        notifyJobStatus(widgetContainer, { jobInfo: newJobInfo })
      }
      return
    }

    // for case: cancel success and job not completed in waitForJobCompletion
    if (jobStatus !== historyItemToCancel.jobInfo.jobStatus) {
      jobInfo.jobStatus = jobStatus
      jobInfo.messages = filterHistoryItemMessages(messages, tool.type, getMessageLevel(tool))
    }
    handleJobStatusChange(jobInfo)
  }

  const handleHistoryBack = useCallback(() => {
    setCurrentHistoryId('')
  }, [])

  const signIn = useCallback((toolInfo: ImmutableObject<ToolConfig>) => {
    if (toolInfo.type === ToolType.Custom) {
      // custom tool will show tool detail directly, will sign in only if click run button
      return Promise.resolve()
    }
    if (SessionManager.getInstance().getMainSession()) {
      // already signed in, but in other widgets, this widget does not have user info
      if (portal && !portal.user) {
        updatePortal()
      }
      // already signed in, and has user info
      return Promise.resolve()
    }
    // not signed in
    return SessionManager.getInstance().signIn().then(() => {
      updatePortal()
    }).catch((error) => {
      return Promise.reject(error)
    })
  }, [portal, updatePortal])

  const utilitiesState = ReactRedux.useSelector((state: IMState) => {
    return state.appConfig.utilities
  })

  useEffect(() => {
    const newToolList = deleteToolsHasNoMatchedUtility(toolList, utilitiesState)
    if (newToolList.length < toolList.length) {
      getAppConfigAction().editWidgetConfig(widgetId, config.set('toolList', newToolList)).exec()
      // the code below for widgets in inactive pages
      // if tool count change from 1 to 0, the loaded may be false, since one tool must wait portal initialed to become loaded, so need to change loaded to true here
      if (toolList.length === 1 && !newToolList.length && !loaded) {
        setLoaded(true)
      }
      // if tool count change from n to 1, portal may not be initialed yet, should change the loaded to false to avoid error in analysis
      if (toolList.length > 1 && newToolList.length === 1 && !portal) {
        setLoaded(false)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [utilitiesState])

  const canAccessAnalysisEngines = useAnalysisEnginesAccess(portal)

  const currentDisplayedToolProps = useMemo(() => {
    if (!currentToolInfo && !openedTool) {
      return null
    }
    const presetMapHistory = currentToolInfo
      ? historyListFromMap.find((h) => {
        return currentToolInfo.type !== ToolType.Custom && (currentToolInfo.config.option as StandardToolOption).presetFromMapHistoryId === h.id
      })
      : null

    const toolInfo = Immutable(currentToolInfo || openedTool.toolInfo)
    return {
      locale,
      theme,
      appContainer: widgetContainer,
      widgetId,
      jimuMapView: currentJimuMapView,
      portal,
      toolInfo,
      jobParams: lodash.cloneDeep(openedTool ? openedTool.jobParams : presetMapHistory ? presetMapHistory.jobParams : undefined),
      toolUiParameters: openedTool ? openedTool.toolUiParameters : presetMapHistory ? presetMapHistory.toolUiParameters : undefined,
      disableBack: toolList.length === 1,
      translatedTitle: toolList.length === 1 ? getDisplayedToolName(toolInfo) : undefined,
      hasAccess: toolInfo.type === ToolType.Custom ? true : canAccessAnalysisEngines(toolInfo.analysisEngine),
      jobParamsFromOtherWidgets: mutableStateProps?.toolId === toolInfo.id && mutableStateProps?.input ? mutableStateProps?.input : undefined,
      updateJobParamsFromOtherWidgets: updateMutableStateInput,
      onBack: onToolBack,
      signIn
    }
  }, [canAccessAnalysisEngines, currentJimuMapView, currentToolInfo, getDisplayedToolName, historyListFromMap, locale, mutableStateProps?.input, mutableStateProps?.toolId, onToolBack, openedTool, portal, signIn, theme, toolList.length, updateMutableStateInput, widgetContainer, widgetId])

  const isRTL = ReactRedux.useSelector((state: IMState) => {
    return state.appContext.isRTL
  })

  const style = useStyle(isRTL, !toolList.length)

  // set analysis input data action
  useEffect(() => {
    const currentOpenedToolId = (currentToolInfo || openedTool?.toolInfo)?.id
    if (mutableStateProps?.toolId) {
      if (currentOpenedToolId !== mutableStateProps?.toolId) {
        setCurrentToolId(mutableStateProps.toolId)
      }
      if (selectedTab !== 'tools') {
        setSelectedTab('tools')
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutableStateProps?.toolId])

  return loaded
    ? <div className='widget-analysis jimu-widget surface-1 border-0' css={style} ref={setWidgetContainer}>
      <Placeholder widgetId={widgetId} show={!toolList.length} />
      {toolList.length > 0 && toolInfoStrings && <Tabs className='h-100' type='underline' fill defaultValue='tools' value={selectedTab} onChange={setSelectedTab}>
        <Tab id='tools' title={translate('tools')}>
          <React.Fragment>
            <div className='tool-container h-100'>
              {currentDisplayedToolProps
                ? <AnalysisTool {...currentDisplayedToolProps} />
                : <ToolList toolList={toolList} backFromToolId={backFromToolId} onSelect={setCurrentToolId} />}
            </div>
          </React.Fragment>
        </Tab>
        <Tab id='history' title={translate('history')}>
          <Alert className='job-status-alert' autoFocus closable withIcon form="basic" open={!!jobStatusAlertInfo} onClose={() => { setJobStatusAlertInfo(null) }} text={jobStatusAlertInfo?.text} type={jobStatusAlertInfo?.type} />
          {currentHistoryDetail && currentHistoryToolInfo
            ? <HistoryDetail historyItem={currentHistoryDetail} portal={portal} widgetId={widgetId} toolInfo={currentHistoryToolInfo} jimuMapView={currentJimuMapView} onBack={handleHistoryBack} />
            : <HistoryList
                portal={portal} historyList={historyList}
                jimuMapView={currentJimuMapView}
                toolList={toolList}
                onViewDetails={setCurrentHistoryId} onOpenTool={handleOpenTool}
                onRemove={handleRemoveHistory} onCancelJob={setHistoryIdToCancel} />}
        </Tab>
      </Tabs>}
      <JimuMapViewComponent
        useMapWidgetId={useMapWidgetIds?.[0]}
        onActiveViewChange={setCurrentJimuMapView}
      />
      <AlertPopup
        okLabel={translate('cancelAnalysis')} cancelLabel={translate('keepRunning')} hideHeader isOpen={!!historyIdToCancel}
        onClickOk={() => {
          handleCancelJob(historyIdToCancel)
          setHistoryIdToCancel('')
        }}
        onClickClose={() => { setHistoryIdToCancel('') }}>
        {translate('cancelWarningText')}
      </AlertPopup>
    </div>
    : <Loading />
}

Widget.versionManager = versionManager

export default Widget
