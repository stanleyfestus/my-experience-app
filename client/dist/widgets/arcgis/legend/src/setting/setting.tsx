/** @jsx jsx */
import {
  React,
  Immutable,
  type ImmutableObject,
  type DataSourceJson,
  type IMState,
  FormattedMessage,
  jsx,
  getAppStore,
  type UseDataSource
} from 'jimu-core'
import {
  Switch,
  type BackgroundStyle,
  FillType,
  defaultMessages as jimuDefaultMessage
} from 'jimu-ui'
import {
  MapWidgetSelector,
  SettingSection,
  SettingRow
} from 'jimu-ui/advanced/setting-components'
import { DataSourceTypes } from 'jimu-arcgis'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import /* DataSourceSelector */ 'jimu-ui/advanced/data-source-selector'
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker'
import { ELegendMode, type IMConfig, type Style } from '../config'
import defaultMessages from './translations/default'
import { getStyle } from './lib/style'
import GroupRadios from './components/group-radios'
const textIcon = require('jimu-ui/lib/icons/uppercase.svg')
const allDefaultMessages = Object.assign({}, defaultMessages, jimuDefaultMessage)

export enum CardLayout {
  Auto = 'auto',
  SideBySide = 'side-by-side',
  Stack = 'stack',
}

interface ExtraProps {
  dsJsons: ImmutableObject<{ [dsId: string]: DataSourceJson }>
}

export interface WidgetSettingState {
  cardStyle: boolean
  cardLayoutValue: string
  legendMode: ELegendMode
}

