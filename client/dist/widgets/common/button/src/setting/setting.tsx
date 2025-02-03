/** @jsx jsx */
import {
  React, jsx, Immutable, type ImmutableArray, ExpressionPartType, type IMIconResult,
  type IMExpression, type UseDataSource, expressionUtils, defaultMessages as jimuCoreMessages,
  LinkType, type Expression, AllDataSourceTypes, type IconResult
} from 'jimu-core'
import { type AllWidgetSettingProps, builderAppSync } from 'jimu-for-builder'
import { SettingSection, SettingRow, type IMLinkParam, LinkSelector } from 'jimu-ui/advanced/setting-components'
import { IconPicker } from 'jimu-ui/advanced/resource-selector'
import { TextInput, Select, Tabs, Tab, defaultMessages as jimuUIMessages, defaultMessages as jimuUiDefaultMessages } from 'jimu-ui'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'

import { ExpressionInput, ExpressionInputType } from 'jimu-ui/advanced/expression-builder'

import { type IMConfig, IconPosition, type IMAdvanceStyleSettings } from '../config'
import { getStyle } from './style'
import AdvanceStyleSetting from './components/advance-style-setting'
import AdvanceCollapse from './components/advance-collapse'

interface State {
  isTextExpOpen: boolean
  isTipExpOpen: boolean
  currentTextInput: string
  currentTipInput: string
}

const expressionInputTypes = Immutable([ExpressionInputType.Static, ExpressionInputType.Attribute, ExpressionInputType.Statistics, ExpressionInputType.Expression])
const supportedDsTypes = Immutable([
  AllDataSourceTypes.FeatureLayer,
  AllDataSourceTypes.SceneLayer,
  AllDataSourceTypes.BuildingComponentSubLayer,
  AllDataSourceTypes.OrientedImageryLayer,
  AllDataSourceTypes.ImageryLayer,
  AllDataSourceTypes.SubtypeGroupLayer,
  AllDataSourceTypes.SubtypeSublayer
])

const enum SettingTabs {
  hover = 'HOVER',
  regular = 'REGULAR'
}

export default class Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig>, State> {
  constructor (props) {
    super(props)

    this.state = {
      isTextExpOpen: false,
      isTipExpOpen: false,
      currentTextInput: typeof this.props.config?.functionConfig?.text === 'string'
        ? this.props.config?.functionConfig?.text
        : this.getDefaultText(),
      currentTipInput: (this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.toolTip) || ''
    }
  }

  componentDidUpdate (prevProps: AllWidgetSettingProps<IMConfig>) {
    if (!this.getIsDataSourceUsed()) {
      if (this.props.config?.functionConfig?.text !== prevProps.config?.functionConfig?.text) {
        this.setState({
          currentTextInput: typeof this.props.config?.functionConfig?.text === 'string'
            ? this.props.config?.functionConfig?.text
            : this.getDefaultText()
        })
      }
      if (this.props.config?.functionConfig?.toolTip !== prevProps.config?.functionConfig?.toolTip) {
        this.setState({
          currentTipInput: (this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.toolTip) || ''
        })
      }
    }
  }

