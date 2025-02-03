/** @jsx jsx */
import {
  React,
  jsx,
  DataSourceComponent,
  DataSourceStatus,
  type IMDataSourceInfo,
  type ImmutableArray,
  Immutable,
  type ImmutableObject,
  type UseDataSource,
  type DataSource
} from 'jimu-core'
import { type LrsLayer, type NetworkInfo } from '../../config'
import { isDefined } from 'widgets/shared-code/lrs'

export interface DataSourceManagerProps {
  lrsLayers?: ImmutableArray<LrsLayer>
  selectedNetwork?: NetworkInfo
  dataSourcesReady: (boolean) => void
  onCreatePointDs: (DataSource) => void
  handleSetDataSources: (DataSource) => void
}

const temp = []

export function DataSourceManager (props: DataSourceManagerProps) {
  const { lrsLayers, selectedNetwork, dataSourcesReady, onCreatePointDs, handleSetDataSources } = props
  const [lrsEvents, setLrsEvents] = React.useState<ImmutableArray<LrsLayer>>(lrsLayers ?? null)
  const [eventDsReady, setEventDsReady] = React.useState<boolean[]>([])
  const [dataSources, setDatasources] = React.useState<any>()

  React.useEffect(() => {
    if (lrsLayers) {
      setLrsEvents(lrsLayers)
      const setDsReadyFalse: boolean[] = Array(lrsLayers.length).fill(false)
      setEventDsReady(setDsReadyFalse)
    }
  }, [lrsLayers])

  const updateDsReady = React.useCallback((index: number, value: boolean) => {
    const updatedDsReady = eventDsReady
    updatedDsReady[index] = value
    setEventDsReady(updatedDsReady)
    if (updatedDsReady.every(value => value)) {
      dataSourcesReady(true)
    }
  }, [dataSourcesReady, eventDsReady])

  const handleEventDsCreated = React.useCallback((ds: any, index) => {
    temp.push(ds)
    setDatasources(temp)
    if (lrsLayers?.length === temp.length) {
      handleSetDataSources(temp)
    }
    updateDsReady(index, true)
  }, [lrsLayers?.length, updateDsReady, dataSources, handleSetDataSources])

  const handleEventDsInfoChange = React.useCallback((info: IMDataSourceInfo, index) => {
    if (info) {
      const { status, instanceStatus } = info
      if (instanceStatus === DataSourceStatus.NotCreated ||
          instanceStatus === DataSourceStatus.CreateError ||
          status === DataSourceStatus.LoadError ||
          status === DataSourceStatus.NotReady) {
        updateDsReady(index, false)
      } else {
        updateDsReady(index, true)
      }
    }
  }, [updateDsReady])

  const handleEventDsCreateFailed = React.useCallback((index) => {
    updateDsReady(index, false)
  }, [updateDsReady])

  const handlePointOutputDataSourceCreated = (ds: DataSource) => {
    onCreatePointDs(ds)
  }

  const usePointOutputDs: ImmutableObject<UseDataSource> = React.useMemo(
    () =>
      Immutable({
        dataSourceId: selectedNetwork?.outputPointDsId,
        mainDataSourceId: selectedNetwork?.outputPointDsId
      }),
    [selectedNetwork?.outputPointDsId]
  )

  return (
    <div>
      {isDefined(lrsEvents) && (
        lrsEvents.map((event, index) => {
          const layerType = event?.layerType?.toLocaleLowerCase()
          return (
            <div>
              {layerType === 'network' && isDefined(usePointOutputDs) && (
                <DataSourceComponent
                  useDataSource={usePointOutputDs}
                  onDataSourceCreated={handlePointOutputDataSourceCreated} />
              )}
              <DataSourceComponent
                key={index}
                useDataSource={event.useDataSource}
                onDataSourceInfoChange={(e) => { handleEventDsInfoChange(e, index) }}
                onCreateDataSourceFailed={(e) => { handleEventDsCreateFailed(index) }}
                onDataSourceCreated={(e) => { handleEventDsCreated(e, index) }}
              />
            </div>
          )
        })
      )}
    </div>
  )
}
