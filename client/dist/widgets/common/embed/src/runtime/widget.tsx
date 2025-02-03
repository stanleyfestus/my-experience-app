/** @jsx jsx */
import {
  React,
  type AllWidgetProps,
  getAppStore,
  AppMode,
  urlUtils,
  queryString,
  type IMState,
  jsx,
  classNames,
  appActions,
  esri,
  LayoutParentType,
  type AppConfig,
  type ImmutableObject
} from 'jimu-core'
import { Fragment } from 'react'
import { WidgetPlaceholder, DynamicUrlResolver, AlertButton, Alert } from 'jimu-ui'
import { type IMConfig, EmbedType } from '../config'
import { getStyle } from './style'
import defaultMessages from './translations/default'
import embedIcon from '../../icon.svg'
import { versionManager } from '../version-manager'
import {
  ViewVisibilityContext,
  type ViewVisibilityContextProps
} from 'jimu-layouts/layout-runtime'
import { getUrlByEmbedCode, getParamsFromEmbedCode } from '../utils'
const Sanitizer = esri.Sanitizer
const sanitizer = new Sanitizer()

interface State {
  // Indicates embedded content, regardless of type
  content?: string
  isLoading?: boolean

  loadErr?: boolean
  // Parsing error or some variables are not selected and not replaced
  resolveErr?: boolean
  errMessage?: string

  codeLimitExceeded?: boolean
  // Indicates the code is not social media or video
  useSrcdoc?: boolean
}