  componentWillUnmount () {
    builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: this.props.id, propKey: 'isConfiguringHover', value: false })
  }

  getDefaultText () {
    const { config, intl } = this.props
    const isDefault = config.functionConfig.text === undefined && config.functionConfig.textExpression === undefined
    return isDefault ? intl.formatMessage({ id: 'variableButton', defaultMessage: jimuUiDefaultMessages.variableButton }) : ''
  }

  onSettingLinkConfirm = (linkResult: IMLinkParam) => {
    let config
    if (!linkResult) {
      return
    }
    if (!linkResult.expression) {
      let mergedUseDataSources
      if (this.getIsDataSourceUsed()) {
        const textExpression = this.getTextExpression()
        const tooltipExpression = this.getTipExpression()
        mergedUseDataSources = this.mergeUseDataSources(textExpression, tooltipExpression, null, this.props.useDataSources)
      } else {
        mergedUseDataSources = expressionUtils.getUseDataSourcesWithoutFields(this.props.useDataSources)
      }
      config = {
        id: this.props.id,
        config: this.props.config.setIn(['functionConfig', 'linkParam'], linkResult),
        useDataSources: mergedUseDataSources
      }
    } else {
      const textExpression = this.getTextExpression()
      const tooltipExpression = this.getTipExpression()
      const expression = linkResult.expression
      const mergedUseDataSources = this.mergeUseDataSources(textExpression, tooltipExpression, expression, this.props.useDataSources)

      config = {
        id: this.props.id,
        config: this.props.config.setIn(['functionConfig', 'linkParam'], linkResult),
        useDataSources: mergedUseDataSources
      }
    }

    this.props.onSettingChange(config)
  }

  onTextChange = () => {
    const config = {
      id: this.props.id,
      config: this.props.config.setIn(['functionConfig', 'text'], this.state.currentTextInput)
        .setIn(['functionConfig', 'textExpression'], null),
      useDataSources: expressionUtils.getUseDataSourcesWithoutFields(this.props.useDataSources) as any
    }

    this.props.onSettingChange(config)
  }

  onToolTipChange = () => {
    const config = {
      id: this.props.id,
      config: this.props.config.setIn(['functionConfig', 'toolTip'], this.state.currentTipInput)
        .setIn(['functionConfig', 'toolTipExpression'], null),
      useDataSources: expressionUtils.getUseDataSourcesWithoutFields(this.props.useDataSources) as any
    }
    this.props.onSettingChange(config)
  }

  onTextExpChange = (expression: Expression) => {
    if (!expression) {
      return
    }
    const tooltipExpression = this.getTipExpression()
    const linkSettingExpression = this.getLinkSettingExpression()
    const mergedUseDataSources = this.mergeUseDataSources(Immutable(expression), tooltipExpression, linkSettingExpression, this.props.useDataSources)
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['functionConfig', 'textExpression'], expression).setIn(['functionConfig', 'text'], ''),
      useDataSources: mergedUseDataSources as any
    })
    this.setState({ isTextExpOpen: false })
  }

  onTipExpChange = (expression: Expression) => {
    if (!expression) {
      return
    }
    const textExpression = this.getTextExpression()
    const linkSettingExpression = this.getLinkSettingExpression()
    const mergedUseDataSources = this.mergeUseDataSources(textExpression, Immutable(expression), linkSettingExpression, this.props.useDataSources)
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['functionConfig', 'toolTipExpression'], expression).setIn(['functionConfig', 'toolTip'], ''),
      useDataSources: mergedUseDataSources as any
    })
    this.setState({ isTipExpOpen: false })
  }

  onToggleUseDataEnabled = (useDataSourcesEnabled: boolean) => {
    let config = this.props.config
    if (useDataSourcesEnabled) {
      config = config.setIn(['functionConfig', 'textExpression'], this.getTextExpression())
        .setIn(['functionConfig', 'toolTipExpression'], this.getTipExpression())
      config = config.set('functionConfig', config.functionConfig.without('text').without('toolTip'))

      if (this.props.config?.functionConfig?.linkParam?.linkType === LinkType.WebAddress) {
        config = config.setIn(['functionConfig', 'linkParam', 'expression'], this.getLinkSettingExpression())
        config = config.setIn(['functionConfig', 'linkParam'], config.functionConfig.linkParam.without('value'))
      }
    } else {
      config = config.setIn(['functionConfig', 'text'], this.state.currentTextInput)
        .setIn(['functionConfig', 'toolTip'], this.state.currentTipInput)
      config = config.set('functionConfig', config.functionConfig.without('textExpression').without('toolTipExpression'))

      if (this.props.config?.functionConfig?.linkParam?.linkType === LinkType.WebAddress) {
        config = config.setIn(['functionConfig', 'linkParam', 'value'], '')
        config = config.setIn(['functionConfig', 'linkParam'], config.functionConfig.linkParam.without('expression'))
      }
    }
    this.props.onSettingChange({
      id: this.props.id,
      useDataSourcesEnabled,
      config
    })
  }

  onDataSourceChange = (useDataSources: UseDataSource[]) => {
    if (!useDataSources) {
      return
    }

    this.props.onSettingChange({
      id: this.props.id,
      useDataSources: this.mergeUseDataSources(this.getTextExpression(), this.getTipExpression(), this.getLinkSettingExpression(), Immutable(useDataSources)) as unknown as UseDataSource[]
    })
  }

  onIconResultChange = (result: IMIconResult) => {
    let config
    if (result) {
      config = this.props.config
      const position = this.props.config.getIn(['functionConfig', 'icon', 'position']) || IconPosition.Left
      config = config.setIn(['functionConfig', 'icon', 'data'], result)
        .setIn(['functionConfig', 'icon', 'position'], position)
    } else {
      config = this.props.config.set('functionConfig', this.props.config.functionConfig.without('icon'))
        .setIn(['styleConfig', 'customStyle', 'regular'], this.props.config.getIn(['styleConfig', 'customStyle', 'regular'], Immutable({}) as IMAdvanceStyleSettings).without('iconProps'))
        .setIn(['styleConfig', 'customStyle', 'hover'], this.props.config.getIn(['styleConfig', 'customStyle', 'hover'], Immutable({}) as IMAdvanceStyleSettings).without('iconProps'))
    }
    this.props.onSettingChange({
      id: this.props.id,
      config
    })
  }

  getWhetherHaveCustomStyle = (isRegular: boolean): boolean => {
    const status = isRegular ? 'regular' : 'hover'
    let style = this.props.config.getIn(['styleConfig', 'customStyle', status])
    if (style && style.iconProps) { // iconProps is not custom style, user can select icon before opening advanced style
      style = style.without('iconProps')
    }
    return !!(style && Object.keys(style).length > 0)
  }

  onRegularStyleChange = (style: IMAdvanceStyleSettings) => {
    const config = this.props.config.setIn(['styleConfig', 'customStyle', 'regular'], style)
    this.props.onSettingChange({
      id: this.props.id,
      config
    })
  }

  onHoverStyleChange = (style: IMAdvanceStyleSettings) => {
    const config = this.props.config.setIn(['styleConfig', 'customStyle', 'hover'], style)
    this.props.onSettingChange({
      id: this.props.id,
      config
    })
  }

  onIconPositionChange = e => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['functionConfig', 'icon', 'position'], e.target.value)
    })
  }

  onAdvanceTabSelect = id => {
    const isConfiguringHover = id === SettingTabs.hover

    builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: this.props.id, propKey: 'isConfiguringHover', value: isConfiguringHover })
  }

  mergeUseDataSources = (textExpression: IMExpression, tipExpression: IMExpression, linkSettingExpression: IMExpression, useDataSources: ImmutableArray<UseDataSource>): ImmutableArray<UseDataSource> => {
    const textDss = expressionUtils.getUseDataSourceFromExpParts(textExpression && textExpression.parts, useDataSources)
    const tipDss = expressionUtils.getUseDataSourceFromExpParts(tipExpression && tipExpression.parts, useDataSources)
    const linkSettingDss = expressionUtils.getUseDataSourceFromExpParts(linkSettingExpression && linkSettingExpression.parts, useDataSources)
    return this.mergeUseDataSourcesByDss(textDss, tipDss, linkSettingDss, useDataSources)
  }

  mergeUseDataSourcesByDss = (textUseDss: ImmutableArray<UseDataSource>, tipUseDss: ImmutableArray<UseDataSource>, linkSettingUseDss: ImmutableArray<UseDataSource>, useDataSources: ImmutableArray<UseDataSource>): ImmutableArray<UseDataSource> => {
    const useDataSourcesWithoutFields = expressionUtils.getUseDataSourcesWithoutFields(useDataSources)
    let mergedUseDss = expressionUtils.mergeUseDataSources(useDataSourcesWithoutFields, textUseDss)
    mergedUseDss = expressionUtils.mergeUseDataSources(mergedUseDss, tipUseDss)
    mergedUseDss = expressionUtils.mergeUseDataSources(mergedUseDss, linkSettingUseDss)
    return mergedUseDss
  }

  getIsDataSourceUsed = () => {
    return !!this.props.useDataSourcesEnabled
  }

  getDefaultExpression = (text: string): IMExpression => {
    let parts = []
    if (text) {
      parts = [{ type: ExpressionPartType.String, exp: `"${text}"` }]
    }
    return Immutable({ name: '', parts })
  }

  getTipExpression = (): IMExpression => {
    const expression = this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.toolTipExpression &&
      this.props.config.functionConfig.toolTipExpression
    return expression || this.getDefaultExpression(this.state.currentTipInput)
  }

  getTextExpression = (): IMExpression => {
    const expression = this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.textExpression &&
      this.props.config.functionConfig.textExpression
    return expression || this.getDefaultExpression(this.state.currentTextInput)
  }

  getLinkSettingExpression = (): IMExpression => {
    const expression = this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.linkParam &&
      this.props.config.functionConfig.linkParam && this.props.config.functionConfig.linkParam.expression

    return expression ||
      (
        this.props.config?.functionConfig?.linkParam?.linkType === LinkType.WebAddress && this.props.config?.functionConfig?.linkParam?.value
          ? this.getDefaultExpression(this.props.config?.functionConfig?.linkParam?.value)
          : null
      )
  }

  openTextExpPopup = () => {
    this.setState({
      isTextExpOpen: true,
      isTipExpOpen: false
    })
  }

  openTipExpPopup = () => {
    this.setState({
      isTextExpOpen: false,
      isTipExpOpen: true
    })
  }

  closeTextExpPopup = () => {
    this.setState({
      isTextExpOpen: false,
      isTipExpOpen: false
    })
  }

  closeTipExpPopup = () => {
    this.setState({
      isTextExpOpen: false,
      isTipExpOpen: false
    })
  }

  showTextSetting = (): boolean => {
    return !!(
      !this.getIsDataSourceUsed()
        ? !!this.state.currentTextInput
        : !!(
            !this.props.config.getIn(['functionConfig', 'textExpression']) ||
          (
            this.props.config.getIn(['functionConfig', 'textExpression']) &&
            this.props.config.getIn(['functionConfig', 'textExpression', 'parts']) &&
            (this.props.config.getIn(['functionConfig', 'textExpression', 'parts']).length > 1 || this.props.config.getIn(['functionConfig', 'textExpression', 'parts', '0', 'exp']) !== '""')
          )
          )
    )
  }

  showIconSetting = (): boolean => {
    return !!this.props.config.getIn(['functionConfig', 'icon'])
  }

  toggleUseCustom = () => {
    let config = this.props.config
    config = config.setIn(['styleConfig', 'useCustom'], !config.getIn(['styleConfig', 'useCustom']))
    if (config.getIn(['styleConfig', 'useCustom'])) {
      config = config.setIn(['styleConfig', 'customStyle', 'hover'], {})
      config = config.setIn(['styleConfig', 'customStyle', 'regular'], {})
    } else {
      config = config.set('styleConfig', config.styleConfig.without('customStyle'))
    }
    this.props.onSettingChange({
      id: this.props.id,
      config
    })
  }

  render () {
    const icon = this.props.config.functionConfig.icon?.data as IconResult || null
    const customIcons = this.props.config.functionConfig?.customIcons as unknown as IconResult[] || null
    const customStyle = this.props.config.styleConfig && this.props.config.styleConfig.customStyle
    const isTextSettingOpen = this.showTextSetting()
    const isIconSettingOpen = this.showIconSetting()
    const isPositionOpen = isTextSettingOpen && isIconSettingOpen
    return (
      <div css={getStyle(this.props.theme)}>
        <div className="widget-setting-link jimu-widget">
          <div>
            <SettingSection>
              <SettingRow>
                <div className="choose-ds w-100">
                  <DataSourceSelector types={supportedDsTypes} useDataSources={this.props.useDataSources}
                    useDataSourcesEnabled={this.getIsDataSourceUsed()} onToggleUseDataEnabled={this.onToggleUseDataEnabled}
                    onChange={this.onDataSourceChange} widgetId={this.props.id}
                  />
                </div>
              </SettingRow>
            </SettingSection>

            <SettingSection>
              <SettingRow role='group' aria-label={this.props.intl.formatMessage({ id: 'setLink', defaultMessage: jimuUIMessages.setLink })} >
                <LinkSelector
                  onSettingConfirm={this.onSettingLinkConfirm}
                  linkParam={this.props.config.functionConfig.linkParam}
                  useDataSources={this.getIsDataSourceUsed() && this.props.useDataSources}
                  widgetId={this.props.id}
                />
              </SettingRow>
              <SettingRow label={this.props.intl.formatMessage({ id: 'tooltip', defaultMessage: jimuUiDefaultMessages.tooltip })} />
              <SettingRow role='group' aria-label={this.props.intl.formatMessage({ id: 'tooltip', defaultMessage: jimuUiDefaultMessages.tooltip })} >
                {
                  this.getIsDataSourceUsed()
                    ? <div className="w-100">
                      <ExpressionInput useDataSources={this.props.useDataSources} onChange={this.onTipExpChange} openExpPopup={this.openTipExpPopup}
                        expression={this.getTipExpression()} isExpPopupOpen={this.state.isTipExpOpen} closeExpPopup={this.closeTipExpPopup}
                        types={expressionInputTypes} widgetId={this.props.id}
                        aria-label={this.props.intl.formatMessage({ id: 'tooltip', defaultMessage: jimuUiDefaultMessages.tooltip })}
                      />
                    </div>
                    : <TextInput className="w-100" value={this.state.currentTipInput} size='sm'
                      onChange={(event) => { this.setState({ currentTipInput: event.target.value }) }}
                      onBlur={() => { this.onToolTipChange() }} onKeyUp={() => { this.onToolTipChange() }}
                      aria-label={this.props.intl.formatMessage({ id: 'tooltip', defaultMessage: jimuUiDefaultMessages.tooltip })}
                    />
                }
              </SettingRow>
              <SettingRow label={this.props.intl.formatMessage({ id: 'text', defaultMessage: jimuUiDefaultMessages.text })} />
              <SettingRow role='group' aria-label={this.props.intl.formatMessage({ id: 'text', defaultMessage: jimuUiDefaultMessages.text })} >
                {
                  this.getIsDataSourceUsed()
                    ? <div className="w-100">
                      <ExpressionInput useDataSources={this.props.useDataSources} onChange={this.onTextExpChange} openExpPopup={this.openTextExpPopup}
                        expression={this.getTextExpression()} isExpPopupOpen={this.state.isTextExpOpen} closeExpPopup={this.closeTextExpPopup}
                        types={expressionInputTypes}
                        widgetId={this.props.id}
                      />
                    </div>
                    : <TextInput className="w-100" value={this.state.currentTextInput} size='sm'
                      onChange={(event) => { this.setState({ currentTextInput: event.target.value }) }}
                      onBlur={() => { this.onTextChange() }}
                      onKeyUp={() => { this.onTextChange() }}
                    />
                }
              </SettingRow>
              <SettingRow label={this.props.intl.formatMessage({ id: 'icon', defaultMessage: jimuCoreMessages.icon })}>
                <IconPicker icon={icon} customIcons={customIcons} configurableOption={'none'} onChange={this.onIconResultChange}
                  aria-label={this.props.intl.formatMessage({ id: 'icon', defaultMessage: jimuCoreMessages.icon })} setButtonUseColor={false}
                />
              </SettingRow>
              {
                isPositionOpen &&
                <SettingRow label={this.props.intl.formatMessage({ id: 'position', defaultMessage: jimuUIMessages.position })}>
                  <div>
                    <Select onChange={this.onIconPositionChange} size='sm'
                      value={this.props.config.functionConfig && this.props.config.functionConfig.icon && this.props.config.functionConfig.icon.position}
                      aria-label={this.props.intl.formatMessage({ id: 'position', defaultMessage: jimuUIMessages.position })}
                    >
                      {
                        Object.keys(IconPosition).map(p => <option value={IconPosition[p]} key={p}>
                          {this.props.intl.formatMessage({ id: p.toLowerCase(), defaultMessage: jimuUIMessages[p.toLowerCase()] })}
                        </option>)
                      }
                    </Select>
                  </div>
                </SettingRow>
              }
            </SettingSection>

            <SettingSection className='px-14'>
              <AdvanceCollapse title={this.props.intl.formatMessage({ id: 'advance', defaultMessage: jimuUIMessages.advance })}
                isOpen={!!this.props.config?.styleConfig?.useCustom} toggle={this.toggleUseCustom}
              >
                <Tabs fill type='pills' onChange={this.onAdvanceTabSelect} defaultValue={SettingTabs.regular}>
                  <Tab className='tab-label' id={SettingTabs.regular} title={this.props.intl.formatMessage({ id: 'default', defaultMessage: jimuUIMessages.default })}>
                    <AdvanceStyleSetting intl={this.props.intl} appTheme={this.props.theme2}
                      style={customStyle && customStyle.regular} onChange={this.onRegularStyleChange}
                      isTextSettingOpen={isTextSettingOpen} isIconSettingOpen={isIconSettingOpen}
                    />
                  </Tab>
                  <Tab className='tab-label' id={SettingTabs.hover} title={this.props.intl.formatMessage({ id: 'hover', defaultMessage: jimuUIMessages.hover })}>
                    <AdvanceStyleSetting intl={this.props.intl} appTheme={this.props.theme2}
                      style={customStyle && customStyle.hover} onChange={this.onHoverStyleChange}
                      isTextSettingOpen={isTextSettingOpen} isIconSettingOpen={isIconSettingOpen}
                    />
                  </Tab>
                </Tabs>
              </AdvanceCollapse>
            </SettingSection>

          </div>
        </div>
      </div>
    )
  }
}
