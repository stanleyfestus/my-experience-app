import { getStrokeStyle, getPointStyle, getDividerLineStyle } from '../../common/template-style'
import { Direction, PointStyle, type Config } from '../../config'

export const getNewDividerLineStyle = config => {
  const { direction } = config
  const { size, color, type } = config.strokeStyle
  return getStrokeStyle(size, color, direction)[type]
}

export const getDividerLinePositionStyle = (config: Config) => {
  const { direction, pointEnd, pointStart, strokeStyle } = config
  const isHorizontal = direction === Direction.Horizontal
  const pointStartStyle = pointStart.pointStyle
  const pointStartSize =
    pointStart.pointSize * getSize(strokeStyle?.size)
  const pointEndStyle = pointEnd.pointStyle
  const pointEndSize = pointEnd.pointSize * getSize(strokeStyle?.size)
  const isPointStartEnable = pointStartStyle !== PointStyle.None
  const isPointEndEnable = pointEndStyle !== PointStyle.None
  return getDividerLineStyle(
    isHorizontal,
    isPointStartEnable,
    isPointEndEnable,
    pointStartSize,
    pointEndSize
  )
}

export const getNewPointStyle = (config, isPointStart = true) => {
  const { pointEnd, pointStart, strokeStyle, direction } = config
  const strokeSize = Number(getSize(strokeStyle.size))
  const size = `${
    isPointStart
      ? pointStart.pointSize * strokeSize
      : pointEnd.pointSize * strokeSize
  }px`
  const color = strokeStyle?.color
  const style = isPointStart ? pointStart.pointStyle : pointEnd.pointStyle
  const pointStyle = getPointStyle(size, color, direction, isPointStart)
  return pointStyle[style]
}

export const getSize = (size: string): number => {
  const sizeNumber = size.split('px')[0]
  return Number(sizeNumber)
}
