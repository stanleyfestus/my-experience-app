/* eslint-disable new-cap */
/** @jsx jsx */
import { loadArcGISJSAPIModules } from 'jimu-arcgis'
import {
  React, jsx, type ImmutableObject, hooks, lodash, requestUtils, loadArcGISJSAPIModule, defaultMessages as jimCoreDefaultMessages, css, UtilityManager, ReactRedux, type IMState, esri, SessionManager, portalUrlUtils
} from 'jimu-core'
import { type CustomToolConfig } from '../../config'
import { Alert, Loading, defaultMessages as jimuiDefaultMessages } from 'jimu-ui'
import { type AnalysisToolDataItem, type AnalysisToolData, AnalysisEngine, AnalysisType, type AnalysisToolParam, type LocaleItem, type AnalysisServiceInfo, type AnalysisToolValidationParams, AnalysisToolParamDataType } from '@arcgis/analysis-ui-schema'
import defaultMessages from '../translations/default'
import { type ArcgisWebAnalysisError, calculateParameterValues, getJobParams, getResultParams, getUIOnlyParams, isEmptyDataItem, type SupportedLayer, hasNAPrivilege, type AnalysisGPJobStatus, getAnalysisLayers, ErrorKeywords, formatLearnMoreHelpUrl, getHelpBaseUrl, type SupportedLocales, formatMessage, convertErrorToAnalysisValidationParams, throwError } from '@arcgis/analysis-shared-utils'
// @ts-expect-error
import { type AnalysisToolDataChangeEventDetail, showHelp } from '@arcgis/analysis-components'
import { CalciteFlowItem, CalciteAction, CalciteNotice, CalciteButton } from 'calcite-components'
import { type ToolProps } from './config'
import { useCommonStrings, useErrorMessageStrings, useGPMessageStrings, useHelpMapEnterpriseStrings, useHelpMapStrings } from '../../utils/strings'
import { executeJob } from '../../utils/job'
import { type AnalysisToolAppContainerCustomEvent } from '@arcgis/analysis-tool-app'
import { AnalysisCoreEvents, notifyJobSubmited } from '../../utils/events'
import { getCustomToolUrlWithToken, isAccessBlockedError, serviceSupportUpload, useGetDisplayedToolName, useUpdateObjectByStateEffect } from '../../utils/util'
import { convertJobParamsToToolData, getDefaultToolUIJson, getParameterUIJson, useAnalysisMapLayersFromMap } from '../utils'
import { useJobParamsFromOtherWidgets, usePortalHelpMap } from './utils'

enum ValidityState {
  Valid = 'VALID',
  Warning = 'WARNING',
  Error = 'ERROR'
}

const alertStyle = css`
  position: absolute;
  left: 4px;
  right: 4px;
  bottom: 4px;
  width: auto !important;
  z-index: 1;
`

const { useState, useMemo, useEffect, useRef } = React

