import { type IMThemeVariables, css, type SerializedStyles } from 'jimu-core'

export function getWidgetPlaceholderStyle (): SerializedStyles {
  return css`
    &.jimu-widget-placeholder {
      display: flex;
      justify-content: center;
      align-items: center;

      min-height: inherit;

      .thumbnail-wrapper {
        flex-direction: inherit;
      }
    }
  `
}

export function getStyle (/* theme: IMThemeVariables */): SerializedStyles {
  return css`
    height: 100%;

    .fly-error-tips {
      display: flex;
      height: 100%;
      justify-content: center;
      align-items: center;
    }

    .fly-controller {
      height: 32px;
    }

    .fly-wrapper  {
      white-space: nowrap;
    }
    `
}

export function getDropdownStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
  padding: 5px 10px;
  border: 1px solid ${theme.ref.palette.neutral[500]};

  .dropdown-items{
    padding: 10px;
  }
  .dropdown-item{
    padding: 5px 0;
  }
  .dropdown-item-title{
    font-size: 13px;
    padding-bottom:5px;
  }

  .dropdown-item-comment{
    font-style:italic;
    font-size: 12px;
    color: ${theme.ref.palette.neutral[600]};
    letter-spacing: 0;
  }

  .setting-altitude-separator{
    margin: 0 8px 0 4px;
  }

  .alt-wrapper {
    align-items: center;
    font-size: 13px;
  }
  .alt-input {
    width: 60px
  }
  `
}

// Toggle speedController
export function getPlayPanelWrapperClass (isPlaying: boolean): string {
  let cssClasses = 'hide'
  if (isPlaying) {
    cssClasses = ''
  }
  return cssClasses
}
