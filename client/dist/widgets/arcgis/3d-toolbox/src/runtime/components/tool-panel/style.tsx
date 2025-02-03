import { type IMThemeVariables, css, type SerializedStyles/*, polished*/ } from 'jimu-core'

export function getStyle (theme: IMThemeVariables): SerializedStyles {
  const surface = {
    bg: theme.sys.color.surface.paper,
    border: {
      color: theme.sys.color.divider.secondary,
      width: '1px'
    },
    shadow: 'none'
  }

  return css`
    /*min-width: 300px;*/
    background-color: ${surface.bg};

    .tool-header {

      .label {
        font-weight: 600;
        font-size: 16px;
      }
    }

    .api-loader {
      position: absolute;
      height: 50%;
      left: 50%;
      z-index: 1;
    }

    .tool-content {
      min-width: 270px;
      min-height: 36px;
      overflow: auto;
      height: calc(100% - 32px);

      .esri-widget__heading {
        display: none;
      }

      /* min-height of widgets, for popper placement ,#13159 */
      .daylight-container {
        min-height: 200px;
      }
      .weather-container {
        min-height: 124px;
      }
      .shadowcast-container {
        min-height: 341px;
      }
      .lineofsight-container {
        min-height: 56px;
      }
      .slice-container {
        min-height: 56px;
      }

      .tool-footer {
        button {
          border: 1px solid ${theme.sys.color.primary.main};
        }
      }
    }
  `
}
