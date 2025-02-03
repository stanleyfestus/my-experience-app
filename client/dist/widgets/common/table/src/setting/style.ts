import { type IMThemeVariables, css, type SerializedStyles, polished } from 'jimu-core'

export function getStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
    .widget-setting-table {
      .filter-item {
        display: flex;
        padding: 0.5rem 0.75rem;
        margin-bottom: 0.25rem;
        line-height: 23px;
        cursor: pointer;
        background-color: ${theme.sys.color.secondary.main};

        .filter-item-icon {
          width: 14px;
          margin-right: 0.5rem;
        }
        .filter-item-name {
          word-wrap: break-word;
        }
      }

      .filter-item-active {
        border-left: 2px solid ${theme.sys.color.primary.main};
      }

      .arrange-style-container {
        .arrange_container {
          margin-top: 10px;
          display: flex;
          .jimu-btn {
            padding: 0;
            background: ${theme.ref.palette.neutral[300]};
            &.active {
              border: 2px solid ${theme.sys.color.primary.light};
            }
          }
        }
      }
      .empty-placeholder {
        display: flex;
        flex-flow: column;
        justify-content: center;
        height: calc(100% - 255px);
        overflow: hidden;
        .empty-placeholder-inner {
          padding: 0px 20px;
          flex-direction: column;
          align-items: center;
          display: flex;

          .empty-placeholder-text {
            color: ${theme.ref.palette.neutral[1000]};
            font-size: ${polished.rem(14)};
            margin-top: 16px;
            text-align: center;
          }
          .empty-placeholder-icon {
            color: ${theme.ref.palette.neutral[800]};
          }
        }
      }

      .setting-ui-unit-tree, .setting-ui-unit-list {
        width: 100%;
        .tree-item {
          justify-content: space-between;
          align-items: center;
          font-size: ${polished.rem(13)};
          &.tree-item_level-1 {
          }
          .jimu-checkbox {
            margin-right: .5rem;
          }
        }
      }
      .setting-ui-unit-list-new {
        padding-top: ${polished.rem(8)};
      }
    }
  `
}
