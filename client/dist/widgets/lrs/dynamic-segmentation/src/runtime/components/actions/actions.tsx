/** @jsx jsx */
import { type ImmutableArray, React, jsx, type DataSource, type ImmutableObject, type IntlShape } from 'jimu-core'
import { CalciteActionBar, CalciteActionGroup } from 'calcite-components'
import { useDynSegRuntimeState } from '../../state'
import { type JimuMapView } from 'jimu-arcgis'
import { getGeometryGraphic, isDefined, type LrsLayer, type NetworkInfo } from 'widgets/shared-code/lrs'
import { Save } from './save'
import { DisplayType, type MessageProp } from '../../../config'
import { Display } from './display'
import { Zoom } from './zoom'
import { Export } from './export'
import { FieldCalculator } from './fieldCalculator'
import { DiscardEdits } from './discardEdits'
import { HideFields } from './hideFields'
import { DynSegFields } from '../../../constants'

export interface ActionsProps {
  widgetId: string
  highlightLayer: __esri.GraphicsLayer
  highlightColor: string
  lrsLayers: ImmutableArray<LrsLayer>
  networkDS: DataSource
  networkInfo: ImmutableObject<NetworkInfo>
  jimuMapView: JimuMapView
  dynSegFeatureLayer: __esri.FeatureLayer
  onSave: (message: MessageProp) => void
  handleFieldCalculator
  attributeSet
  intl: IntlShape
  allowMerge: boolean
  routeId: string
}

export function Actions (props: ActionsProps) {
  const { intl, routeId, allowMerge, widgetId, jimuMapView, highlightLayer, highlightColor, lrsLayers, networkDS, networkInfo, dynSegFeatureLayer, onSave, handleFieldCalculator, attributeSet } = props
  const { records, selectedRecordIds, selectedSldId, display } = useDynSegRuntimeState()

  React.useEffect(() => {
    async function getGraphic (selectedRecordIds: number[]) {
      if (isDefined(highlightLayer)) {
        highlightLayer.removeAll()
        if (isDefined(records) && isDefined(selectedRecordIds)) {
          selectedRecordIds.forEach(async (id) => {
            const record = records.find((r) => r.getObjectId() === id)
            if (isDefined(record)) {
              const pointGraphic = record.attributes[DynSegFields.typeName] === 'Point'
              const graphic = await getGeometryGraphic(record, highlightColor, 4, !pointGraphic)
              highlightLayer.add(graphic)
            }
          })
        }
      }
    }

    getGraphic(selectedRecordIds)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecordIds])

  React.useEffect(() => {
    if (selectedSldId === '' && isDefined(highlightLayer)) {
      highlightLayer.removeAll()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSldId])

  return (
      <CalciteActionBar
        slot='header-actions-end'
        layout="horizontal"
        scale='m'
        className='header-actions'
        expandDisabled={true}>
        <Display/>
        <CalciteActionGroup scale='m'>
          <Save
            lrsLayers={lrsLayers}
            networkDS={networkDS}
            networkInfo={networkInfo}
            onSave={onSave}
            allowMerge={allowMerge}
          />
          { display === DisplayType.Table &&
            <DiscardEdits
              dynSegFeatureLayer={dynSegFeatureLayer}
            />
          }
          { display === DisplayType.Table &&
            <Zoom
              jimuMapView={jimuMapView}
              networkDS={networkDS}
            />
          }
          { display === DisplayType.Table && <HideFields /> }
          { display === DisplayType.Table &&
            <FieldCalculator
              intl={intl}
              attributeSet={attributeSet}
              lrsLayers={lrsLayers}
              dynSegFeatureLayer={dynSegFeatureLayer}
              handleFieldCalculator={handleFieldCalculator}
            />
          }
          { display === DisplayType.Table &&
            <Export
              dynSegFeatureLayer={dynSegFeatureLayer}
              widgetId={widgetId}
              routeId={routeId}
              jimuMapView={jimuMapView}
            />
          }
        </CalciteActionGroup>
      </CalciteActionBar>
  )
}
