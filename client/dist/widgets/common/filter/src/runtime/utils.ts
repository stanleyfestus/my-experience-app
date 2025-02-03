import { applyMaxSizeModifier, getCustomFlipModifier, maxSizeModifier } from 'jimu-ui'

export const popperModifiers = [
  getCustomFlipModifier({ fallbackPlacements: ['top', 'left', 'right'], useClosestVerticalPlacement: true }),
  maxSizeModifier,
  applyMaxSizeModifier
]
