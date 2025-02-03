import { type IMConfig } from './config'

export type CustomPopupDockPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export type PopupDockPosition = 'auto' | CustomPopupDockPosition

export const CustomDockPositionArray: CustomPopupDockPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']

export function getValidPopupDockPosition (config: IMConfig): PopupDockPosition {
  let result: PopupDockPosition = null

  if (config && config.popupDockPosition) {
    if (config.popupDockPosition === 'auto' || CustomDockPositionArray.includes(config.popupDockPosition)) {
      result = config.popupDockPosition
    }
  }

  return result
}

// export interface FinalScaleRange {
//   isScaleRangeValid: boolean
//   finalMinScale: number
//   finalMaxScale: number
// }

// export function getFinalScaleRangeForView (view: __esri.View, scaleRange: ScaleRange): FinalScaleRange {
//   // If minScale/maxScale is 0, means there is no limit for minScale/maxScale.
//   let result: FinalScaleRange = null

//   if (view.type === '2d' && scaleRange) {
//     const [firstLodScale, lastLodScale] = getFirstLodScaleAndLastLodScale(view)
//     const currScale = (view as __esri.MapView).scale
//     result = getFinalScaleRange(currScale, firstLodScale, lastLodScale, scaleRange)
//   }

//   if (!result) {
//     result = {
//       isScaleRangeValid: true,
//       finalMinScale: 0,
//       finalMaxScale: 0
//     }
//   }

//   return result
// }

// export function getFirstLodScaleAndLastLodScale (view: __esri.View): [number, number] {
//   const lods = (view as any).constraintsInfo?.lods as __esri.LOD[]
//   let firstLodScale: number = null
//   let lastLodScale: number = null

//   if (lods && lods.length > 0) {
//     const firstLod = lods[0]
//     const lastLod = lods[lods.length - 1]

//     if (firstLod && typeof firstLod.scale === 'number' && firstLod.scale >= 0) {
//       firstLodScale = firstLod.scale
//     }

//     if (lastLod && typeof lastLod.scale === 'number' && lastLod.scale >= 0) {
//       lastLodScale = lastLod.scale
//     }
//   }

//   return [firstLodScale, lastLodScale]
// }

// export function getFinalScaleRange (currScale: number, firstLodScale: number, lastLodScale: number, scaleRange: ScaleRange): FinalScaleRange {
//   // If minScale/maxScale is 0, means there is no limit for minScale/maxScale.
//   const result: FinalScaleRange = {
//     isScaleRangeValid: true,
//     finalMinScale: 0,
//     finalMaxScale: 0
//   }

//   if (scaleRange) {
//     const configMinScale = scaleRange.minScale
//     const configMaxScale = scaleRange.maxScale
//     const isConfigMinScaleValid = typeof configMinScale === 'number' && configMinScale > 0 // don't use >=
//     const isConfigMaxScaleValid = typeof configMaxScale === 'number' && configMaxScale > 0 // don't use >=
//     const isFirstLodScaleValid = typeof firstLodScale === 'number' && firstLodScale >= 0 // don't use >
//     const isLastLodScaleValid = typeof lastLodScale === 'number' && lastLodScale >= 0 // don't use >

//     // Note, minScale > maxScale
//     // LOD scales:        small [lastLodScale, firstLodScale] big
//     // scaleRange scales: small [configMaxScale, configMinScale] big
//     // special cases:
//     // case1: firstLodScale < configMaxScale, invalid case, finalMinScale & finalMinScale should set to currScale
//     // case2: firstLodScale = configMaxScale, finalMinScale & finalMinScale should set to firstLodScale
//     // case3: lastLodScale > configMinScale, invalid case, finalMinScale & finalMinScale should set to currScale
//     // case4: lastLodScale = configMinScale, finalMinScale & finalMinScale should set to lastLodScale

//     // check case1
//     if (isFirstLodScaleValid && isConfigMaxScaleValid && firstLodScale < configMaxScale) {
//       result.isScaleRangeValid = false
//       result.finalMinScale = currScale
//       result.finalMaxScale = currScale
//       return result
//     }

//     // check case2
//     if (isFirstLodScaleValid && isConfigMaxScaleValid && firstLodScale === configMaxScale) {
//       result.isScaleRangeValid = false
//       result.finalMinScale = firstLodScale
//       result.finalMaxScale = firstLodScale
//       return result
//     }

//     // check case3
//     if (isLastLodScaleValid && isConfigMinScaleValid && lastLodScale > configMinScale) {
//       result.isScaleRangeValid = false
//       result.finalMinScale = currScale
//       result.finalMaxScale = currScale
//       return result
//     }

//     // check case4
//     if (isLastLodScaleValid && isConfigMinScaleValid && lastLodScale === configMinScale) {
//       result.isScaleRangeValid = false
//       result.finalMinScale = lastLodScale
//       result.finalMaxScale = lastLodScale
//       return result
//     }

//     // normal cases
//     if (isConfigMinScaleValid) {
//       if (isFirstLodScaleValid) {
//         // make sure the finalMinScale <= firstLodScale
//         result.finalMinScale = Math.min(firstLodScale, configMinScale)
//       } else {
//         result.finalMinScale = configMinScale
//       }
//     }

//     if (isConfigMaxScaleValid) {
//       if (isLastLodScaleValid) {
//         // make sure the finalMaxScale >= lastLodScale
//         result.finalMaxScale = Math.max(lastLodScale, configMaxScale)
//       } else {
//         result.finalMaxScale = configMaxScale
//       }
//     }
//   }

//   return result
// }
