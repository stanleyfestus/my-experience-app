import { type IMThemeVariables, css, type SerializedStyles } from 'jimu-core'
import { type StyleType, type StyleConfig, FontSizeType } from '../../config'

export function getStyle (theme: IMThemeVariables, styleType: StyleType, styleConfig: StyleConfig, isRTL: boolean, autoWidth: boolean): SerializedStyles {
  let color
  const backgroundColor = 'transparent'
  const containerColor = styleConfig.backgroundColor ? styleConfig.backgroundColor : theme.sys.color.surface.paper
  let fontSizeObj

  const noFountSize = ''
  let fontSizeUnit
  let baseFontSize
  let fontSize = noFountSize
  let fontSizeH1 = noFountSize
  let fontSizeH2 = noFountSize
  let fontSizeLtH2 = noFountSize
  let fontSizeBody = noFountSize
  let fontSizeSmall = noFountSize
  // let font_size__header_text;

  if (styleType === 'custom') {
    color = styleConfig.textColor ? styleConfig.textColor : theme.ref.palette.neutral[1200]
    fontSizeObj = styleConfig.fontSize

    if (fontSizeObj && fontSizeObj.distance !== 0 && styleConfig.fontSizeType !== FontSizeType.auto) {
      fontSizeUnit = fontSizeObj.unit
      baseFontSize = fontSizeObj.distance
      fontSize = baseFontSize + fontSizeUnit
      fontSizeH1 = Math.round(baseFontSize * 1.428) + fontSizeUnit // 1.428em
      fontSizeH2 = Math.round(baseFontSize * 1.142) + fontSizeUnit // 1.142em
      fontSizeLtH2 = baseFontSize
      fontSizeBody = Math.round(baseFontSize * 0.857) + fontSizeUnit // 0.857em
      fontSizeSmall = Math.round(baseFontSize * 0.857) + fontSizeUnit
      // font_size__header_text = Math.round(baseFontSize * 1.143) + fontSizeUnit; //1.142em
    }
  } else if (styleType === 'syncWithTheme') {
    baseFontSize = noFountSize
    //color = theme.ref.palette.black
    color = theme.ref.palette.neutral[1200]
  } else {
    baseFontSize = noFountSize
    color = ''
  }

  let warningIconRight = '10px'
  let warningIconLeft = 'auto'
  if (isRTL) {
    warningIconRight = 'auto'
    warningIconLeft = '10px'
  }

  // if(fontSizeObj && fontSizeObj.distance !== 0) {
  //  fontSizeUnit = fontSizeObj.unit;
  //  baseFontSize = fontSizeObj.distance;
  //  fontSize = baseFontSize + fontSizeUnit;
  //  fontSizeH1 = Math.round(baseFontSize * 1.428) + fontSizeUnit; //1.428em
  //  fontSizeH2 = Math.round(baseFontSize * 1.142) + fontSizeUnit; //1.142em
  //  fontSizeLtH2 = baseFontSize;
  //  fontSizeBody = Math.round(baseFontSize * 0.857) + fontSizeUnit; //0.857em
  //  fontSizeSmall = Math.round(baseFontSize * 0.857) + fontSizeUnit;
  //  //font_size__header_text = Math.round(baseFontSize * 1.143) + fontSizeUnit; //1.142em
  // } else {
  //  baseFontSize = noFountSize;
  //  fontSize = noFountSize;
  //  fontSizeH1 = noFountSize;
  //  fontSizeH2 = noFountSize;
  //  fontSizeLtH2 = noFountSize;
  //  fontSizeBody = noFountSize;
  //  fontSizeSmall = noFountSize;
  //  //font_size__header_text = 'unset';
  // }

  return css`
    .widget-featureInfo{
      overflow: auto;
      word-break: break-word;
      min-width: min-content;
      ${autoWidth ? 'width: max-content' : ''};
      height: 100%;
      background-color: ${containerColor};
      color: ${color};
      --calcite-color-text-1: ${color};
      --calcite-color-text-3: ${color};
      font-size: ${fontSize};
      --calcite-font-size--0: ${fontSize};
      --calcite-font-size--1: ${fontSize};
      --calcite-font-size--2: ${fontSize};
      --calcite-color-foreground-1: ${containerColor};

      .warning-icon{
        position: absolute;
        bottom: 10px;
        right: ${warningIconRight};
        left: ${warningIconLeft};
      }
      .warning-inaccessible{
        position: absolute;
        left: 0.25rem;
        right: 0.25rem;
        bottom: 0.25rem;
        width: auto;
      }
      .header-section{
        min-width: max-content;
        display: flex;
        justify-content: space-between;
        height: 40px;
        border-bottom: 1px solid #a8a8a8;
        background-color: ${containerColor};
      }
      .header-control-section{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 40px;
        flex-grow: 2;
        /*
        position: absolute;
        right: 0;
        */
      }
      .data-action-dropdown-content{
        margin-right: 10px;
      }
      .nav-section{
        height: 40px;
        background-color: transparent;
        color: ${theme.ref.palette.neutral[1200]};
        .nav-btn{
          color: ${theme.sys.color.primary.main};
        }
        .nav-btn: hover{
          color: ${theme.sys.color.primary.main};
        }
        .nav-btn:focus{
          box-shadow: none;
        }
      }
      .feature-info-component{
        background-color: ${backgroundColor};
        padding: 0;
        .esri-feature__size-container{
          background-color: ${containerColor};
          color: ${color};
        }
        .esri-widget * {
          font-size: ${fontSize};
          color: ${color} !important;
        }
        .esri-widget {
          background-color: transparent !important;
        }
        .esri-feature__title{
          padding: 10px 7px 0 7px;
          margin: auto;
        }
        .esri-widget__heading {
          margin: 0 0 0.5rem 0;
        }
        .esri-feature__content-element{
          padding-top: 7px;
        }
        .esri-widget__table tr td, .esri-widget__table tr th {
          font-size: ${fontSizeSmall};
          word-break: break-word !important;
        }
        .esri-feature__main-container{
        }
        .esri-feature__media-previous:focus{
          outline: none;
        }
        .esri-feature__media-next:focus{
          outline: none;
        }
        .esri-feature__title {
          font-size: ${fontSize};
        }
        .esri-feature h1 {
          font-size: ${fontSizeH1};
        }
        .esri-feature h2 {
          font-size: ${fontSizeH2};
        }
        .esri-feature h3,
        .esri-feature h4,
        .esri-feature h5,
        .esri-feature h6 {
          font-size: ${fontSizeLtH2};
        }
        .esri-feature p {
          font-size: ${fontSize};
        }

        .esri-feature-content {
          padding: 0 15px;
        }
        .esri-feature-content p {
          margin: 0 0 1.2em
        }

        .esri-feature figcaption {
          font-size: ${fontSizeSmall};
        }

        .esri-feature__media-item-title {
          font-size: ${fontSizeH2};
        }
        .esri-feature__media-item-caption {
          font-size: ${fontSizeBody};
        }
        .esri-feature__last-edited-info {
          font-size: ${fontSizeSmall};
        }
        .esri-widget__table tr td, .esri-widget__table tr th {
          word-break: normal;
        }

      }
    }
  `
}
