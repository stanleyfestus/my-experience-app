import { React, type ImmutableArray, getAppStore } from 'jimu-core'
import { type JimuMapView } from 'jimu-arcgis'
import Swipe from 'esri/widgets/Swipe'
import { SwipeStyle } from '../../config'
import { type LinearUnit } from 'jimu-ui'
const { useEffect, useRef } = React

export interface SwipeBetweenLayersProps {
  widgetId: string
  activeMapView: JimuMapView
  leadingLayersId: ImmutableArray<string>
  trailingLayersId: ImmutableArray<string>
  swipeStyle: SwipeStyle
  sliderPosition: LinearUnit
  dividerColor: string
  handlerColor: string
  isDesignMode: boolean
}

export function SwipeBetweenLayers (props: SwipeBetweenLayersProps) {
  const { widgetId, activeMapView, leadingLayersId, trailingLayersId, swipeStyle, sliderPosition, dividerColor, handlerColor, isDesignMode } = props
  const isRTL = getAppStore().getState()?.appContext?.isRTL
  const mapId = activeMapView?.mapWidgetId
  const swipeRef = useRef<__esri.Swipe>(null)
  const rightStart = (swipeStyle === SwipeStyle.SimpleHorizontal) && isRTL
  const positionRef = useRef(rightStart ? (100 - sliderPosition.distance) : sliderPosition.distance)
  const mapContainerRef = useRef<HTMLElement>(document.querySelector<HTMLElement>(`div[data-widgetid=${mapId}]`))
  const isUnmounted = useRef<boolean>(false)

  useEffect(() => {
    positionRef.current = rightStart ? (100 - sliderPosition.distance) : sliderPosition.distance
  }, [rightStart, sliderPosition])

  useEffect(() => {
    const swipe = mapContainerRef.current?.querySelector<HTMLElement>('.esri-swipe')
    if (swipe) {
      swipe.style.pointerEvents = isDesignMode ? null : 'none'
    }
  }, [isDesignMode, mapContainerRef])

  const getJimuLayerViewById = async (jimuMapView: JimuMapView, jimuLayerViewId: string) => {
    const jimuLayerView = await jimuMapView.whenJimuLayerViewLoaded(jimuLayerViewId)
    return jimuLayerView
  }

  useEffect(() => {
    return () => {
      isUnmounted.current = true
    }
  }, [])

  useEffect(() => {
    /**
     * If have used map widget and the jimu map view is created, will update swipe widget.
     */
    if (activeMapView?.view) {
      updateSwipeWidget()
    }

    function updateSwipeWidget () {
      const leadingLayersPromiseArray = leadingLayersId?.asMutable()?.map(jimuLayerViewId => {
        return getJimuLayerViewById(activeMapView, jimuLayerViewId)
      })
      const trailingLayersPromiseArray = trailingLayersId?.asMutable()?.map(jimuLayerViewId => {
        return getJimuLayerViewById(activeMapView, jimuLayerViewId)
      })
      const swipeDirection = swipeStyle === SwipeStyle.SimpleVertical ? 'vertical' : 'horizontal'
      if (leadingLayersPromiseArray && trailingLayersPromiseArray) {
        Promise.all(leadingLayersPromiseArray.concat(trailingLayersPromiseArray)).then(jimuLayerViews => {
          if (isUnmounted.current) {
            return
          }
          const leadingArray = leadingLayersId?.asMutable().map((id) => {
            const jimuLayerView = jimuLayerViews.filter(item => item.id === id)
            return jimuLayerView[0].layer
          })
          const trailingArray = trailingLayersId?.asMutable().map((id) => {
            const jimuLayerView = jimuLayerViews.filter(item => item.id === id)
            return jimuLayerView[0].layer
          })

          //Destroy method used for when mapView is changed, leadingLayersId and trailingLayersId props will be changed at two times, new Swipe and destroy Swipe twice which is not sync because of the Promise.
          destroySwipeWidget()

          // eslint-disable-next-line react-hooks/exhaustive-deps
          swipeRef.current = new Swipe({
            id: widgetId,
            leadingLayers: leadingArray,
            trailingLayers: trailingArray,
            view: activeMapView?.view as __esri.MapView,
            direction: swipeDirection,
            position: positionRef.current
          })

          activeMapView?.view.ui.add(swipeRef.current)
          watchPosition()
          swipeRef.current.when(() => {
            if (isUnmounted.current) {
              destroySwipeWidget()
              return
            }
            const divider = mapContainerRef.current.querySelector<HTMLElement>('.esri-swipe__divider')
            divider.style.backgroundColor = dividerColor
            const handler = mapContainerRef.current.querySelector<HTMLElement>('.esri-swipe__handle')
            handler && (handler.style.backgroundColor = handlerColor)
          })
        })
      }
    }
    function watchPosition () {
      swipeRef.current.watch('position', () => {
        if (swipeRef.current.position) {
          positionRef.current = swipeRef.current.position
        }
      })
    }
    function destroySwipeWidget () {
      if (swipeRef.current) {
        swipeRef.current.position = 0
        swipeRef.current.leadingLayers.removeAll()
        swipeRef.current.trailingLayers.removeAll()
        activeMapView?.view?.ui.remove(swipeRef.current)
      }
    }

    return () => {
      destroySwipeWidget()
    }
  }, [widgetId, activeMapView, sliderPosition, leadingLayersId, trailingLayersId, swipeStyle, dividerColor, handlerColor])

  return null
}