export default class Setting extends React.PureComponent<
AllWidgetSettingProps<IMConfig> & ExtraProps,
WidgetSettingState
> {
  supportedDsTypes = Immutable([
    DataSourceTypes.WebMap,
    DataSourceTypes.WebScene
  ])

  static mapExtraStateProps = (state: IMState): ExtraProps => {
    return {
      dsJsons: state.appStateInBuilder.appConfig.dataSources
    }
  }

  constructor (props) {
    super(props)
    const { cardLayout = CardLayout.Auto, cardStyle = false, legendMode = ELegendMode.ShowVisible } = this.props.config
    this.state = {
      cardStyle: cardStyle,
      cardLayoutValue: cardLayout,
      legendMode: legendMode
    }
  }

  translate (stringId: string) {
    return this.props.intl.formatMessage({
      id: stringId,
      defaultMessage: allDefaultMessages[stringId]
    })
  }

  getPortUrl = (): string => {
    const portUrl = getAppStore().getState().portalUrl
    return portUrl
  }

  getDefaultStyleConfig (): Style {
    return {
      useCustom: false,
      background: {
        color: '',
        fillType: FillType.FILL
      },
      fontColor: ''
    }
  }

  getStyleConfig (): Style {
    if (this.props.config.style && this.props.config.style.useCustom) {
      return this.props.config.style
    } else {
      return this.getDefaultStyleConfig()
    }
  }

  onOptionsChanged = (checked, name): void => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(name, checked)
    })
    if (name === 'cardStyle') {
      this.setState({
        cardStyle: checked
      })
    }
  }

  onCardLayoutChange = (cardLayout: CardLayout) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('cardLayout', cardLayout)
    })

    this.setState({
      cardLayoutValue: cardLayout
    })
  }

  onLegendModeChange = (legendMode: ELegendMode) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('legendMode', legendMode)
    })

    this.setState({
      legendMode: legendMode
    })
  }

  onToggleUseDataEnabled = (useDataSourcesEnabled: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      useDataSourcesEnabled
    })
  }

  onDataSourceChange = (useDataSources: UseDataSource[]) => {
    if (!useDataSources) {
      return
    }

    this.props.onSettingChange({
      id: this.props.id,
      useDataSources: useDataSources
    })
  }

  onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds: useMapWidgetIds
    })
  }

  onUseCustomStyleChanged = (checked) => {
    // const style = this.props.config.style ? Immutable(this.props.config.style) : Immutable({} as Style);
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['style', 'useCustom'], checked)
    })
  }

  onFontStyleChanged = (color) => {
    // const style = this.props.config.style ? Immutable(this.props.config.style) : Immutable({} as Style);
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['style', 'fontColor'], color)
    })
  }

  onBackgroundStyleChange = (backgroundColor) => {
    const bg = {
      color: backgroundColor,
      fillType: FillType.FILL
    }
    let background = Immutable(
      this.props.config?.style?.background ?? ({} as BackgroundStyle)
    )
    for (const key in bg) {
      switch (key) {
        case 'fillType':
          if (background.fillType !== bg[key]) {
            background = background.set('fillType', bg[key])
          }
          break
        case 'color':
          background = background.set('color', bg[key])
          break
        case 'image':
          background = background.set('image', bg[key])
          break
      }
    }

    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['style', 'background'], background)
    })
  }

  render () {
    let cardLayoutContent = null
    if (this.state.cardStyle) {
      cardLayoutContent = (
        <SettingRow flow="wrap" role="radiogroup">
          <GroupRadios value={this.state.cardLayoutValue}
            name={this.translate('cardStyle')}
            onChange={this.onCardLayoutChange}
            itemsIds={['auto', 'sideBySide', 'stack']}
            itemsOptions={Object.values(CardLayout)} >
          </GroupRadios>
        </SettingRow>
      )
    }

    const legendModeContent = (
      // The itemsIds and itemsOptions should stay the same order
      <SettingRow flow="wrap" role="radiogroup">
        <div style={{ marginLeft: '-0.5rem' }}>
          <GroupRadios
            name={this.translate('legendMode')}
            value={this.state.legendMode}
            onChange={this.onLegendModeChange}
            itemsIds={['showVisible', 'showWithinExtent']}
            itemsOptions={Object.values(ELegendMode)}
          />
        </div>
      </SettingRow>
    )

    let displayStyleContent
    if (this.props.config.style?.useCustom) {
      displayStyleContent = 'block'
    } else {
      displayStyleContent = 'none'
    }

    return (
      <div css={getStyle(this.props.theme)}>
        <div className="widget-setting-legend">
          <SettingSection
            className="map-selector-section"
            role="group"
          >
            <SettingRow
              label={
                <FormattedMessage
                  id="selectMapWidget"
                  defaultMessage={allDefaultMessages.selectMapWidget}
                />
              }
            />
            <SettingRow>
              <MapWidgetSelector
                onSelect={this.onMapWidgetSelected}
                useMapWidgetIds={this.props.useMapWidgetIds}
              />
            </SettingRow>
          </SettingSection>

          <SettingSection
            title={this.translate('legendMode')}
            role="group"
            aria-label={this.translate('legendMode')}
          >
            {legendModeContent}
          </SettingSection>

          <SettingSection
            title={this.translate('options')}
            role="group"
            aria-label={this.translate('options')}
          >
            <SettingRow
              label={
                <FormattedMessage
                  id="showBaseMap"
                  defaultMessage={allDefaultMessages.showBaseMap}
                />
              }
            >
              <Switch
                className="can-x-switch"
                checked={
                  (this.props.config && this.props.config.showBaseMap) || false
                }
                data-key="showBaseMap"
                onChange={(evt) => {
                  this.onOptionsChanged(evt.target.checked, 'showBaseMap')
                }}
                aria-label={this.translate('showBaseMap')}
              />
            </SettingRow>

            <SettingRow
              label={
                <FormattedMessage
                  id="cardStyle"
                  defaultMessage={allDefaultMessages.cardStyle}
                />
              }
            >
              <Switch
                className="can-x-switch"
                checked={
                  (this.props.config && this.props.config.cardStyle) || false
                }
                data-key="cardStyle"
                onChange={(evt) => {
                  this.onOptionsChanged(evt.target.checked, 'cardStyle')
                }}
                aria-label={this.translate('cardStyle')}
              />
            </SettingRow>
            {cardLayoutContent}

          </SettingSection>

          <SettingSection>
            <SettingRow
              className="advanced-setting-row"
              label={
                <FormattedMessage id="advance" defaultMessage="Advanced" />
              }
            >
              <Switch
                className="can-x-switch"
                checked={this.getStyleConfig().useCustom || false}
                data-key="showBaseMap"
                onChange={(evt) => {
                  this.onUseCustomStyleChanged(evt.target.checked)
                }}
                aria-label={this.translate('advance')}
              />
            </SettingRow>
            <div className="mt-4" style={{ display: displayStyleContent }}>
              <SettingRow
                label={<FormattedMessage id="font" defaultMessage="Font" />}
              >
                <ThemeColorPicker
                  icon={textIcon}
                  type="with-icon"
                  specificTheme={this.props.theme2}
                  value={
                    this.getStyleConfig().fontColor ||
                    this.props.theme2.arcgis.widgets.legend.variants?.default
                      ?.root?.color ||
                    ''
                  }
                  onChange={this.onFontStyleChanged}
                  aria-label={this.translate('fontColor')}
                />
              </SettingRow>
              <SettingRow
                label={
                  <FormattedMessage
                    id="background"
                    defaultMessage="Background"
                  />
                }
              >
                <ThemeColorPicker
                  specificTheme={this.props.theme2}
                  value={
                    this.getStyleConfig().background?.color ||
                    this.props.theme2.sys.color.surface.paper ||
                    ''
                  }
                  onChange={this.onBackgroundStyleChange}
                  aria-label={this.translate('backgroundColor')}
                />
              </SettingRow>
            </div>
          </SettingSection>
        </div>
      </div>
    )
  }
}
