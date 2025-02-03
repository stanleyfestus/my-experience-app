/** @jsx jsx */
import { jsx } from 'jimu-core'
import React from 'react'
import { getTheme } from 'jimu-theme'
import { round } from 'lodash-es'
import { SLD_TRACK_HEIGHT } from '../../../../constants'

export interface RulerProps {
  width?: number
  zoom?: number
  range?: [number, number]
  scrollPosition?: number
  onClickOrHover?: (e: any, clicked: boolean, hover: boolean) => void
}

export function Ruler (props: RulerProps) {
  const theme = getTheme()
  const {
    width = 0,
    zoom = 1,
    range = [-Infinity, Infinity],
    scrollPosition = 0,
    onClickOrHover
  } = props
  const canvasElement = React.useRef(null)
  const [backgroundColor, setBackgroundColor] = React.useState<string>('')
  const [textColor, setTextColor] = React.useState<string>('')
  const [isClickActive, setIsClickActive] = React.useState<boolean>(false)
  const [isHover, setIsHover] = React.useState<boolean>(false)

  React.useEffect(() => {
    function handleLostFocus (event: MouseEvent) {
      if (canvasElement.current && !canvasElement.current.contains(event.target as Node)) {
        setIsClickActive(false)
        setIsHover(false)
        onClickOrHover(null, false, false)
      }
    }

    // Add event listener to handle lost focus
    document.addEventListener('click', handleLostFocus)
    return () => {
      // Clean up to remove listener
      document.removeEventListener('click', handleLostFocus)
    }
  }, [canvasElement, onClickOrHover])

  React.useEffect(() => {
    draw(scrollPosition, zoom)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition, zoom, width])

  const getVarColor = (str) => {
    // Canvas doesn't support variables when setting colors (e.g. 'var(--color)')
    // So we need to create a temp div and get the computed color
    const elem = document.createElement('div')
    elem.style.display = 'none'
    elem.style.color = str
    document.body.appendChild(elem)
    return window.getComputedStyle(elem, null).getPropertyValue('color')
  }

  const getBackgroundColor = (varColor: string) => {
    if (backgroundColor.length === 0) {
      const color = getVarColor(varColor)
      setBackgroundColor(color)
      return color
    }
    return backgroundColor
  }

  const getTextColor = (varColor: string) => {
    if (textColor.length === 0) {
      const color = getVarColor(varColor)
      setTextColor(color)
      return color
    }
    return textColor
  }

  const draw = (scrollPosition: number, zoom: number) => {
    const canvas = canvasElement.current
    const context = canvas.getContext('2d')
    const isNegative = range[0] < 0
    const mainLineSize = SLD_TRACK_HEIGHT
    const longLineSize = SLD_TRACK_HEIGHT / 2
    const mediumLineSize = SLD_TRACK_HEIGHT / 3
    const shortLineSize = SLD_TRACK_HEIGHT / 4
    const font = '12px sans-serif'
    const backgroundColor = getBackgroundColor(theme.sys.color.surface.background)
    const lineColor = getTextColor(theme.sys.color.surface.backgroundHint)
    const textColor = getTextColor(theme.sys.color.surface.backgroundHint)
    const textBackgroundColor = 'transparent'

    // Clear Canvas
    context.rect(0, 0, width, SLD_TRACK_HEIGHT)
    context.fillStyle = backgroundColor
    context.fill()

    context.save()
    context.scale(1, 1)
    context.strokeStyle = lineColor
    context.lineWidth = 1
    context.font = font
    context.fillStyle = textColor
    context.textAlign = 'left'
    context.textBaseline = 'bottom'
    context.translate(0.5, 0)
    context.beginPath()

    const scale = range[1] - range[0]
    const zoomUnit = zoom * (width / scale)
    const scrollPos = scrollPosition / zoom === 0 ? Number.MIN_VALUE : scrollPosition / zoom
    const minRangeRaw = scrollPos * zoom / zoomUnit
    const maxRangeRaw = (scrollPos * zoom + width) / zoomUnit
    let minRange = Math.floor(minRangeRaw)
    let length = round((maxRangeRaw - minRangeRaw), 0)

    const lengthRatio = Math.ceil(length / 10)
    if (minRange % lengthRatio !== 0) {
      const offset = minRange % lengthRatio
      minRange -= offset
      length += offset
    }

    const alignOffset = Math.max(['left', 'center', 'right'].indexOf('left') - 1, -1)
    const barSize = SLD_TRACK_HEIGHT
    const values: Array<{
      color: string
      backgroundColor?: string
      value: number
      text: string
      textSize: number
      isLast: boolean
    }> = []

    let segmentCount = 1
    if (length >= 6) {
      segmentCount = 8
    } else if (length >= 4) {
      segmentCount = 16
    } else if (length >= 2) {
      segmentCount = 32
    } else {
      segmentCount = 64
    }

    for (let i = 0; i <= length; ++i) {
      if (i % lengthRatio !== 0) {
        continue
      }

      const value = (i + minRange) * (width / scale)
      const text = `${round(((scale / width) * value + range[0]), 1)}`
      const textSize = context.measureText(text).width

      values.push({
        color: textColor,
        backgroundColor: textBackgroundColor,
        value,
        text,
        textSize: textSize,
        isLast: false
      })
    }

    if (values.length === 0) {
      // small segment, show first and last measure
      values.push({
        color: textColor,
        backgroundColor: textBackgroundColor,
        value: 0,
        text: range[0].toString(),
        textSize: context.measureText(range[0].toString()).width,
        isLast: false
      })
      values.push({
        color: textColor,
        backgroundColor: textBackgroundColor,
        value: width,
        text: range[1].toString(),
        textSize: context.measureText(range[1].toString()).width,
        isLast: true
      })
    }

    // Render Segments First
    for (let i = 0; i <= length; ++i) {
      const value = i + minRange

      if (!isNegative && value < 0) {
        continue
      }

      const startValue = value * (width / scale)
      const startPos = (startValue - scrollPos) * zoom

      if (length >= 10) {
        const eighth = lengthRatio / segmentCount

        if (i % lengthRatio !== 0) {
          continue
        }

        for (let j = 0; j < segmentCount; ++j) {
          const pos = startPos + (j * eighth) * zoomUnit

          if (pos < 0 || pos >= width) {
            continue
          }

          let lineSize = mainLineSize

          if (j === 0) {
            lineSize = mainLineSize
          } else if (j % 4 === 0) {
            lineSize = longLineSize
          } else if (j % 2 === 0) {
            lineSize = mediumLineSize
          } else {
            lineSize = shortLineSize
          }

          const origin = barSize - lineSize
          const [x1, y1] = [pos, origin]
          const [x2, y2] = [x1, y1 + lineSize]

          context.moveTo(x1, y1)
          context.lineTo(x2, y2)
        }
      } else {
        for (let j = 0; j < segmentCount; ++j) {
          const pos = startPos + j / segmentCount * zoomUnit

          if (pos < 0 || pos >= width) {
            continue
          }

          let lineSize = mainLineSize

          if (j === 0 && i % lengthRatio === 0) {
            lineSize = mainLineSize
          } else if (j % 4 === 0) {
            lineSize = longLineSize
          } else if (j % 2 === 0) {
            lineSize = mediumLineSize
          } else {
            lineSize = shortLineSize
          }

          const origin = barSize - lineSize
          const [x1, y1] = [pos, origin]
          const [x2, y2] = [x1, y1 + lineSize]

          context.moveTo(x1, y1)
          context.lineTo(x2, y2)
        }
      }
    }
    context.stroke()
    context.beginPath()

    // Render Labels
    values.forEach(({ value, backgroundColor, color, text, textSize, isLast }) => {
      if (!isNegative && value < 0) {
        return
      }
      const startPos = (value - scrollPos) * zoom

      if (startPos < -zoomUnit || startPos >= width + (width / scale) * zoom) {
        return
      }

      let origin = 0
      if (isLast) {
        origin = 17
      } else {
        origin = barSize - 25
      }

      let offset = alignOffset
      if (isLast) {
        offset = textSize / 2
      }

      const [startX, startY] = [startPos + offset * -3, origin]

      if (backgroundColor) {
        let backgroundOffset = 0
        if (isLast) {
          backgroundOffset = -textSize
        } else {
          backgroundOffset = 0
        }
        context.save()
        context.fillStyle = backgroundColor
        context.fillRect(startX + backgroundOffset, 0, textSize, mainLineSize)
        context.restore()
      }

      context.save()
      context.fillStyle = color
      context.fillText(text, startX, startY)
      context.restore()
    })

    context.restore()
  }

  const onMouseDown = (e) => {
    if (isHover) {
      setIsClickActive(!isClickActive)
      onClickOrHover(e, !isClickActive, isHover)
    }
  }

  const onMouseMove = (e) => {
    if (isHover) {
      onClickOrHover(e, isClickActive, isHover)
    }
  }

  const onMouseEnter = (e) => {
    setIsHover(true)
  }

  const onMouseLeave = (e) => {
    setIsHover(false)
    onClickOrHover(e, isClickActive, false)
  }

  return (
  <div
    className="dyn-seg-ruler"
    style={{ width: width }}
    onMouseDown={onMouseDown}
    onMouseMove={onMouseMove}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    >
    <canvas
      ref={canvasElement}
      width={width}
      height={SLD_TRACK_HEIGHT}/>
  </div>
  )
}
