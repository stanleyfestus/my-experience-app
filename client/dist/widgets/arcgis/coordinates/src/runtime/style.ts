import { type IMThemeVariables, css, type SerializedStyles } from 'jimu-core'
import { type WidgetRect } from '../config'

export function getStyle (theme: IMThemeVariables, isClassic: boolean, widgetRect: WidgetRect, widgetSizeAuto: boolean): SerializedStyles {
  return css`
    flex-direction: row;
    align-items: center;
    min-width: 160px;
    width: ${widgetRect.width};
    height: ${widgetRect.height};
    display: flex;
    .coordinates-widget-container {
      height: 28px;
      width: 100%;
      background-color: ${theme.ref.palette.white};
      border: 1px solid ${theme.ref.palette.neutral[500]};
      .coordinates-locate {
        flex-shrink: 0;
        border-radius: unset;
      }
      .coordinates-card {
        border: none;
        min-width: ${isClassic ? '160px' : '240px'};
        min-height: ${isClassic ? '26px' : '138px'};
        .widget-card-content {
          height: calc(100% - 40px);
          padding: 16px;
          .info-container {
            height: 100%;
            .text-fit-container {
              width: 48%;
              margin-right: 2%;
              height: 100%;
              float: left;
            }
            .coordinates-computing {
              font-size:14px;
            }
            .coordinates-card-text-geo,
            .coordinates-card-text {
              height: calc(100% - 18px);
              width: 100%;
            }
            .coordinates-card-text-empty {
              ${!widgetSizeAuto && 'height: calc(100% - 18px)'};
              width: 100%;
            }
            .coordinates-card-text-geo {
              height: 100%;
            }
            .coordinates-card-text-geo-fixed,
            .coordinates-card-text-fixed,
            .coordinates-card-text-empty {
              display: flex;
            }
            .coordinates-card-text-fixed,
            .coordinates-card-text-empty {
              font-size: 14px;
            }
            .coordinates-card-text-geo-fixed {
              font-size: 16px;
            }
            .info-unit {
              font-weight: 500;
              font-size: 12px;
              line-height: 16px;
            }
            .truncate-two {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
            }
          }
        }
        .widget-card-footer {
          padding: 2px 10px;
          height: 32px;
          background-color: unset !important;
        }
      }
      .coordinates-info {
        padding: 0 4px;
        border: 1px solid ${theme.ref.palette.neutral[300]};
        border-top: none;
        border-bottom: none;
        color: ${theme.ref.palette.neutral[1100]};
        line-height: 26px;
        flex-grow: 2;
      }
      .copy-btn {
        cursor: pointer;
        border-right: ${
          isClassic ? `1px solid ${theme.ref.palette.neutral[300]}` : 'unset'
        };
        border-radius: unset;
      }
      .widget-card-footer {
        margin: 0;
        padding: 10px;
      }
    }
  `
}
