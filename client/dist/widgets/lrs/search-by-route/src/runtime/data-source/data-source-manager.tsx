/** @jsx jsx */
import {
  React,
  jsx,
  type ImmutableObject,
  type DataSource,
  Immutable,
  type UseDataSource,
  DataSourceComponent,
  DataSourceStatus,
  type IMDataSourceInfo
} from 'jimu-core'
import { type NetworkItem } from '../../config'

export interface DataSourceManagerProps {
  networkItem: ImmutableObject<NetworkItem>
  dataSourceReady: (boolean) => void
  onCreateDs: (DataSource) => void
  onCreatePointDs: (DataSource) => void
  onCreateLineDs: (DataSource) => void
}

export function DataSourceManager (props: DataSourceManagerProps) {
  const { networkItem, dataSourceReady, onCreateDs, onCreatePointDs, onCreateLineDs } = props
  const [selectedNetwork, setSelectedNetwork] = React.useState<ImmutableObject<NetworkItem>>(networkItem ?? null)

  React.useEffect(() => {
    if (networkItem) {
      setSelectedNetwork(networkItem)
    }
  }, [networkItem])

  const useLineOutputDs: ImmutableObject<UseDataSource> = React.useMemo(
    () =>
      Immutable({
        dataSourceId: selectedNetwork.outputLineDsId,
        mainDataSourceId: selectedNetwork.outputLineDsId
      }),
    [selectedNetwork.outputLineDsId]
  )

  const usePointOutputDs: ImmutableObject<UseDataSource> = React.useMemo(
    () =>
      Immutable({
        dataSourceId: selectedNetwork.outputPointDsId,
        mainDataSourceId: selectedNetwork.outputPointDsId
      }),
    [selectedNetwork.outputPointDsId]
  )

  const handleDsCreated = React.useCallback((ds: DataSource) => {
    onCreateDs(ds)
  }, [onCreateDs])

  const handleDsInfoChange = React.useCallback((info: IMDataSourceInfo) => {
    if (info) {
      const { status, instanceStatus } = info
      if (instanceStatus === DataSourceStatus.NotCreated ||
          instanceStatus === DataSourceStatus.CreateError ||
          status === DataSourceStatus.LoadError ||
          status === DataSourceStatus.NotReady) {
        dataSourceReady(false)
      } else {
        dataSourceReady(true)
      }
    }
  }, [dataSourceReady])

  const handleDsCreateFailed = React.useCallback(() => {
    dataSourceReady(false)
  }, [dataSourceReady])

  const handleLineOutputDataSourceCreated = (ds: DataSource) => {
    onCreateLineDs(ds)
  }

  const handlePointOutputDataSourceCreated = (ds: DataSource) => {
    onCreatePointDs(ds)
  }

  return (
    <div>
      <DataSourceComponent
        useDataSource={useLineOutputDs}
        onDataSourceCreated={handleLineOutputDataSourceCreated} />
      <DataSourceComponent
        useDataSource={usePointOutputDs}
        onDataSourceCreated={handlePointOutputDataSourceCreated} />
      <DataSourceComponent
        useDataSource={selectedNetwork.useDataSource}
        onDataSourceInfoChange={handleDsInfoChange}
        onCreateDataSourceFailed={handleDsCreateFailed}
        onDataSourceCreated={handleDsCreated} />
    </div>
  )
}
