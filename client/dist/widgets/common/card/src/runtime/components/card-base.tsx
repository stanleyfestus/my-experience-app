/** @jsx jsx */
import {
  React,
  css,
  type IMThemeVariables,
  type AppMode,
  type BrowserSizeMode
} from 'jimu-core'
import { type IMConfig, type Status, type CardLayout } from '../../config'
export interface CardProps {
  theme?: IMThemeVariables
  widgetId?: string
  cardStyle?: any
  layouts?: any
  browserSizeMode?: BrowserSizeMode
  formatMessage?: (id: string, values?: { [key: string]: any }) => string
  appMode?: AppMode
  cardConfigs?: IMConfig
  isHeightAuto: boolean
  isWidthAuto: boolean
  cardLayout?: CardLayout
}

export interface CardStates {
  [key: string]: any
}

export default class Card<
  P extends CardProps = CardProps,
  S extends CardStates = CardStates
> extends React.PureComponent<P, S> {
  formatMessage = (id: string, values?: { [key: string]: any }) => {
    return this.props.formatMessage(id, values)
  }

  checkIsBackgroundTransparent (status: Status): boolean {
    const { cardConfigs } = this.props
    return cardConfigs?.[status]?.backgroundStyle?.background?.color === 'rgba(0,0,0,0)'
  }

  getStyle = (status: Status) => {
    const { widgetId } = this.props
    const isBackgroundTransparent = this.checkIsBackgroundTransparent(status)
    return css`
      & {
        overflow: hidden;
      }
      .card-link {
        cursor: pointer;
      }
      .animation-list>div {
        overflow: hidden;
      }
      .card-editor-mask {
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }
      ${'&.card-' + widgetId} {
        padding: 0;
        border: 0;
        background-color: transparent;
        height: 100%;
        position: relative;
        .card-content {
          width: 100%;
          height: 100%;
          /* overflow: hidden; */
          & > div {
            width: 100%;
            height: 100%;
          }
        }
      }
      .edit-mask {
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 10;
      }
      .clear-background {
        background: transparent !important;
      }
      .card-link {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }
      .clear-background:focus {
        outline: none;
      }
      .surface-1 {
        border: none !important;
        background: ${isBackgroundTransparent && 'none !important'};
      }
      ${'&.card-' + widgetId}:hover {
      }
    `
  }
}
