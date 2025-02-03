/** @jsx jsx */
import { React, css, jsx, classNames, hooks } from 'jimu-core'
import { NavButtonGroup, defaultMessages } from 'jimu-ui'
import { type ResponsiveViewportResult, useResponsiveViewport } from './utils'
import { ControllerAlignment } from '../../../config'

export interface ListProps {
  vertical?: boolean
  space?: number
  alignment: ControllerAlignment
  lists: string[]
  itemLength: number
  minLength?: number
  autoSize?: boolean
  createItem: (item: string, className: string, onClick?: (e: React.MouseEvent<HTMLElement>) => void, disableDrag?: boolean) => React.ReactElement
  onMouseDown?: (evt: React.MouseEvent<HTMLElement>) => void
}

export interface ScrollListProps extends ListProps {
  syncScroll?: (scroll: ResponsiveViewportResult['scroll']) => void
  autoScrollEnd?: boolean
  onScrollStatusChange?: (hideArrow: boolean, disablePrevious?: boolean, disableNext?: boolean) => void
  className?: string
}
const useStyle = (vertical: boolean, space: number, minLength: number, autoSize: boolean, hideArrow: boolean, alignment: ControllerAlignment, remainLength: number) => {
  return css`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    button.previous, button.next {
      flex-shrink: 0;
      display: ${!hideArrow ? 'block' : 'none'};
    }
    ${alignment === ControllerAlignment.Start && !autoSize && !vertical ? `button.next { transform: translateX(${-remainLength}px); }` : ''}
    ${alignment === ControllerAlignment.Start && !autoSize && vertical ? `button.next { transform: translateY(${-remainLength}px); }` : ''}
    ${alignment === ControllerAlignment.End && !autoSize && !vertical ? `button.previous { transform: translateX(${remainLength}px); }` : ''}
    ${alignment === ControllerAlignment.End && !autoSize && vertical ? `button.previous { transform: translateY(${remainLength}px); }` : ''}
    .root {
      flex-direction: ${vertical ? 'column' : 'row'};
      width: 100%;
      height: 100%;
      ${vertical
        ? `min-height: ${minLength}px;`
        : `min-width: ${minLength}px;`
      } 
      max-height: ${!autoSize ? 'calc(100% - 20px)' : '100%'};
      max-width: ${!autoSize ? 'calc(100% - 20px)' : '100%'};
      display: flex;
      justify-content: ${
        alignment === ControllerAlignment.Start
        ? 'flex-start'
        : alignment === ControllerAlignment.End
        ? 'flex-end'
        : 'center'
      };
      flex-wrap: nowrap;
      align-items: center;
      .scroll-list-item {
        &:not(:first-of-type) {
          margin-top: ${vertical ? space + 'px' : 'unset'};
          margin-left: ${!vertical ? space + 'px' : 'unset'};
        }
      }
    }
`
}

const DefaultList = []
export const ScrollList = React.forwardRef((props: ScrollListProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    syncScroll,
    className,
    lists = DefaultList,
    createItem,
    vertical,
    itemLength,
    space,
    alignment = ControllerAlignment.Center,
    minLength = itemLength,
    autoScrollEnd,
    autoSize,
    onScrollStatusChange,
    onMouseDown
  } = props

  const translate = hooks.useTranslation(defaultMessages)

  const [rootRef, handleRef] = hooks.useForwardRef(ref)

  const {
    start,
    end,
    disablePrevious,
    disableNext,
    hideArrow,
    scroll,
    remainLength
  } = useResponsiveViewport({ rootRef, lists, itemLength, autoSize, vertical, space, minLength, autoScrollEnd })

  const visibleList = lists.slice(start, end)
  const style = useStyle(vertical, space, minLength, autoSize, hideArrow, alignment, remainLength)

  React.useEffect(() => {
    onScrollStatusChange?.(hideArrow, disablePrevious, disableNext)
  }, [disableNext, disablePrevious, hideArrow, onScrollStatusChange])

  React.useEffect(() => {
    typeof syncScroll === 'function' && syncScroll(scroll)
  }, [scroll, syncScroll])

  const handleChange = (previous: boolean) => {
    scroll(previous, true)
  }

  return <NavButtonGroup
    css={style}
    type="tertiary"
    vertical={vertical}
    onChange={handleChange}
    disablePrevious={disablePrevious}
    disableNext={disableNext}
    previousAriaLabel={translate('previous')}
    nextAriaLabel={translate('next')}
    className={classNames('scroll-list', className)}>
    <div className="root scroll-list-root" ref={handleRef} onMouseDown={onMouseDown}>
      {
        lists.map((item) => {
          const hidden = !visibleList.includes(item)
          return createItem(item, classNames('scroll-list-item', { 'd-none': hidden }))
        })
      }
    </div>
  </NavButtonGroup>
})
