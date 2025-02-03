/** @jsx jsx */
import {
  React,
  jsx,
  hooks,
  type DataSource,
  type ImmutableObject,
  type IntlShape
} from 'jimu-core'
import {
  GetUnits,
  isDefined,
  type RouteInfo,
  type NetworkInfo,
  type LrsLayer
} from 'widgets/shared-code/lrs'
import { round } from 'lodash-es'
import defaultMessages from '../translations/default'
import { Label } from 'jimu-ui'
import { type JimuMapView } from 'jimu-arcgis'
import type GraphicsLayer from 'esri/layers/GraphicsLayer'

export interface RouteAndMeasureFormProps {
  widgetId: string
  network: ImmutableObject<NetworkInfo>
  networkDS: DataSource
  routeInfo: RouteInfo
  jimuMapView: JimuMapView
  hoverGraphic: GraphicsLayer
  reset: boolean
  clearPickedGraphic: () => void
  onRouteInfoUpdated: (newRouteInfo: RouteInfo, flash?: boolean) => void
  eventLayer: ImmutableObject<LrsLayer>
  eventFeatures: any[]
  intl: IntlShape
  resetForDataAction: boolean
}

export function RouteAndMeasureForm (props: RouteAndMeasureFormProps) {
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const { network, reset, clearPickedGraphic, eventLayer, eventFeatures, intl, resetForDataAction } = props
  const [measureInput, setMeasureInput] = React.useState<string>(getI18nMessage('chooseEventsFromMap'))
  const [toMeasureInput, setToMeasureInput] = React.useState<string>(getI18nMessage('chooseEventsFromMap'))

  React.useEffect(() => {
    if (isDefined(eventLayer)) {
      setMeasureInput(getI18nMessage('chooseEventsFromMap'))
      setToMeasureInput(getI18nMessage('chooseEventsFromMap'))
      clearPickedGraphic()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventLayer])

  React.useEffect(() => {
    clearPickedGraphic()
    if (!isDefined(eventFeatures) || eventFeatures.length === 0) {
      setMeasureInput(getI18nMessage('chooseEventsFromMap'))
      setToMeasureInput(getI18nMessage('chooseEventsFromMap'))
    } else {
      if (isDefined(network)) {
        const firstRouteId = eventFeatures[0].attributes[eventLayer.eventInfo.routeIdFieldName]
        const lastRouteId = eventFeatures[eventFeatures.length - 1].attributes[eventLayer.eventInfo.routeIdFieldName]
        let fromM = round(eventFeatures[0].attributes[eventLayer.eventInfo.fromMeasureFieldName], network.measurePrecision)
        const lastFromM = round(eventFeatures[eventFeatures.length - 1].attributes[eventLayer.eventInfo.fromMeasureFieldName], network.measurePrecision)
        if (firstRouteId === lastRouteId && lastFromM < fromM) {
          // Last event has smaller From measure than the first event
          fromM = lastFromM
        }

        const firstToRouteId = eventFeatures[0].attributes[eventLayer.eventInfo.toRouteIdFieldName]
        const lastToRouteId = eventFeatures[eventFeatures.length - 1].attributes[eventLayer.eventInfo.toRouteIdFieldName]
        const firstToM = round(eventFeatures[0].attributes[eventLayer.eventInfo.toMeasureFieldName], network.measurePrecision)
        let toM = round(eventFeatures[eventFeatures.length - 1].attributes[eventLayer.eventInfo.toMeasureFieldName], network.measurePrecision)
        if (firstToRouteId === lastToRouteId && firstToM > toM) {
          // First event has greater To measure than the last event
          toM = firstToM
        }
        setMeasureInput(fromM.toString())
        setToMeasureInput(toM.toString())
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventFeatures])

  React.useEffect(() => {
    if (reset && !resetForDataAction) {
      setMeasureInput(getI18nMessage('chooseEventsFromMap'))
      setToMeasureInput(getI18nMessage('chooseEventsFromMap'))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset])

  return (
    <div className='route-and-measure-form d-flex w-100 pt-1 px-3'>
      {network && (
        <div className='w-100'>
          <Label size="sm" className='w-100 mb-0 pt-3' style={{ width: 100, alignItems: 'center', fontWeight: 500 }} >
            {getI18nMessage('fromMeasureWithUnits', { units: GetUnits(network.unitsOfMeasure, intl) })}
          </Label>
          <div className='d-flex w-100'>
            <Label size="sm" className='w-100 mb-0' style={{ width: 100, alignItems: 'center' }} >
              {measureInput}
            </Label>
          </div>
          <Label size="sm" className='w-100 mb-0 pt-3' style={{ width: 100, alignItems: 'center', fontWeight: 500 }} >
            {getI18nMessage('toMeasureWithUnits', { units: GetUnits(network.unitsOfMeasure, intl) })}
          </Label>
          <div className='d-flex w-100'>
            <Label size="sm" className='w-100 mb-0' style={{ width: 100, alignItems: 'center' }} >
              {toMeasureInput}
            </Label>
          </div>
        </div>
      )}
    </div>
  )
}