const CustomTool = (props: ToolProps) => {
  const { theme, appContainer, jimuMapView, portal, jobParams, toolUiParameters, toolInfo, disableBack, jobParamsFromOtherWidgets, locale, onBack, updateJobParamsFromOtherWidgets } = props

  const { toolName, id: toolId, config: toolConfig } = toolInfo

  const { toolInfo: toolJson, toolUrl, option, utility } = toolConfig as ImmutableObject<CustomToolConfig>

  const webToolServerUrl = useMemo(() => toolUrl.slice(0, toolUrl.lastIndexOf('/')), [toolUrl])

  const getDisplayedToolName = useGetDisplayedToolName()

  const displayedToolName = useMemo(() => getDisplayedToolName(toolInfo), [getDisplayedToolName, toolInfo])

  const mutableToolJson = useMemo(() => toolJson.asMutable({ deep: true }), [toolJson])

  const translate = hooks.useTranslation(defaultMessages, jimuiDefaultMessages, jimCoreDefaultMessages)

  const [geoprocessor, setGeoprocessor] = useState<__esri.geoprocessor>()
  useEffect(() => {
    loadArcGISJSAPIModules(['esri/rest/geoprocessor']).then((modules) => {
      const gp = modules[0] as __esri.geoprocessor
      setGeoprocessor(gp)
    })
  }, [])

  const map = useMemo(() => {
    return jimuMapView?.view?.map
  }, [jimuMapView])

  const [analysisToolContainer, setAnalysisToolContainer] = useState<HTMLAnalysisToolElement>(null)

  const [analysisToolAppLoaded, setAnalysisToolAppLoaded] = useState(false)
  const [analysisToolData, setAnalysisToolData] = useState<CustomEvent<AnalysisToolDataChangeEventDetail>>()

  const [selectedLayers, setSelectedLayers] = useState<SupportedLayer[]>([])
  const [analysisLayers, setAnalysisLayers] = useState<SupportedLayer[]>()
  const allLayers = useMemo(() => [...(analysisLayers ?? []), ...selectedLayers], [analysisLayers, selectedLayers])

  const [defaultJobParams, setDefaultJobParams] = useState<AnalysisToolData>()

  // const [containerParamsUpdated, setContainerParamsUpdated] = useState(false)

  const realJobParams = useMemo(() => jobParams || defaultJobParams, [defaultJobParams, jobParams])

  const analysisToolContainerRef = useRef<HTMLDivElement>(null)
  const setAnalysisToolRef = (ref: HTMLDivElement, recreate: boolean = false) => {
    analysisToolContainerRef.current = ref
    if ((analysisToolContainer && !recreate) || !ref) {
      return
    }

    const container = document.createElement('analysis-tool')
    // container.analysisEngine = 'standard'
    container.isHelpFileExternalAsset = true
    container.usePanel = false
    container.closable = false
    ref.appendChild(container)
    setAnalysisToolContainer(container)
  }

  const changeContainerParamsUpdated = () => {
    // setContainerParamsUpdated(true)
  }

  const mapLayers = useAnalysisMapLayersFromMap(map)
  const commonStrings = useCommonStrings()

  // parameters with selected layers added for "parameterInfos" property of GPValueTable parameters
  const [convertedParameters, setConvertedParameters] = useState<AnalysisToolParam[]>([])

  const utilityJson = ReactRedux.useSelector((state: IMState) => {
    const s = state.appStateInBuilder ?? state
    return s.appConfig.utilities?.[utility?.utilityId]
  })

  const [serviceInfo, setServiceInfo] = useState<AnalysisServiceInfo>()

  const specificUtilityErrorMessageRef = useRef('')

  const handleWebToolRequestError = async (error: Error) => {
    const isAccessBlocked = isAccessBlockedError(error)
    const getError = () => {
      if (isAccessBlocked) {
        return throwError(ErrorKeywords.AccessBlocked, error.message)
      } else {
        return Promise.reject(error)
      }
    }
    // throwError from analysis-shared-utils can throw a localized error message for access blocked case.
    // so must catch the error here to read the localized message to display in our app
    try {
      await getError()
    } catch (error) {
      specificUtilityErrorMessageRef.current = isAccessBlocked ? error.message : ''
      return Promise.reject(error)
    }
  }

  const getServiceInfo = () => {
    const getUtilityServiceInfo = async (): Promise<AnalysisServiceInfo> => {
      // for utility from item, must check item first, if item inaccessible, the tool can't be used anymore even if original gp server is available
      if (utilityJson?.portalUrl && utilityJson?.itemId) {
        const { itemId, portalUrl } = utilityJson

        await esri.restPortal.getItem(itemId, {
          portal: portalUrlUtils.getPortalRestUrl(portalUrl),
          authentication: SessionManager.getInstance().getSessionByUrl(portalUrl)
        })
      }
      return UtilityManager.getServiceInfo(webToolServerUrl).catch(handleWebToolRequestError)
    }

    return getUtilityServiceInfo().then((res) => {
      setServiceInfo(res)
      reportUtilityState(true)
      return res
    }).catch((error) => {
      console.log('Get server info error', error)
      checkErrorAndReportUtilityState(error)
      return Promise.reject(error)
    })
  }
  useEffect(() => {
    setRunAnalysisDisabled(true)
    getServiceInfo().finally(() => {
      setRunAnalysisDisabled(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // add serviceInfo prop
  // other "parameterInfos" will keep intact
  const convertedToolJson = useMemo(() => {
    const parameters = convertedParameters?.length ? convertedParameters : mutableToolJson.parameters
    return {
      ...mutableToolJson,
      serviceInfo,
      parameters: parameters.map((p) => {
        // GPValueTable will be handled in toolUIJSON according to analysis component, only need to handle the GPComposite type here.
        if (p.dataType === AnalysisToolParamDataType.GPComposite && typeof p.defaultValue === 'object') {
          // GPComposite derives `UIparameterInfos` from the `parameterInfos` property from the tool,
          // so `param.parameterInfos` is mutated to directly to apply the unit choices.
          // See `ParameterGroupInput` in factory.tsx in analysis component
          p.parameterInfos = p.parameterInfos?.map((i) => ({ ...i, ...getParameterUIJson(i, translate, portal, commonStrings) }))
        }
        return p
      })
    }
  }, [commonStrings, convertedParameters, mutableToolJson, portal, serviceInfo, translate])

  // show upload button only if GPServer contain "Uploads" capability
  const supportsUpload = useMemo(() => serviceSupportUpload(convertedToolJson?.serviceInfo), [convertedToolJson?.serviceInfo])

  const toolUIJson = useMemo(() => getDefaultToolUIJson(convertedToolJson, translate, portal, commonStrings), [commonStrings, convertedToolJson, portal, translate])

  const portalHelpMap = usePortalHelpMap(portal)

  useUpdateObjectByStateEffect(analysisToolContainer, portal, 'portal')
  useUpdateObjectByStateEffect(analysisToolContainer, portal?.user, 'user')
  useUpdateObjectByStateEffect(analysisToolContainer, jimuMapView?.view, 'mapView')
  useUpdateObjectByStateEffect(analysisToolContainer, toolJson?.helpUrl, 'toolHelpFilePath')
  useUpdateObjectByStateEffect(analysisToolContainer, convertedToolJson, 'toolJson', changeContainerParamsUpdated)
  useUpdateObjectByStateEffect(analysisToolContainer, toolUIJson, 'toolUIJson')
  // Controls if the tool supports uploads for data file inputs
  useUpdateObjectByStateEffect(analysisToolContainer, supportsUpload, 'supportsUpload')
  // Url to a service that accepts file uploads, use for data file input types
  useUpdateObjectByStateEffect(analysisToolContainer, webToolServerUrl, 'serviceUrl')

  useUpdateObjectByStateEffect(analysisToolContainer, portalHelpMap, 'portalHelpMap')

  const parameters = useRef<{ currentJobParams: AnalysisToolData, toolUiParameters?: AnalysisToolData }>()

  const [toolData, setToolData] = React.useState<AnalysisToolData>()

  const { realJobParams: finalJobParams, tempLayers } = useJobParamsFromOtherWidgets(jobParamsFromOtherWidgets, realJobParams, parameters.current?.currentJobParams, allLayers, toolData, updateJobParamsFromOtherWidgets)

  useEffect(() => {
    if (!mapLayers) {
      return
    }
    if (mapLayers.length) {
      // put the tempLayers at top to make the layer match use tempLayers first in analysis component
      // eg: if use output ds from other widget, the output dataSource may has url and query, the original dataSource may only have url and already added to map
      // in this case, we should create a new layer for outputDataSource and put it at top to avoid match the layer of original dataSource
      getAnalysisLayers([...(tempLayers || []), ...mapLayers], commonStrings as { [key: string]: LocaleItem }).then((layers) => {
        setAnalysisLayers(layers)
      }).catch(() => {
        setAnalysisLayers([])
      })
    } else {
      setAnalysisLayers([])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLayers, tempLayers])

  useEffect(() => {
    if (!analysisToolContainer || !analysisLayers) {
      return
    }
    analysisToolContainer.mapLayers = analysisLayers
    let selectedLayers = [] as SupportedLayer[]

    if (finalJobParams) {
      convertJobParamsToToolData({
        jobParams: finalJobParams,
        uiOnlyParams: toolUiParameters,
        toolJSON: mutableToolJson,
        availableMapLayers: analysisLayers,
        toolName
      }).then((jobParamsAndLayers) => {
        const toolDataFromHistory = jobParamsAndLayers.convertedJobParams
        const { valueTableSelectedLayersConvertedParameters, valueTableSelectedLayers, layers } = jobParamsAndLayers
        setConvertedParameters(valueTableSelectedLayersConvertedParameters)
        selectedLayers = [...layers, ...valueTableSelectedLayers]

        const toolData = {
          ...(toolDataFromHistory as AnalysisToolData),
          ...{
            userSettings: {
              unitSystem: portal.user?.units,
              hasNAPrivilege: hasNAPrivilege(portal.user)
            }
          }
        }

        setSelectedLayers(selectedLayers)
        analysisToolContainer.mapLayers = [...(analysisLayers ?? []), ...selectedLayers] // must use this, otherwise the mapLayers in AnalysisParameter will be empty and can't find matched layer if there is a layer in jobParams
        analysisToolContainer.toolData = toolData
        // the order of every parameter mapLayers's update and container mapLayers update is not sure
        // so must update every parameter's mapLayers by change containerParamsUpdated, otherwise id update every parameter mapLayers before update container mapLayers, the selected layers will not be initialed, will throw error
        changeContainerParamsUpdated()
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisToolContainer, finalJobParams, analysisLayers])

  const [paramHelpPopover, setParamHelpPopover] = useState<HTMLAnalysisHelpPopoverElement>()

  useEffect(() => {
    if (analysisToolContainer) {
      analysisToolContainer.addEventListener('analysisToolLoaded', () => {
        setAnalysisToolAppLoaded(true)
      })
      analysisToolContainer.addEventListener('analysisToolDataChange', (e: CustomEvent<AnalysisToolDataChangeEventDetail>) => {
        setAnalysisToolData(e)
      })
      analysisToolContainer.addEventListener('analysisToolHelpPopoverChange', (e: CustomEvent<any>) => {
        setParamHelpPopover((e.target as HTMLAnalysisToolElement).toolHelpPopover)
      })
    }
  }, [analysisToolContainer])

  const getColoredDesc = (desc: string) => {
    return `<span style="color: ${theme?.ref.palette?.neutral?.[1000]}">${desc}</span>`
  }

  useEffect(() => {
    if (!paramHelpPopover) {
      return
    }
    const paramName = paramHelpPopover.helpId
    const paramInfo = toolJson.parameters?.find((p) => p.name === paramName)
    if (paramInfo) {
      paramHelpPopover.helpSrcdoc = getColoredDesc(paramInfo.description)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramHelpPopover])

  // if change tool type, recreate analysisToolContainer, since the analysis-tool component will only get default value in componentWillLoad function
  useEffect(() => {
    if (!analysisToolContainer) {
      return
    }
    const containerParent = analysisToolContainer.parentElement as HTMLDivElement
    containerParent.removeChild(analysisToolContainer)
    setAnalysisToolRef(containerParent, true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolId])

  const errorStrings = useErrorMessageStrings()
  const gpMessages = useGPMessageStrings()

  const headerElementRef = useRef<HTMLDivElement>()
  const toolHelpPopover = useRef<HTMLAnalysisHelpPopoverElement>()

  // 1.jobParams convert fail will change the status to warning
  // 2. destroy will change the status to valid
  // 3. run execute error will change the status to error
  // 4. close notice will change the status to valid
  const [validationStatus, setValidationStatus] = useState<ValidityState>()
  const [errorMessage, setErrorMessage] = useState<string | string[]>()

  const panelElementRef = useRef<HTMLCalciteFlowItemElement>()

  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  const onToolDataChange = (e?: CustomEvent<AnalysisToolDataChangeEventDetail> | Record<'detail', AnalysisToolDataChangeEventDetail>) => {
    const { toolData } = e?.detail ?? {}
    setToolData(toolData)
    const jobParams = getJobParams(convertedToolJson, toolData)
    const calculatedJobParams = calculateParameterValues(jobParams as AnalysisToolData)
    const currentJobParams = { ...calculatedJobParams }
    const recalculatedToolUiParams = getUIOnlyParams({
      toolData: toolData,
      keysToRemove: Object.keys(currentJobParams),
      isWebTool: true
    })
    let toolUiParameters
    if (!isEmptyDataItem(recalculatedToolUiParams)) {
      toolUiParameters = recalculatedToolUiParams
    }
    parameters.current = {
      currentJobParams,
      toolUiParameters
    }

    if (!defaultJobParams) {
      setDefaultJobParams(currentJobParams)
    }
  }

  const [runAnalysisDisabled, setRunAnalysisDisabled] = useState(false)
  const runAnalysisDisabledRef = useRef(runAnalysisDisabled)
  useEffect(() => {
    runAnalysisDisabledRef.current = runAnalysisDisabled
  }, [runAnalysisDisabled])

  const utilityState = ReactRedux.useSelector((state: IMState) => {
    const s = state.appStateInBuilder ?? state
    return s.appRuntimeInfo?.utilityStates?.[utility?.utilityId]
  })

  const [utilityErrorMessage, setUtilityErrorMessage] = useState('')
  const [, setUtilityErrorAlertTimer] = useState<NodeJS.Timeout>()
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
    if (utilityState?.success === false) {
      setUtilityErrorMessage(utilityState.isSignInError ? translate('signInErrorDefault') : specificUtilityErrorMessageRef.current || translate('utilityNotAvailable'))

      const timer = setTimeout(() => {
        setUtilityErrorAlertTimer((t) => {
          if (t === timer) {
            setUtilityErrorMessage('')
            return null
          }
          return t
        })
      }, 5000)
      setUtilityErrorAlertTimer(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [utilityState])

  const reportUtilityState = (state: boolean, isSignInError?: boolean) => {
    const utilityId = utility?.utilityId
    if (utilityId) {
      UtilityManager.getInstance().reportUtilityState(utilityId, state, isSignInError)
    }
  }

  const checkErrorAndReportUtilityState = (error: any) => {
    const isSignInError = UtilityManager.getInstance().utilityHasSignInError(utility?.utilityId)
    const utilityNotFound = [400, 404].includes(error?.details?.httpStatus || error?.response?.error?.code) // error?.response?.error?.code is from getItem request error
    const accessBlocked = isAccessBlockedError(error)
    reportUtilityState(!(isSignInError || utilityNotFound || accessBlocked), isSignInError)
  }

  const esriRequestRef = useRef<typeof __esri.request>()

  const handleJobSubmittedError = () => {
    requestUtils.requestWrapper(toolUrl, async (session) => {
      if (!esriRequestRef.current) {
        esriRequestRef.current = await loadArcGISJSAPIModule('esri/request')
      }
      return esriRequestRef.current(session?.token ? `${toolUrl}?token=${session.token}` : toolUrl, { query: { f: 'json' }, responseType: 'json' })
    }).catch(handleWebToolRequestError).catch((error) => {
      checkErrorAndReportUtilityState(error)
    })
  }

  useEffect(() => {
    if (appContainer && errorStrings) {
      /**
       * There are three cases to handle here:
       * 1. Click run button and not close the tool panel, in this case, can't remove the analysisCoreJobStatus event listener on appContainer
       * 2. Click run button and close the tool panel immediately,in this case need to listen the analysisCoreJobStatus event with submissionData,
       * so that we can notify the analysisCoreJobSubmited event with toolId, then we can remove the analysisCoreJobStatus event listener.
       * 3. Only enter the tool panel, but not run task and close the tool panel directly, in this case, we can just remove the analysisCoreJobStatus event listener directly.
       */
      const onAnalysisCoreJobStatus = (e: AnalysisToolAppContainerCustomEvent<AnalysisGPJobStatus>) => {
        // for case 3: tool was closed and no running tasks to handle
        if (!runAnalysisDisabledRef.current && !analysisToolContainerRef.current) {
          appContainer.removeEventListener(AnalysisCoreEvents.JobStatus, onAnalysisCoreJobStatus)
          return
        }
        // for case 2: tool was closed and has running tasks to handle
        // for case 1: tool was opened and has running tasks to handle
        if (e?.detail?.submissionData) {
          // has submissionData means job just submitted, if sync job failed when submitted, means request return error, need handle error here
          if (toolJson.executionType === 'esriExecutionTypeSynchronous' && e?.detail?.jobInfo?.jobStatus === 'job-failed') {
            setValidationStatus(ValidityState.Error)
            setErrorMessage(errorStrings.jobCurrentParameters as string)
            handleJobSubmittedError()
          } else {
            notifyJobSubmited(appContainer, { ...e.detail, toolId })
          }
          // if not dispatch when submit job success, the run button will always disable
          setRunAnalysisDisabled(false)
        }
        // for case 2: tool was closed but has running task, and the running task was handled above
        if (runAnalysisDisabledRef.current && !analysisToolContainerRef.current) {
          appContainer.removeEventListener(AnalysisCoreEvents.JobStatus, onAnalysisCoreJobStatus)
        }
      }
      appContainer.addEventListener(AnalysisCoreEvents.JobStatus, onAnalysisCoreJobStatus)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appContainer, toolId, errorStrings])

  const prepJobParamsForSubmission = (jobParams: AnalysisToolData) => {
    const serializedJobParams: AnalysisToolData = { ...jobParams }
    for (const param in serializedJobParams) {
      const parameterObject = serializedJobParams[param] as { [key: string]: AnalysisToolDataItem }
      if (isEmptyDataItem(parameterObject)) {
        delete serializedJobParams[param]
      }
    }
    return serializedJobParams
  }

  useEffect(() => {
    if (analysisToolData) {
      onToolDataChange(analysisToolData)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisToolData])

  const helpMap = useHelpMapStrings()
  const helpMapEnterprise = useHelpMapEnterpriseStrings()

  /**
   * Helper to generate a 'learn more' link for a given error key
   * @param {string} errorKey The error key
   * @returns {string | undefined } The 'learn more' link or null if there's no link for the given error key
   */
  const getLearnMoreLink = (errorKey: string): string | undefined => {
    const helpMapData = (portal?.isPortal ? helpMapEnterprise.map : helpMap.map) as LocaleItem

    let docLink: string | undefined
    const otherHelpLinks = helpMapData.OtherHelpLinks as LocaleItem
    if (errorKey in (otherHelpLinks.errorMessages as LocaleItem)) {
      const errorHelpId = (otherHelpLinks.errorMessages as LocaleItem)[errorKey as keyof typeof otherHelpLinks.errorMessages] as string

      docLink = formatLearnMoreHelpUrl({
        url: portal?.isPortal && portalHelpMap !== undefined ? (portalHelpMap?.m?.[errorHelpId] as string) : errorHelpId,
        basePath: getHelpBaseUrl(portal),
        locale: locale as SupportedLocales,
        portalUrl: portal.restUrl
      })
    }

    return docLink
  }

  const composeErrorMessage = (toolValidationParam: AnalysisToolValidationParams): string => {
    const { message, key, variables } = toolValidationParam

    // Since errorStrings is a string to string record, indexing `.default` directly won't throw a type error
    // but it will throw a runtime error if the key is not found.
    const defaultErrorMessage = 'default' in errorStrings ? errorStrings.default : ''
    const errorMessageTemplate = (message ?? errorStrings?.[key ?? ''] ?? defaultErrorMessage) as string

    const learnMoreLink = getLearnMoreLink(key ?? '')
    const messageParameters = {
      docLink: learnMoreLink,
      ...variables
    } as LocaleItem

    return formatMessage(errorMessageTemplate, messageParameters)
  }

  const handleExecutionFailure = async (error: Error | ArcgisWebAnalysisError): Promise<void> => {
    const errorKey = error.name

    // Populate the learn more link from the component code rather than passing via execute
    if (errorKey === ErrorKeywords.NoPermissionToAccessTool) {
      const learnMoreUrl = getLearnMoreLink(ErrorKeywords.NoPermissionToAccessTool)
      if (learnMoreUrl !== undefined) {
        error.message = formatMessage(error.message, { docLink: learnMoreUrl })
      }
    }

    // Re-enable the run analysis button if there was an error
    setRunAnalysisDisabled(false)
    // this.analysisToolAppJobSubmissionAttempt.emit(false);

    setValidationStatus(ValidityState.Error)
    let toolAppErrorState = convertErrorToAnalysisValidationParams({ error })

    if ('messages' in error && Array.isArray(error.messages)) {
      const hasExecuteError = error.messages.some((message: __esri.GPMessage) => message.type === 'error' && message.description.startsWith('Failed to execute'))
      if (hasExecuteError) {
        toolAppErrorState = convertErrorToAnalysisValidationParams({
          errorKey: ErrorKeywords.CreditEstimationExecutionFailure
        })
      }
    }
    setErrorMessage(composeErrorMessage(toolAppErrorState))

    if (panelElementRef.current) {
      panelElementRef.current.scrollContentTo({ top: 0, behavior: 'auto' })
    }
    // handle async tools request error here
    handleJobSubmittedError()
  }

  const runTask = async () => {
    const { valid, errorKeys } = await analysisToolContainer.validateTool()
    const allErrorKeys = Array.from(new Set([...errorKeys]))
    const status = valid ? ValidityState.Valid : ValidityState.Error
    setValidationStatus(status)
    if (status === ValidityState.Error) {
      setErrorMessage(allErrorKeys.length === 1 ? errorStrings[allErrorKeys[0]] as string : allErrorKeys.map((key) => errorStrings[key] as string))
      if (panelElementRef.current) {
        panelElementRef.current.scrollContentTo({ top: 0, behavior: 'auto' })
      }
      return
    }
    // Get most up to date data
    onToolDataChange({ detail: { toolData: analysisToolContainer?.toolData } })
    const { currentJobParams } = parameters.current
    if (currentJobParams !== undefined) {
      setRunAnalysisDisabled(true)

      const resultParams = getResultParams(convertedToolJson)

      const jobParamsPayload = prepJobParamsForSubmission(currentJobParams)

      try {
        // we will get service info in mounted lifecycle and the login popup will show, but if user click cancel, the service info will lost, so need to obtain the service info first here
        let serviceInfoDetail = serviceInfo
        if (!serviceInfoDetail) {
          serviceInfoDetail = await getServiceInfo()
        }
        // jobParams and jobParamsPayload when sending to execution
        // is sent as new cloned copy to avoid mutations on
        // these values while a current job is in execution.
        await executeJob(geoprocessor, {
          jobParams: lodash.cloneDeep(currentJobParams),
          jobParamsPayload: lodash.cloneDeep(jobParamsPayload),
          resultParams,
          gpMessages: resultParams.includes('processInfo') ? gpMessages as { [key: string]: string } : undefined,
          portal,
          toolName,
          analysisEngine: AnalysisEngine.Standard,
          analysisType: AnalysisType.Tool,
          containerElement: appContainer,
          toolUiParameters: parameters.current.toolUiParameters
        }, { ...convertedToolJson, serviceInfo: serviceInfoDetail }, getCustomToolUrlWithToken(toolUrl), webToolServerUrl)
        reportUtilityState(true)
      } catch (e) {
        handleExecutionFailure(e)
      }
    }
  }

  // TODO can enable this function once component fix the anonymous user issue in browse layers popper of analysis-layer-input component
  // useEffect(() => {
  //   if (!analysisToolAppLoaded || !containerParamsUpdated) {
  //     return
  //   }
  //   setContainerParamsUpdated(false)
  //   setTimeout(() => {
  //     const layerInputElements = analysisToolContainer.shadowRoot.querySelectorAll('analysis-layer-input')
  //     if (layerInputElements.length) {
  //       layerInputElements.forEach((el) => {
  //         const parameter = toolJson.parameters.find((p) => p.displayName === el.label)
  //         if (parameter) {
  //           el.mapLayers = (parameter as CustomToolParam).selectFromMapLayer ? [...(analysisLayers || []), ...selectedLayers] : selectedLayers
  //         }
  //       })
  //     }
  //   })
  // }, [containerParamsUpdated])

  useEffect(() => {
    if (!option.showHelpLink && toolHelpPopover.current) {
      toolHelpPopover.current.remove()
    }
  }, [option.showHelpLink])

  const [backButtonFocused, setBackButtonFocused] = useState(false)

  return (
    <div className='analysis-exb-custom-web-tool-container h-100 d-flex'>
      <CalciteFlowItem
        // FIXME: Hyphen case to ignore type error as this is an internal only prop
        show-back-button={!disableBack}
        // dir={this.dir}
        closable={false}
        onCalciteFlowItemBack={onBack}
        ref={(ref) => {
          panelElementRef.current = ref
          if (!disableBack && !backButtonFocused) {
            ref?.setFocus()
            setBackButtonFocused(true)
          }
        }}
      >
        <div
          slot="header-content"
          ref={headerElementRef}
        >
          {displayedToolName}
        </div>
        {option.showHelpLink && <CalciteAction
          label=""
          text=""
          icon="information"
          slot="header-actions-end"
          onClick={() => {
            if (option.link !== undefined && showHelp) {
              toolHelpPopover.current = showHelp(toolHelpPopover.current, {
                helpUrl: option.link,
                helpId: toolId,
                heading: displayedToolName,
                referenceElement: headerElementRef.current,
                isHelpFileExternalAsset: true,
                learnMoreBaseUrl: portal?.sourceJSON.helpBase,
                offsetDistance: 55,
                offsetSkidding: 10,
                learnMoreUrl: option.link
              })
              if (toolHelpPopover.current) {
                toolHelpPopover.current.helpSrcdoc = getColoredDesc(toolJson.description)
                toolHelpPopover.current.learnMoreBaseUrl = undefined
              }
            }
          }}
        ></CalciteAction>}
        {validationStatus === ValidityState.Error || validationStatus === ValidityState.Warning
          ? (<CalciteNotice
              open
              kind={validationStatus === ValidityState.Error ? 'danger' : 'warning'}
              closable
              scale="m"
              width="auto"
              onCalciteNoticeClose={() => { setValidationStatus(ValidityState.Valid) }}
            >
              {Array.isArray(errorMessage) && errorMessage.length > 0
                ? <ul slot="message">
                    {errorMessage.map((error) => <li>{error}</li>)}
                  </ul>
                : <div slot="message" dangerouslySetInnerHTML={{ __html: errorMessage as string }}></div>}
            </CalciteNotice>)
          : null}
        <div
          // stop keydown event to make Ctrl+V event effective
          onKeyDown={(e) => { e.stopPropagation() }}
          ref={setAnalysisToolRef} className='custom-tool-container'></div>
        <CalciteButton
          slot='footer'
          disabled={runAnalysisDisabled ? true : undefined}
          loading={runAnalysisDisabled ? true : undefined}
          onClick={runTask}
          appearance='solid'
          kind='brand'
          width={disableBack ? 'full' : 'half'}
          alignment='center'
          scale='m'
        >
          {translate('run')}
        </CalciteButton>
        {!disableBack && <CalciteButton
          slot='footer'
          disabled={runAnalysisDisabled ? true : undefined}
          onClick={onBack}
          appearance='outline'
          kind='brand'
          width='half'
          alignment='center'
          scale='m'
        >
          {translate('back')}
        </CalciteButton>}
        <Alert css={alertStyle} autoFocus closable withIcon form="basic" open={!!utilityErrorMessage} onClose={() => { setUtilityErrorMessage('') }} text={utilityErrorMessage || ''} type='warning' />
      </CalciteFlowItem>
      {!analysisToolAppLoaded && <Loading />}
    </div>
  )
}

export default CustomTool
