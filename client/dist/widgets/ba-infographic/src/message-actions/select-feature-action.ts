import {
  AbstractMessageAction, MessageType, type Message,
  type DataRecordsSelectionChangeMessage,
  MutableStoreManager,
  type MessageDescription,
  type FeatureDataRecord as FeatureQueryDataRecord,
  dataSourceUtils,
  loadArcGISJSAPIModule
} from 'jimu-core'

import { type FeatureDataRecord as FeatureLayerDataRecord } from 'jimu-arcgis'

export default class selectFeatureAction extends AbstractMessageAction {
  filterMessageDescription (messageDescription: MessageDescription): boolean {
    return messageDescription.messageType === MessageType.DataRecordsSelectionChange
  }

  filterMessage (message: Message): boolean {
    return true
  }

  getLayerDisplayField = (dataSource) => {
    const displayField =
      dataSource?.layer?.displayField ||
      dataSource?.layerDefinition?.displayField ||
      dataSource?.belongToDataSource?.layerDefinition?.displayField ||
      dataSource?.layer?.objectIdField ||
      dataSource?.layerDefinition?.objectIdField ||
      dataSource?.belongToDataSource?.layerDefinition?.objectIdField ||
      'OBJECTID'
    return displayField
  }

  onExecute (message: Message): Promise<boolean> | boolean {
    switch (message.type) {
      case MessageType.DataRecordsSelectionChange:
        const dataRecordsSelectionChangeMessage = message as DataRecordsSelectionChangeMessage
        const record = dataRecordsSelectionChangeMessage.records && dataRecordsSelectionChangeMessage.records[0]
        if (record) {
          const feature = ((record as (FeatureQueryDataRecord | FeatureLayerDataRecord)).feature as __esri.Graphic)

          dataSourceUtils.changeToJSAPIGraphic(feature).then((graphic) => {
            loadArcGISJSAPIModule('esri/symbols/support/symbolUtils').then((symbolUtils) => {
              symbolUtils.getDisplayedSymbol(graphic).then((symbol) => {
                if (graphic && graphic.geometry?.type === 'polygon') {
                  const geometry = graphic.geometry as __esri.geometry.Polygon

                  const selectedFeature = {
                    type: 'polygon',
                    rings: geometry.rings,
                    spatial: geometry.spatialReference,
                    attributes: graphic.attributes ? graphic.attributes : {},
                    displayName: graphic.attributes[this.getLayerDisplayField(graphic)],
                    symbol: symbol.toJSON()
                  }

                  MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'workflowRuntimeSelectedFeatureObject', selectedFeature)
                } else if (graphic && graphic.geometry?.type === 'point') {
                  const geometry = graphic.geometry as __esri.geometry.Point

                  if ((geometry.latitude !== null && geometry.latitude !== null) || (geometry.x !== null && geometry.y !== null)) {
                    const selectedFeature = {
                      latitude: geometry.latitude,
                      longitude: geometry.longitude,
                      geometry,
                      type: 'point',
                      spatial: geometry.spatialReference,
                      attributes: graphic.attributes ? graphic.attributes : {},
                      displayName: graphic.attributes[this.getLayerDisplayField(graphic)].toString()
                    }

                    MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'workflowRuntimeSelectedFeatureObject', selectedFeature)
                  }
                }
              })
            })
          })
        }
        break
    }

    return Promise.resolve(true)
  }
}
