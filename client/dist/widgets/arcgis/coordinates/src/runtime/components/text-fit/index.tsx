/** @jsx jsx */
import { React, jsx } from 'jimu-core'
import { type WidgetRect } from '../../../config'
import { getStyles } from './styles'

const { useEffect, useRef } = React

interface Props {
  text: string
  className?: string
  widgetRect?: WidgetRect
  domChange?: boolean
}

export const TextAutoFit = React.memo((props: Props) => {
  const { text, className, widgetRect, domChange } = props
  const outerContainerDom = useRef(null)
  const textDom = useRef(null)

  useEffect(() => {
    updateText()
  }, [text, widgetRect, outerContainerDom.current?.clientWidth, outerContainerDom.current?.clientHeight, domChange])

  const updateText = () => {
    const outerWidth = outerContainerDom.current?.clientWidth
    const outerHeight = outerContainerDom.current?.clientHeight
    const textWidth = textDom.current?.clientWidth
    const textHeight = textDom.current?.clientHeight
    if (!outerWidth || !textWidth || !outerHeight || !textHeight) return
    if (textWidth !== outerWidth || textHeight !== outerHeight) {
      const widthRate = outerWidth / textWidth
      const heightRate = outerHeight / textHeight
      textDom.current.style.transform = `scale(${Math.min(widthRate, heightRate)})`
    } else {
      textDom.current.style.transform = 'none'
    }
  }

  return <div ref={outerContainerDom} css={getStyles()} className={className}>
    <div className='text' ref={textDom}>{text}</div>
  </div>
})
