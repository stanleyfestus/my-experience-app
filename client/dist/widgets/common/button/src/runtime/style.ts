import { type IMThemeVariables, css, type SerializedStyles } from 'jimu-core'

export function getStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
    &>a {
      display: flex !important;
      justify-content: center;
    }

    .auto-size-icon {
      line-height: 1;
    }

  `
}
