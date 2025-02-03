import {
  type JimuMapView,
  type JimuLayerView
} from 'jimu-arcgis'
import {
  ClauseLogic,
  ClauseOperator,
  dataSourceUtils,
  type QueriableDataSource,
  type QueryParams
} from 'jimu-core'

export default class DsFilter {
  ffLevelHandle: any
  filterToActiveLevel: boolean = false
  jimuMapView: JimuMapView
  widgetId: string

  clear (): void {
    try {
      if (this.ffLevelHandle) this.ffLevelHandle.remove()
    } catch (ex) {
      console.error(ex)
    } finally {
      this.ffLevelHandle = null
    }
    if (this.jimuMapView && this.filterToActiveLevel) {
      this.updateDataSources(this.jimuMapView, this.widgetId, null)
    }
  }

  init (jimuMapView: JimuMapView, foorFilterWidget, coreFloorFilterWidget): void {
    this.clear()
    this.jimuMapView = jimuMapView
    const widgetId = this.widgetId = foorFilterWidget?.props?.id

    // foorFilterWidget?.props?.config?.filterDataSources is for v24.R1+
    const filterToActiveLevel = this.filterToActiveLevel = !!(foorFilterWidget?.props?.config?.filterDataSources)
    // for v1.10
    // const filterToActiveLevel = this.filterToActiveLevel = true

    if (jimuMapView && coreFloorFilterWidget && filterToActiveLevel) {
      this.ffLevelHandle = coreFloorFilterWidget.watch('level', (levelId) => {
        this.updateDataSources(jimuMapView, widgetId, levelId)
      })

      // whenAllJimuLayerViewLoaded is for v1.12+
      jimuMapView.whenAllJimuLayerViewLoaded().then(() => {
        if (jimuMapView === this.jimuMapView) {
          const levelId = coreFloorFilterWidget.level
          this.updateDataSources(jimuMapView, widgetId, levelId)
        }
      })
    }
  }

  private updateDataSources (jimuMapView: JimuMapView, widgetId: string, levelId: string): void {
    if ((typeof levelId === 'string') && levelId.startsWith('all--')) {
      // @todo filter for all levels in the active facility?
      levelId = null
    }

    // @ts-expect-error
    const levelLayerInfo = jimuMapView?.view?.map?.floorInfo?.levelLayer
    let levelLayer, levelSubLayer
    if (levelLayerInfo && levelLayerInfo.layerId) {
      levelLayer = jimuMapView?.view?.map?.findLayerById(levelLayerInfo.layerId)
      if (levelLayer && (typeof levelLayerInfo.sublayerId === 'number')) {
        levelSubLayer = levelLayer.findSublayerById(levelLayerInfo.sublayerId)
      }
    }

    const findFloorField = (fields, name): string => {
      let floorField: string = name
      if (name && fields && (fields.length > 0)) {
        const lc = name.toLowerCase()
        fields.some(field => {
          if (lc === field.name.toLowerCase()) {
            floorField = field.name
            return true
          }
          return false
        })
      }
      return floorField
    }

    const isLevelLayer = (jimuLayerView: JimuLayerView) => {
      const lvLayer = jimuLayerView?.layer
      if (levelLayerInfo && levelLayerInfo.layerId) {
        if (typeof levelLayerInfo.sublayerId === 'number') {
          if (levelSubLayer && levelSubLayer === lvLayer) return true
        } else {
          if (levelLayer && levelLayer === lvLayer) return true
        }
      }
      return false
    }

    const makeQueryParams = (floorField: string, dataSource): QueryParams => {
      let queryParams: QueryParams = null
      if (levelId) {
        const clause = dataSourceUtils.createSQLClause(floorField, ClauseOperator.StringOperatorIs, [{ value: levelId, label: levelId + '' }])

        // for v1.12+
        const sqlExpression = dataSourceUtils.createSQLExpression(ClauseLogic.Or, [clause], dataSource)
        queryParams = { where: sqlExpression.sql, sqlExpression } as QueryParams
        // for v1.10
        // const sqlExpression = dataSourceUtils.createSQLExpression(ClauseLogic.Or, [clause])
        // const arcgisSql = dataSourceUtils.getArcGISSQL(sqlExpression, dataSource)
        // queryParams = {where: arcgisSql.sql} as QueryParams
      } else {
        queryParams = { where: '1=1', sqlExpression: null } as QueryParams
      }
      return queryParams
    }

    const processLayerView = async (jimuLayerView: JimuLayerView): Promise<void> => {
      const dataSource = jimuLayerView?.getLayerDataSource()
      if (dataSource && !isLevelLayer(jimuLayerView)) {
        // @ts-expect-error
        const dsLayer = dataSource?.layer
        const lvLayer = jimuLayerView?.layer
        if (lvLayer?.floorInfo?.floorField && (typeof lvLayer.when === 'function') && (lvLayer.loadStatus === 'loading')) {
          await lvLayer.when()
        }
        let floorField = dsLayer?.floorInfo?.floorField || lvLayer?.floorInfo?.floorField
        if (floorField && dsLayer && (dsLayer.type === 'feature' || dsLayer.type === 'scene')) {
          floorField = findFloorField(dsLayer.fields, floorField)
          const qDataSource = (dataSource as QueriableDataSource)
          const queryParams = makeQueryParams(floorField, qDataSource)
          if (queryParams) {
            qDataSource.updateQueryParams(queryParams, widgetId)
          }
        }
      }
    }

    if (jimuMapView && jimuMapView.jimuLayerViews) {
      Object.keys(jimuMapView.jimuLayerViews).forEach(k => {
        processLayerView(jimuMapView.jimuLayerViews[k])
      })
    }
  }
}
