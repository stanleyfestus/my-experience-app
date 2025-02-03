import { AbstractDataAction, type DataLevel, type DataRecordSet, MutableStoreManager, dataSourceUtils } from 'jimu-core'
import { type ReactElement, type JSXElementConstructor } from 'react'
import { isRecordValid } from './utils'

export default class DirectionsFrom extends AbstractDataAction {
  async isSupported (dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean> {
    return (await isRecordValid.bind(this)(dataSets, dataLevel)) && dataSets[0].records.length === 1
  }

  async onExecute (dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean | ReactElement<any, string | JSXElementConstructor<any>>> {
    const feature = await dataSourceUtils.changeToJSAPIGraphic((dataSets[0].records[0] as any)?.feature)
    const directionsFromPoint = feature.geometry
    MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'directionsFromPoint', directionsFromPoint)
    return true
  }
}
