import { type IMThemeVariables, css, type SerializedStyles } from 'jimu-core'

export function getStyle (theme: IMThemeVariables, isRTL: boolean, autoWidth: boolean, autoHeight: boolean): SerializedStyles {
  const containerColor = theme.sys.color.surface.paper
  const widgetStyle = css`
    .empty-content{
        height:100%;
        width:100%;
        display: flex;
        flex-direction:column;
        align-items: center;
        justify-content:center;
        .info-txt{
          margin-top: 6px;
          color:${theme.sys.color.surface.paperHint};
          text-align: center;
        }
    }
    .widget-track-panel{
      height:40px;
      line-height: 40px;
      width:100%;
      background-color: ${containerColor};
      display:flex;
      align-items: center;
      justify-content:space-between;
    }
    .tool-dividing-line{
        height: 16px;
        width: 1px;
        display: inline-flex;
        background-color: ${theme.sys.color.divider.secondary};
        margin: 8px 4px;
    }
    .header-section{
        position: relative;
        width: 100%;
        height: 32px;
        display: flex;
        flex: 0 0 auto;
        justify-content: space-between;
        .left,.right{
          display:flex;
          justify-content: left;
          align-items: center;
          .track-name{
            margin-left:8px;
            font-weight: 500;
            font-size: 16px;
            color:${theme.sys.color.surface.paperText};
          }
          .track-icon{
            width:16px;
            height:16px;
            color:${theme.sys.color.surface.paperText};
          }
        } 
        .del-icon{
          height: 16px;
          width:16px;
          cursor: pointer;
        }
    }
    .widget-track{
        width: calc(100% - 32px);
        height: calc(100% - 24px);
        display: inline-block;
        ${autoHeight && 'min-height: 430px;'};
        ${autoWidth && 'min-width: 360px;'};
        display: flex;
        flex-direction: column;
        height: 100%;
        width:100%;
        background-color: ${containerColor};
      .warning-inaccessible{
        position: absolute;
        left: 0.25rem;
        right: 0.25rem;
        top: 0.25rem;
        width: auto;
        z-index:100;
      }
      .btn-content{
        flex: 0 0 auto;
        width: 100%;
        height: 30px;
        margin-top: 16px;
        .btn{
          height: 30px;
          line-height: 30px;
          width: 100%;
          padding: 0;
        }
      }
      .btn-content-trace{
        flex: 0 0 auto;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        width: 100%;
        height: 30px;
        margin-top: 16px;
        .btn-span{
          width: 30px;
          height: 30px;
          margin-right: 8px;
        }
        .btn-trace{
          padding: 5px;
          border-radius: 2px;
          border: 1px solid ${theme.sys.color.divider.tertiary};
          background: ${theme.sys.color.surface.paper};
        }
        span{
          width: 100%;
        }
        .btn-auto{
          height: 31px;
          line-height: 31px;
          width: 100%;
          padding: 0;
        }
      }
      .track-list-items{
        padding-top:16px;
        padding-bottom: 16px;
        margin:0;
      }
    }  
`
  return widgetStyle
}
