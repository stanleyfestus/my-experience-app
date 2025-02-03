import { type IMThemeVariables, css, type SerializedStyles/*, polished*/ } from 'jimu-core'

export function getStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
    .status-tips {
      min-width: 200px;
      min-height: 200px;
    }

    .layer-selector {

      .single-mode-selector,
      .jimu-multi-select {
        .jimu-dropdown-button {
          padding-left: 6px;
          justify-content: flex-start;
        }

        .jimu-dropdown-button,
        .jimu-dropdown-button:hover {
          background-color: var(--sys-color-surface-paper);
          border: none;

          .placeholder,
          .dropdown-button-content {
            color: var(--ref-palette-neutral-1100); /* dark-800 */
          }
          .dropdown-button-content {
            flex: none;
            max-width: 100%;
          }
        }
      }

      .jimu-multi-select .dropdown >.dropdown-button {
        padding-left: 6px;
        padding-right: 6px;
      }
      .jimu-multi-select .dropdown >.dropdown-button:hover {
        border: none;
      }
    }

    .widget-container.esri-building-explorer {
      max-height: calc(100%);
    }
    .widget-container {
      overflow-y: hidden;
      background-color: var(--sys-color-surface-paper);

      .esri-building-level-picker,
      .esri-building-phase-picker {
        background-color: var(--sys-color-surface-paper);
      }

      .esri-building-level-picker-label__clear-button {
        /*background-color: var(--sys-color-surface-background);*/
      }
      .esri-icon-close:before {
        color: var(--ref-palette-neutral-1100);
      }

      .esri-building-level-picker__arrow-up,
      .esri-building-level-picker__arrow-down,
      .esri-building-phase-picker__arrow-left,
      .esri-building-phase-picker__arrow-right {
        color: var(--ref-palette-neutral-1100);
      }

      ..esri-building-level-picker-item--active .esri-building-level-picker-item__base .rect,
      .esri-building-phase-picker__phase.esri-building-phase-picker__phase--current {
        background-color: var(--Primary-Primary-500);
      }
    }
  `
}
