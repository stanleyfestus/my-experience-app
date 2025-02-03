/** @jsx jsx */
import {
  React,
  ReactRedux,
  jsx,
  css,
  type DataSource,
  type FeatureDataRecord,
  MessageManager,
  DataRecordsSelectionChangeMessage,
  type IMState,
  classNames,
  type DataRecord,
  type IntlShape,
  type ImmutableObject
} from 'jimu-core'
import { type FeatureLayerDataSource, geometryUtils, type JimuMapView } from 'jimu-arcgis'
import { type IMConfig, type NetworkItem, type Style } from '../../config'
import ItemFeatureInfo from './item-feature-info'
import type GraphicsLayer from 'esri/layers/GraphicsLayer'
import Graphic from 'esri/Graphic'
import { getGeometryGraphic, isDefined } from 'widgets/shared-code/lrs'
import { getOriginalNetworkRecords } from '../utils/service-utils'
import { getPopupTemplate } from '../utils/utils'

export interface ResultItemProps {
  config: IMConfig
  widgetId: string
  autoSelect?: boolean
  network: ImmutableObject<NetworkItem>
  data: FeatureDataRecord
  outputDS: DataSource
  inputDS: DataSource
  jimuMapView?: JimuMapView
  highlightGraphicLayer: GraphicsLayer
  flashGraphicsLayer: GraphicsLayer
  highlightStyle: Style
  intl: IntlShape
  selectedMethod: string
  measureType?: string
}

const style = css`
  overflow: auto;
  flex-flow: row;
  cursor: pointer;
  flex-shrink: 0;
  min-height: 2rem;
  &.selected {
    .item-feature-info-component {
      border-color: var(--sys-color-primary-main);
      border-width: 2px;
    }
  }
`

export const SearchByRouteResultItem = (props: ResultItemProps) => {
  const { config, measureType, widgetId, autoSelect, network, data, outputDS, inputDS, highlightGraphicLayer, flashGraphicsLayer, highlightStyle, jimuMapView, intl, selectedMethod } = props
  const selected = ReactRedux.useSelector((state: IMState) =>
    state.dataSourcesInfo?.[outputDS.id]?.selectedIds?.includes(data.getId())
  )

  const getIndividualPopupTemplate = () => {
    return getPopupTemplate(intl, data.feature as __esri.Graphic, outputDS as FeatureLayerDataSource, network, selectedMethod, measureType, config)
  }

  React.useEffect(() => {
    if (autoSelect) {
      handleClickResultItem()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSelect])

  // Flash selected feature on the map and go to it.
  const flashOnMap = React.useCallback((record: DataRecord) => {
    const featureRecord = record as any
    getGeometryGraphic(featureRecord?.getFeature(), '#FFFF00', highlightStyle.size, true)
      .then((flashGraphics) => {
        if (flashGraphicsLayer && flashGraphics) {
          flashGraphicsLayer.removeAll()
          flashGraphicsLayer.add(flashGraphics)

          setTimeout(() => {
            flashGraphicsLayer.removeAll()
            setTimeout(() => {
              flashGraphicsLayer.add(flashGraphics)
              setTimeout(() => {
                flashGraphicsLayer.removeAll()
              }, 800)
            }, 800)
          }, 800)
        }
      })
  }, [flashGraphicsLayer, highlightStyle.size])

  const zoomTo = React.useCallback((graphic: __esri.Graphic) => {
    geometryUtils.projectToSpatialReference([graphic.geometry], jimuMapView.view.spatialReference)
      .then((geometryInSR) => {
        const graphicInSR = new Graphic({
          geometry: geometryInSR[0],
          symbol: graphic.symbol
        })
        if (graphicInSR.geometry.type === 'point') {
          jimuMapView?.view.goTo({
            target: geometryInSR, zoom: 100
          })
        } else {
          jimuMapView?.view.goTo({ center: graphicInSR.geometry.extent.expand(1.25) })
        }
      })
  }, [jimuMapView.view])

  // Highlight the selected feature on the map and perform flash.
  const highlightGeometry = React.useCallback((record: DataRecord) => {
    getOriginalNetworkRecords(record, inputDS as FeatureLayerDataSource, network, jimuMapView)
      .then((originalNetworkRecords) => {
        if (isDefined(originalNetworkRecords)) {
          flashOnMap(originalNetworkRecords)
        }
        const featureRecord = record as any
        getGeometryGraphic(featureRecord?.getFeature(), highlightStyle.color, highlightStyle.size, true)
          .then((highlightGraphics) => {
            if (highlightGraphicLayer && highlightGraphics) {
              highlightGraphicLayer.removeAll()
              highlightGraphicLayer.add(highlightGraphics)
              zoomTo(highlightGraphics)
            }
          })
      })
  }, [flashOnMap, highlightGraphicLayer, highlightStyle.color, highlightStyle.size, inputDS, jimuMapView, network, zoomTo])

  // Clears all highlights.
  const clearAllHighLights = React.useCallback(() => {
    if (highlightGraphicLayer) {
      highlightGraphicLayer.removeAll()
    }
  }, [highlightGraphicLayer])

  // Updates feature selection and updates highlights.
  const handleClickResultItem = React.useCallback(() => {
    const dataSourceId = outputDS.id
    const dataItemRecordId = data.getId()
    const nextSelectedDataItems = (outputDS.getSelectedRecordIds() ?? []).includes(dataItemRecordId) ? [] : [data]
    if (dataSourceId && nextSelectedDataItems?.length > 0) {
      MessageManager.getInstance().publishMessage(new DataRecordsSelectionChangeMessage(widgetId, nextSelectedDataItems, [dataSourceId]))
      outputDS.selectRecordsByIds?.(nextSelectedDataItems.map((item) => item.getId()))
      highlightGeometry(data)
    } else {
      clearAllHighLights()
    }
  }, [data, outputDS, widgetId, highlightGeometry, clearAllHighLights])

  return (
    <div
      className={classNames('search-by-route-result-item', { selected })}
      onClick={handleClickResultItem}
      css={style}
      role='option'
      aria-selected={selected}
      tabIndex={0}
    >
      <ItemFeatureInfo
        graphic={data.feature as __esri.Graphic}
        togglable={true}
        dataSource={outputDS}
        popupTemplate={getIndividualPopupTemplate()}
        expanded={network.expandByDefault}
        selectedMethod={selectedMethod}
        />
    </div>
  )
}
