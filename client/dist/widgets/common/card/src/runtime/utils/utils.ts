import { Immutable } from 'jimu-core'
import { type IMCardBackgroundStyle } from '../../config'
export function initBackgroundStyle (cardBackgroundStyle: IMCardBackgroundStyle) {
  const newCardBackgroundStyle = cardBackgroundStyle?.setIn(['boxShadow', 'color'], 'transparent').asMutable({ deep: true })
  const border = newCardBackgroundStyle?.border || {}
  if ((border as any)?.color || !newCardBackgroundStyle?.border) {
    return cardBackgroundStyle
  } else {
    delete newCardBackgroundStyle?.border
    return Immutable({
      ...newCardBackgroundStyle,
      ...border
    })
  }
}
