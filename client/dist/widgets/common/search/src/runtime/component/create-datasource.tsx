/** @jsx jsx */
import { jsx, React, DataSourceComponent, Immutable, type ImmutableArray, type DataSourceStatus } from 'jimu-core'
import { type IMConfig, type IMServiceList, type IMServiceListItem, SearchServiceType, SourceType, type IMDatasourceCreatedStatus } from '../../config'
import { getLocalId, getDatasource } from '../utils/utils'
import { getQueryByServiceListItem, loadDsRecords } from '../utils/search-service'
import { loadGeocodeOutputRecords } from '../utils/locator-service'
const { useEffect, useState } = React
interface CreateDatasourceProps {
  id: string
  config: IMConfig
  serviceList: IMServiceList
  dsStatus: IMDatasourceCreatedStatus
  synchronizeSettings: boolean
  handleSearchResultChange: (configId: string, newRecords: string[]) => void
  handleSelectionListChange: (selection: ImmutableArray<string>, configId: string) => void
  handleDsStatusChange: (dsStatus: IMDatasourceCreatedStatus) => void
}

const CreateDatasource = (props: CreateDatasourceProps) => {
  const { config, id, serviceList, dsStatus, synchronizeSettings, handleSearchResultChange, handleSelectionListChange, handleDsStatusChange } = props

  const [hadInputSearchText, setHadInputSearchText] = useState(false)

  useEffect(() => {
    Object.keys(serviceList || {}).forEach(configId => {
      if (serviceList[configId]?.searchText) {
        setHadInputSearchText(true)
      }
    })
  }, [serviceList])

  const renderDatasourceComponent = (serviceListItem: IMServiceListItem, configId: string, hadInputSearchText: boolean) => {
    if (serviceListItem.searchServiceType === SearchServiceType.GeocodeService) {
      const outputDataSourceId = serviceListItem?.outputDataSourceId
      const outputDatasource = {
        dataSourceId: outputDataSourceId,
        mainDataSourceId: outputDataSourceId
      }
      const defaultQuery = {
        //`Data filtering changes` use where === '1=1' to determine whether there is a filter, so we need to change where to '2=2' to make `Data filtering changes` execute correctly.
        //After the execution of `Data filtering changes`, the final map extent is the extent collection of all records in output ds
        where: '2=2',
        sqlExpression: null,
        pageSize: config.resultMaxNumber,
        outFields: ['*'],
        page: 1,
        returnGeometry: true
      }
      if ((synchronizeSettings as any) !== false && config?.sourceType === SourceType.MapCentric) {
        const dataSource = getDatasource(outputDataSourceId)
        return (<div key={`${configId}_con`}>
          {outputDataSourceId && <DataSourceComponent
            dataSource={dataSource}
            query={defaultQuery}
            key={`${configId}_outputDataSource`}
            onDataSourceInfoChange={info => { handleRecordChange(serviceListItem, configId) }}
            onDataSourceStatusChange={status => { handleRecordChange(serviceListItem, configId, status) }}
            onSelectionChange={selection => { onSelectionChange(selection, configId) }}
            widgetId={id}
          />}
        </div>)
      } else {
        return (<div key={`${configId}_con`}>
          {outputDataSourceId && <DataSourceComponent
            useDataSource={Immutable(outputDatasource)}
            query={defaultQuery}
            key={`${configId}_outputDataSource`}
            onDataSourceInfoChange={info => { handleRecordChange(serviceListItem, configId) }}
            onDataSourceStatusChange={status => { handleRecordChange(serviceListItem, configId, status) }}
            onSelectionChange={selection => { onSelectionChange(selection, configId) }}
            widgetId={id}
          />}
        </div>)
      }
    }

    if (serviceListItem.searchServiceType === SearchServiceType.FeatureService) {
      const useDataSource = serviceListItem?.useDataSource
      const query = getQueryByServiceListItem(serviceListItem?.asMutable({ deep: true }))
      const localId = getLocalId(configId, id)
      return (<div key={`${configId}_con`}>
        {useDataSource && <DataSourceComponent
          useDataSource={Immutable(useDataSource)}
          query={hadInputSearchText ? query : null}
          key={`${configId}_useDataSource`}
          onDataSourceInfoChange={info => { handleRecordChange(serviceListItem, configId) }}
          onSelectionChange={selection => { onSelectionChange(selection, configId) }}
          //For localDs, we need to set `listenSelection` to `true` to listen to the selection changes of main datasource
          onDataSourceCreated={ds => { ds.setListenSelection(true) }}
          onDataSourceStatusChange={status => { handleDsStatusChange(Immutable(dsStatus.set(configId, status))) }}
          localId={localId}
        />}
      </div>)
    }
  }

  const createDsByServiceList = (serviceList: IMServiceList, hadInputSearchText: boolean) => {
    const dataSourceComponents = []
    for (const configId in serviceList) {
      dataSourceComponents.push(renderDatasourceComponent(serviceList[configId], configId, hadInputSearchText))
    }
    return dataSourceComponents
  }

  const onSelectionChange = (selection: ImmutableArray<string>, configId: string) => {
    handleSelectionListChange(selection, configId)
  }

  const handleRecordChange = (serviceListItem: IMServiceListItem, configId: string, status?: DataSourceStatus) => {
    const { searchServiceType } = serviceListItem
    switch (searchServiceType) {
      case SearchServiceType.GeocodeService:
        loadGeocodeOutputRecords(serviceListItem?.asMutable({ deep: true }), config.resultMaxNumber, id).then(res => {
          const { records } = res
          const recordId = records?.map(record => record.getId())
          handleSearchResultChange(configId, recordId)
        })
        break
      case SearchServiceType.FeatureService:
        loadDsRecords(serviceListItem?.asMutable({ deep: true }), config.resultMaxNumber, id).then(res => {
          const { records } = res
          const recordId = records?.map(record => record.getId())
          handleSearchResultChange(configId, recordId)
        })
        break
    }

    if (status) {
      handleDsStatusChange(Immutable(dsStatus.set(configId, status)))
    }
  }

  return (
    <div>
      {
        createDsByServiceList(serviceList, hadInputSearchText)
      }
    </div>
  )
}

export default CreateDatasource
