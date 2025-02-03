import { React, Immutable, type ImmutableObject, ReactRedux, type IMState, type UseDataSource, DataSourceManager, type ImmutableArray } from 'jimu-core'
import { AllDataSourceTypes, DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'

interface SelectDataProps {
  widgetId: string
  useDataSources: ImmutableArray<UseDataSource>
  onChange: (useDataSources: UseDataSource[]) => void
}

const dsTypes = Immutable([
  AllDataSourceTypes.FeatureLayer,
  AllDataSourceTypes.SceneLayer,
  AllDataSourceTypes.BuildingComponentSubLayer,
  AllDataSourceTypes.ImageryLayer,
  AllDataSourceTypes.OrientedImageryLayer,
  AllDataSourceTypes.SubtypeGroupLayer,
  AllDataSourceTypes.SubtypeSublayer
])

export default function SelectData (props: SelectDataProps) {
  const { widgetId, useDataSources = Immutable([]), onChange } = props

  const allUseDataSources = ReactRedux.useSelector((state: IMState) => {
    const appConfig = state.appStateInBuilder?.appConfig
    const widgetJson = appConfig?.widgets?.[widgetId]
    if (widgetJson?.useDataSources?.length > 0) {
      return widgetJson.useDataSources
    }
    if (widgetJson?.useMapWidgetIds?.length > 0) {
      const mapWidgetId = widgetJson.useMapWidgetIds[0]
      const mapWidgetJson = appConfig?.widgets?.[mapWidgetId]
      if (mapWidgetJson?.useDataSources?.length > 0) {
        return mapWidgetJson.useDataSources
      }
    }
    return null
  })

  let fromRootDsIds = Immutable([])
  let fromDsIds = Immutable([])
  const dsM = DataSourceManager.getInstance()
  allUseDataSources?.forEach((useDS: ImmutableObject<UseDataSource>) => {
    const ds = dsM.getDataSource(useDS.dataSourceId)
    if (!ds) return
    if (ds.type === AllDataSourceTypes.WebMap || ds.type === AllDataSourceTypes.WebScene) {
      fromRootDsIds = fromRootDsIds.concat([useDS.dataSourceId])
    } else {
      fromDsIds = fromDsIds.concat([ds.isDataView ? ds.getMainDataSource().id : ds.id])
    }
  })
  if (fromRootDsIds.length === 0) {
    fromRootDsIds = undefined
  } else {
    fromDsIds = undefined
  }

  React.useEffect(() => {
    const allUseDsIds = allUseDataSources?.length > 0 ? allUseDataSources.map(useDs => useDs.mainDataSourceId) : []
    const useDss = useDataSources.filter(useDs =>
      allUseDsIds.includes(useDs.dataSourceId) ||
      allUseDsIds.includes(useDs.mainDataSourceId) ||
      allUseDsIds.includes(useDs.rootDataSourceId)
    )
    // after widget remove some data sources, config.useDataSources should also remove these data sources
    if (useDss.length < useDataSources.length) {
      onChange(useDss.asMutable({ deep: true }))
    }
  }, [allUseDataSources, onChange, useDataSources])

  return <DataSourceSelector
    types={dsTypes}
    useDataSources={useDataSources}
    fromRootDsIds={fromRootDsIds}
    fromDsIds={fromDsIds}
    mustUseDataSource
    isMultiple
    isMultipleDataView
    hideAddDataButton
    hideDataView
    hideTypeDropdown
    enableToSelectOutputDsFromSelf
    onChange={onChange}
  />
}