interface Props {
  appMode: AppMode
  sectionNavInfos: any
}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig> & Props, State> {
  static versionManager = versionManager
  ifr: HTMLIFrameElement
  // Indicates whether the iFrame needs to be loaded in the View, and keep the loaded iframe unloaded.
  shouldRenderIframeInView: boolean
  // Indicates whether content needs to be loaded on the iFrame after switching the view.
  needLoadContentInView: boolean
  // Auto refresh timer
  refreshTimer: any
  // The map of err messages
  errMessages: {
    httpsCheck: string
    unSupportUrl: string
    unSupportIframeUrl: string
  }

  static mapExtraStateProps = (
    state: IMState,
    props: AllWidgetProps<IMConfig>
  ): Props => {
    return {
      appMode: state?.appRuntimeInfo?.appMode,
      sectionNavInfos: state?.appRuntimeInfo?.sectionNavInfos
    }
  }

  constructor (props) {
    super(props)
    const { config } = props
    const { embedType, embedCode, expression } = config

    this.errMessages = {
      httpsCheck: this.formatMessage('httpsUrlMessage'),
      unSupportUrl: this.formatMessage('unSupportUrl'),
      unSupportIframeUrl: this.formatMessage('unSupportIframeUrl')
    }

    this.checkUrl = this.checkUrl.bind(this)
    const embedByCodeUrl = getUrlByEmbedCode(embedCode)
    const mediaCodeOrSanitizedHtml = embedByCodeUrl || sanitizer.sanitize(embedCode)
    const state: State = {
      content:
        embedType === EmbedType.Url
          ? expression
          : mediaCodeOrSanitizedHtml,
      isLoading: false,
      loadErr: false,
      resolveErr: false,
      errMessage: '',
      codeLimitExceeded: false,
      useSrcdoc: !embedByCodeUrl
    }
    this.state = state
    this.shouldRenderIframeInView = false
  }

  componentDidMount () {
    const { config } = this.props
    const { content } = this.state
    if (content && content.trim().length > 0) {
      this.setState({ isLoading: true }, () => {
        // In the first load, resolving the URL is incomplete, after resolved, it is loaded via didUpdate
        // In code type, we can loadContent directly
        if (config.embedType === EmbedType.Code) {
          this.loadContent()
        }
      })
    }
  }

  componentDidUpdate (preProps, preStates) {
    const { content } = this.state
    const { content: oldContent } = preStates
    const { appMode, config, id } = this.props
    const { embedCode, embedType, autoRefresh, autoInterval, expression } = config
    const { config: preConfig, appMode: preAppMode, sectionNavInfos: preSectionNavInfos } = preProps
    const { autoRefresh: preAutoRefresh, autoInterval: preAutoInterval, embedType: preEmbedType } = preConfig
    const autoConfChange = autoRefresh !== preAutoRefresh || autoInterval !== preAutoInterval
    const codeLimitExceeded = this.props?.stateProps?.codeLimitExceeded || false
    this.setState({ codeLimitExceeded })

    if ((appMode !== preAppMode && appMode === AppMode.Design) || autoConfChange) {
      this.reload()
    }
    // embedType change
    const embedByCodeUrl = getUrlByEmbedCode(embedCode)
    const mediaCodeOrSanitizedHtml = embedByCodeUrl || sanitizer.sanitize(embedCode)
    if (embedType !== preEmbedType) {
      const reuseContent =
        embedType === EmbedType.Url
          ? expression
          : mediaCodeOrSanitizedHtml
      this.setState({
        loadErr: false,
        errMessage: '',
        resolveErr: false,
        codeLimitExceeded: false,
        content: reuseContent,
        useSrcdoc: !embedByCodeUrl
      })
      this.props.dispatch(
        appActions.widgetStatePropChange(id, 'codeLimitExceeded', false)
      )
    } else {
      if (embedType === EmbedType.Code) {
        if (preConfig.embedCode !== embedCode) {
          this.setState({
            content: mediaCodeOrSanitizedHtml,
            useSrcdoc: !embedByCodeUrl
          })
        }
      } else {
        if (preConfig.expression !== expression) {
          this.setState({
            content: expression,
            useSrcdoc: !embedByCodeUrl
          })
        }
      }
    }

    if (content !== oldContent) {
      this.setState({
        isLoading: !!content,
        loadErr: false
      }, () => {
        this.checkAndLoadByType()
      })
    }
    // Current section change reload embed
    this.reloadContentInView(preSectionNavInfos)
    // Auto refresh setting
    this.autoRefreshHandler(autoConfChange)
  }

  checkAndLoadByType = () => {
    const { config } = this.props
    const { embedType } = config
    const { content } = this.state
    if (embedType === EmbedType.Url) {
      const processedUrl = this.processUrl(content)
      this.checkUrl(processedUrl).then(passed => {
        if (passed) this.loadContent()
      })
    } else {
      this.loadContent()
    }
  }

  getSectionIdWhenParentIsView = (appConfig: ImmutableObject<AppConfig>, layoutId: string): string => {
    const mainSizeMode = appConfig.mainSizeMode
    const widgetLayoutJson = appConfig.layouts?.[layoutId]
    let sectionId
    const recursionCheckParent = (layoutJson) => {
      if (!layoutJson) return
      if (layoutJson?.parent?.type === LayoutParentType.View) {
        const viewId = layoutJson.parent?.id
        const viewJson = appConfig.views?.[viewId]
        sectionId = viewJson?.parent
      } else {
        const parentWidgetId = layoutJson?.parent?.id
        const parentWidget = appConfig.widgets[parentWidgetId]
        const parentLayoutId = parentWidget?.parent?.[mainSizeMode]?.[0]?.layoutId
        const parentLayoutJson = appConfig.layouts?.[parentLayoutId]
        recursionCheckParent(parentLayoutJson)
      }
    }
    recursionCheckParent(widgetLayoutJson)
    return sectionId
  }

  reloadContentInView = (preSectionNavInfos) => {
    const { sectionNavInfos, layoutId } = this.props
    if (
      this.needLoadContentInView &&
      sectionNavInfos &&
      preSectionNavInfos !== sectionNavInfos
    ) {
      const changedSection = []
      for (const sectionIndex in sectionNavInfos) {
        const curSectionInfo = sectionNavInfos[sectionIndex]
        const preSectionInfo = preSectionNavInfos?.[sectionIndex]
        if (curSectionInfo !== preSectionInfo) {
          changedSection.push(sectionIndex)
        }
      }
      const appState = getAppStore().getState()
      const appConfig = appState?.appConfig
      const sectionId = this.getSectionIdWhenParentIsView(appConfig, layoutId)
      // Reload the content in section view
      if (changedSection.includes(sectionId)) {
        this.checkAndLoadByType()
      }
    }
  }

  autoRefreshHandler = (autoConfChange: boolean) => {
    const { useSrcdoc } = this.state
    const { config } = this.props
    const { embedType, autoRefresh, autoInterval = 1 } = config

    // Turn auto refresh on or off
    if (!this.refreshTimer && autoRefresh) {
      const autoRefreshTimer = setInterval(() => {
        if (this.ifr) {
          if (embedType === EmbedType.Code && useSrcdoc) {
            const srcDoc = this.ifr.srcdoc
            this.ifr.srcdoc = srcDoc
          } else {
            const src = this.ifr.src
            this.ifr.src = ''
            setTimeout(() => {
              if (this.ifr) this.ifr.src = src
            }, 100)
          }
        }
      }, autoInterval * 60 * 1000)
      this.refreshTimer = autoRefreshTimer
    } else if (this.refreshTimer && !autoRefresh) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }

    // Auto refresh setting changed
    if (autoConfChange && autoRefresh) {
      if (this.refreshTimer) clearInterval(this.refreshTimer)
      const changeTimer = setInterval(() => {
        if (this.ifr) {
          if (embedType === EmbedType.Code && useSrcdoc) {
            const srcDoc = this.ifr.srcdoc
            this.ifr.srcdoc = srcDoc
          } else {
            const src = this.ifr.src
            this.ifr.src = ''
            setTimeout(() => {
              if (this.ifr) this.ifr.src = src
            }, 100)
          }
        }
      }, autoInterval * 60 * 1000)
      this.refreshTimer = changeTimer
    }
  }

  iframeOnLoad = () => {
    this.setState({ isLoading: false })
  }

  checkSafeDomain = (url: string): boolean => {
    let safeFlag = false
    if (!url) return safeFlag
    const appState = getAppStore().getState()
    const selfPortal = appState?.portalSelf
    let selfPortalDomain = selfPortal?.portalLocalHostname?.toLowerCase() || selfPortal?.portalHostname
    // some portalDomain end with '/portal'
    if (selfPortalDomain?.includes('/')) {
      selfPortalDomain = selfPortalDomain.split('/')[0]
    }
    const safeDomain = ['.arcgis.com', '.esri.com']
    // portal self domain is safe
    if (selfPortalDomain) safeDomain.push(selfPortalDomain)
    let toBeCheckedDomain = ''
    if (url.includes('https://')) {
      toBeCheckedDomain = url.substring(8).split('/')[0]
    }
    // Check safe domain
    for (const safeItem of safeDomain) {
      if (toBeCheckedDomain.includes(safeItem)) {
        safeFlag = true
        break
      }
    }
    return safeFlag
  }

  processUrl = (url: string): string => {
    if (!url) return url
    const { config } = this.props
    const { embedType } = config
    // Support Google Map, Youtube, Facebook and Vimeo now.
    const lowerUrl = url.toLowerCase()
    // Google Map
    // if(lowerUrl.indexOf('https://www.google.com/maps') > -1 || lowerUrl.indexOf('https://goo.gl/maps') > -1){//google map
    //   return url;
    // }

    // Vimeo
    if (/https:\/\/vimeo\.com\/.*/.test(lowerUrl)) {
      url = urlUtils.removeSearchFromUrl(url)
      const splits = url.split('/')
      const id = splits[splits.length - 1]
      return `https://player.vimeo.com/video/${id}`
    }

    // Youtube
    if (/https:\/\/www\.youtube\.com\/watch\?.*v=.*/.test(lowerUrl)) {
      const queryObj = queryString.parseUrl(url)?.query
      const id = queryObj?.v
      return `https://www.youtube.com/embed/${id}`
    } else if (/https:\/\/youtu\.be\/.*/.test(lowerUrl)) {
      url = urlUtils.removeSearchFromUrl(url)
      const splits = url.split('/')
      const id = splits[splits.length - 1]
      return `https://www.youtube.com/embed/${id}`
    }

    // Facebook video
    if (/https:\/\/www\.facebook\.com\/.*\/videos\/.*/.test(lowerUrl)) {
      return `https://www.facebook.com/plugins/video.php?href=${lowerUrl}&show_text=0`
    }

    if (embedType === EmbedType.Code && url.startsWith('//')) {
      url = `https:${url}`
    }

    if (!this.checkURLFormat(url)) {
      url = 'about:blank'
    }

    // Check and replace the url to current user's org to avoid duplicate sign-in
    // This is the matching rule, and the target Domain contains these three types, which need to be replaced
    const matchedUrl = [
      '.maps.arcgis.com',
      '.mapsdevext.arcgis.com',
      '.mapsqa.arcgis.com'
    ]
    let toBeCheckedDomain = ''
    if (url.includes('https://')) {
      toBeCheckedDomain = url.substring(8).split('/')[0]
    }
    let matchFlag = false
    let matchEnv = ''
    // Check domain
    for (const item of matchedUrl) {
      if (toBeCheckedDomain.includes(item)) {
        matchFlag = true
        switch (item) {
          case '.maps.arcgis.com':
            matchEnv = 'prod'
            break
          case '.mapsdevext.arcgis.com':
            matchEnv = 'dev'
            break
          case '.mapsqa.arcgis.com':
            matchEnv = 'qa'
            break
        }
        break
      }
    }

    const hostEnv = window.jimuConfig.hostEnv
    if (matchFlag && matchEnv === hostEnv) {
      const appState = getAppStore().getState()
      if (appState && appState.user) {
        const urlKey = appState?.portalSelf?.urlKey
        const customBaseUrl = appState?.portalSelf?.customBaseUrl
        if (toBeCheckedDomain && urlKey && customBaseUrl) {
          url = url.replace(toBeCheckedDomain, `${urlKey}.${customBaseUrl}`)
        }
      }
    }
    return url
  }

  checkURLFormat = (str: string): boolean => {
    if (!str || str === '') {
      this.setState({ errMessage: this.errMessages.unSupportUrl })
      return false
    }
    if (str === 'about:blank') {
      return false
    }
    const httpsRex = '^(([h][t]{2}[p][s])?://)'
    const re = new RegExp(httpsRex)
    if (!re.test(str)) {
      this.setState({ errMessage: this.errMessages.httpsCheck })
      return false
    }
    // url of localhost works without '.'
    // eslint-disable-next-line
    const httpsLocalRex = new RegExp('^(([h][t]{2}[p][s])?://localhost)')
    if (httpsLocalRex.test(str)) {
      return true
    }
    const index = str.indexOf('.')
    if (index < 0 || index === str.length - 1) {
      this.setState({ errMessage: this.errMessages.unSupportUrl })
      return false
    }
    return true
  }

  // Tips: remove fetchUrl in builder
  checkUrl (url: string): Promise<boolean> {
    if (!this.checkURLFormat(url)) {
      this.setState({ loadErr: true })
      return Promise.resolve(false)
    } else {
      this.setState({ loadErr: false })
      return Promise.resolve(true)
    }
  }

  isOriginSameAsLocation (url: string) {
    // Domains under *.arcgis.com or *.esri.com, should be considered as the same origin.
    const safeDomainArray = ['.arcgis.com', '.esri.com']
    const pageLocation = window.location
    const URL_HOST_PATTERN = /(\w+:)?(?:\/\/)([\w.-]+)?(?::(\d+))?\/?/
    const urlMatch = URL_HOST_PATTERN.exec(url) || []
    const urlParts = {
      protocol: urlMatch[1] || '',
      host: urlMatch[2] || '',
      port: urlMatch[3] || ''
    }
    // Check safe domain
    let safeDomain = ''
    for (const safeItem of safeDomainArray) {
      if (pageLocation.host.includes(safeItem)) {
        safeDomain = safeItem
        break
      }
    }
    if (urlMatch[2].includes(safeDomain)) {
      return true
    }

    const defaultPort = protocol => {
      return { 'http:': 80, 'https:': 443 }[protocol]
    }

    const portOf = location => {
      return (
        location.port || defaultPort(location.protocol || pageLocation.protocol)
      )
    }

    return !!(
      urlParts.protocol &&
      urlParts.protocol === pageLocation.protocol &&
      urlParts.host &&
      urlParts.host === pageLocation.host &&
      urlParts.host &&
      portOf(urlParts) === portOf(pageLocation)
    )
  }

  formatMessage = (id: string) => {
    return this.props.intl.formatMessage({
      id: id,
      defaultMessage: defaultMessages[id]
    })
  }

  reload = () => {
    const { useSrcdoc } = this.state
    const { config } = this.props
    if (this.ifr) {
      if (config.embedType === EmbedType.Code && useSrcdoc) {
        const srcDoc = this.ifr.srcdoc
        this.ifr.srcdoc = srcDoc
      } else {
        const src = this.ifr.src
        this.ifr.src = src
      }
    }
  }

  loadContent = () => {
    const { config } = this.props
    const { content, useSrcdoc } = this.state
    const { embedType } = config
    if (this.ifr) {
      this.ifr.removeAttribute('srcdoc')
      this.ifr.removeAttribute('src')
      if (embedType === EmbedType.Code) {
        if (useSrcdoc) {
          this.ifr.srcdoc = content
        } else {
          setTimeout(() => {
            if (this.ifr) this.ifr.src = this.processUrl(content)
          }, 100)
        }
      } else {
        setTimeout(() => {
          if (this.ifr) this.ifr.src = this.processUrl(content)
        }, 100)
      }
    }
  }

  onHtmlResolved = (url, hasExpression) => {
    // Remove the empty characters at the beginning and end of the parsed url
    const trimmedUrl = url.replace(/(^\s*|\s*$)/g, '')
    this.setState({
      content: trimmedUrl,
      resolveErr: hasExpression
    })
  }

  render () {
    const { isLoading, loadErr, errMessage, resolveErr, content, codeLimitExceeded, useSrcdoc } = this.state
    const { theme, id, config } = this.props
    const { embedCode, embedType, expression, enableLabel, label } = config
    // the expression value will be '<p><br></p>' after the input is cleared
    const showPlaceholder =
      embedType === EmbedType.Code
        ? !embedCode
        : (!expression || expression === '<p><br></p>' || expression === '<p></p>')

    if (showPlaceholder) {
      return (
        <Fragment>
          <WidgetPlaceholder
            widgetId={this.props.id}
            icon={embedIcon}
            message={this.formatMessage('embedHint')}
          />
          {codeLimitExceeded &&
            <div className='p-2 w-100' style={{ position: 'absolute', bottom: 0 }}>
              <Alert withIcon={true} size='small' type='warning' text={this.formatMessage('maxLimitTips')} className='w-100' />
            </div>
          }
        </Fragment>
      )
    }
    let withSandbox = true
    if (embedType === EmbedType.Url || (embedType === EmbedType.Code && !useSrcdoc)) {
      withSandbox = !this.checkSafeDomain(this.processUrl(content))
    }
    let iframeParams = { width: undefined, height: undefined }
    iframeParams = getParamsFromEmbedCode(embedCode)
    const { width: iframeWidth, height: iframeHeight } = iframeParams

    return (
      <ViewVisibilityContext.Consumer>
        {({ isInView, isInCurrentView }: ViewVisibilityContextProps) => {
          let embedLoad = true
          if (!this.shouldRenderIframeInView) {
            embedLoad = isInView ? isInCurrentView : true
            if (embedLoad) this.shouldRenderIframeInView = true
          }
          this.needLoadContentInView = isInView && isInCurrentView
          return <Fragment>
            {embedLoad &&
              <div className='jimu-widget widget-embed' css={getStyle(theme, iframeParams)}>
                {withSandbox
                  ? <iframe
                    id={`ifrSandbox-${id}`}
                    className={`iframe-${id} ${!iframeWidth && 'w-100'} ${!iframeHeight && 'h-100'} embed-iframe`}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-popups-to-escape-sandbox"
                    allowFullScreen
                    onLoad={this.iframeOnLoad}
                    ref={(f) => { this.ifr = f }}
                    allow="geolocation"
                    data-testid="embedSandbox"
                    {...iframeParams}
                  />
                  : <iframe
                    id={`ifrSafe-${id}`}
                    className={`iframe-${id} ${!iframeWidth && 'w-100'} ${!iframeHeight && 'h-100'} embed-iframe`}
                    allowFullScreen
                    onLoad={this.iframeOnLoad}
                    ref={(f) => { this.ifr = f }}
                    allow="geolocation"
                    data-testid="embedSafe"
                    {...iframeParams}
                  />
                }
                {isLoading && <div className='jimu-secondary-loading'></div>}
                {loadErr &&
                  <div className='mask text-center load-err-mask'>
                    <div className='mask-content'>
                      <AlertButton
                        buttonType='tertiary'
                        size='small'
                        type='warning'
                      />
                      {errMessage}
                    </div>
                  </div>
                }
                {resolveErr &&
                  <div
                    data-testid='test-expressionMask'
                    className="mask text-center load-err-mask"
                  >
                    <div
                      className={classNames('mask-content', { 'truncate-two': !(enableLabel && label) })}
                      style={{ width: '70%' }}
                      title={(enableLabel && label) || content}
                    >
                      {(enableLabel && label) || content}
                    </div>
                  </div>
                }
                {embedType === EmbedType.Url &&
                  <DynamicUrlResolver
                    widgetId={id}
                    useDataSources={this.props.useDataSources}
                    value={config.expression}
                    onHtmlResolved={this.onHtmlResolved}
                  />
                }
                {codeLimitExceeded &&
                  <div className='bottom-alert p-2 w-100'>
                    <Alert withIcon={true} size='small' type='warning' text={this.formatMessage('maxLimitTips')} className='w-100' />
                  </div>
                }
              </div>
            }
          </Fragment>
        }}
      </ViewVisibilityContext.Consumer>
    )
  }
}
