/** @jsx jsx */
import {
  React,
  jsx,
  css,
  hooks,
  classNames,
  type DataRecord,
  type ImmutableObject,
  type DataSource,
  DataSourceStatus,
  MessageManager,
  DataRecordSetChangeMessage,
  RecordSetChangeType,
  loadArcGISJSAPIModules,
  type FeatureLayerDataSource,
  type QueriableDataSource,
  type IntlShape,
  Immutable
} from 'jimu-core'
import {
  SearchMethod,
  createLabelLayer,
  isDefined,
  removeLabelLayer
} from 'widgets/shared-code/lrs'
import { Alert, Button, FOCUSABLE_CONTAINER_CLASS, Label, Tooltip } from 'jimu-ui'
import { type NetworkItem, type RouteAndMeasureQuery, type IMConfig, SpatialReferenceFrom, type ReferentQuery, type CoordinateQuery } from '../../config'
import { SearchMethodForm } from './search-by-route-method-form'
import { SearchMeasureForm } from './search-by-route-measure-form'
import { SearchReferentForm } from './search-by-referent-form'
import { SearchCoordinatesForm } from './search-by-coordinates-form'
import { SearchTaskResult } from './search-by-route-results'
import { executeMeasureToGeometry, queryRoutes, executeReferentToGeometry, executeGeometryToMeasure, queryRoutesByGeometry, queryRoutesByGeometryWithTolerance, queryRoutesByClosestResults, executeGeometryToMeasureWithTolerance, executeMeasureToGeometryLine, getAliasRecord } from '../utils/service-utils'
import defaultMessages from '../translations/default'
import { type JimuMapView } from 'jimu-arcgis'
import { DataSourceManager } from '../data-source/data-source-manager'
import { useDataSourceExists } from '../data-source/use-data-source-exist'
import { createLabelExpression, getLabelFields } from '../utils/utils'
import { type AlertType } from 'jimu-ui/lib/components/alert/type'
import type GraphicsLayer from 'esri/layers/GraphicsLayer'
import geometryEngine from 'esri/geometry/geometryEngine'
import { SearchLineMeasureForm } from './search-by-line-measure-form'

export interface SearchByRouteTaskProps {
  widgetId: string
  jimuMapView: JimuMapView
  config: IMConfig
  intl: IntlShape
  hideTitle: boolean
  coordinateGraphic: GraphicsLayer
}

const getFormStyle = () => {
  return css`
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;

    &.wrapped .search-by-route-form {
      height: 100%;
    }
    .search-by-route-task__content {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      flex: 1 1 auto;
      overflow: auto;
    }
    .toast-container {
      position: absolute;
      background-color: rgba(255, 255, 255, 0.7);
      height: 100%;
    }
    .toast {
      position: relative;
      top: 4%;
    }
    .search-by-route-footer {
      display: flex;
      height: auto;
      padding: 12px;
    }
  `
}

export function SearchByRouteTask (props: SearchByRouteTaskProps) {
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const { widgetId, jimuMapView, config, intl, hideTitle, coordinateGraphic } = props
  const [selectedNetwork, setSelectedNetwork] = React.useState<ImmutableObject<NetworkItem>>(Immutable(config.networkItems?.find(item => !item?.referent)))
  const [selectedReferent, setSelectedReferent] = React.useState<ImmutableObject<NetworkItem>>(Immutable(config.networkItems?.find(item => item?.referent)) || null)
  const [selectedMethod, setSelectedMethod] = React.useState<SearchMethod>(SearchMethod.Measure)
  const [resultCount, setResultCount] = React.useState(0)
  const [section, setSection] = React.useState(0)
  const [outputLineDS, setLineOutputDS] = React.useState<DataSource>(null)
  const [outputPointDS, setPointOutputDS] = React.useState<DataSource>(null)
  const [isOutputPoint, setIsOutputPoint] = React.useState<boolean>(false)
  const [dataSource, setDataSource] = React.useState<DataSource>(null)
  const [isDsEnabled, setIsDsEnabled] = React.useState(false)
  const [isNoResults, setNoResults] = React.useState<boolean>(false)
  const [toastOpen, setToastOpen] = React.useState<boolean>(false)
  const [toastMsgType, setToastMsgType] = React.useState<AlertType>()
  const [toastMsg, setToastMsg] = React.useState<string>('')
  const [reset, setReset] = React.useState<boolean>(false)
  const [defaultReferent, setDefaultReferent] = React.useState(null)
  const [measureType, setMeasureType] = React.useState(null)
  const recordsRef = React.useRef<DataRecord[]>(null)
  const routeRecordsRef = React.useRef<DataRecord[]>(null)
  const dataStoreExists = useDataSourceExists({ widgetId: props.widgetId, useDataSourceId: selectedNetwork?.useDataSource?.dataSourceId })
  const labelFeatureId = 'search-by-route-layer-'
  const [isValidInput, setIsValidInput] = React.useState<boolean>(true)
  const measureRef = React.useRef(null)
  const referentRef = React.useRef(null)
  const coordinatesRef = React.useRef(null)
  const lineMeasureRef = React.useRef(null)

  React.useEffect(() => {
    if (config.networkItems?.length > 0) {
      const defaultReferentLayerId = config?.resultConfig?.defaultReferentLayer?.layerId
      const referentItem = config.networkItems.find((item) => item?.layerId === defaultReferentLayerId)
      setSelectedReferent(Immutable(referentItem))
      setDefaultReferent(Immutable(referentItem))
      for (let i = 0; i < config.networkItems.length; i++) {
        const item = config.networkItems[i]
        if (!item?.referent) {
          setSelectedNetwork(item)
          break
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (isNoResults) {
      setToastMsgType('error')
      setToastMsg(toastMsg)
      setToastOpen(true)
      setTimeout(() => {
        setToastOpen(false)
        setNoResults(false)
      }, 5000)
    }
  }, [isNoResults, getI18nMessage, toastMsg])

  React.useEffect(() => {
    for (let i = 0; i < config.networkItems.length; i++) {
      const item = config.networkItems.find((item) => item?.name === config.defaultNetwork)
      if (isDefined(item) && !item?.referent) {
        setSelectedNetwork(Immutable(item))
        if (item?.defaultMethod) setSelectedMethod(item.defaultMethod)
        break
      }
    }
  }, [config.defaultNetwork, config.networkItems])

  React.useEffect(() => {
    if (isDefined(config.resultConfig.defaultReferentLayer)) {
      const item = config.networkItems.find(prop => prop.name === config.resultConfig.defaultReferentLayer.name)
      if (isDefined(item)) {
        setSelectedReferent(Immutable(item))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.resultConfig.defaultReferentLayer])

  const handleDataSourceReady = (isReady: boolean) => {
    setIsDsEnabled(isReady)
  }

  const handleDataSourceCreated = (ds: DataSource) => {
    setDataSource(ds)
  }

  const handleLineDsCreated = (ds: DataSource) => {
    setLineOutputDS(ds)
  }

  const handlePointDsCreated = (ds: DataSource) => {
    setPointOutputDS(ds)
  }

  const handleMethodChanged = (selectedMethod: SearchMethod) => {
    setSelectedMethod(selectedMethod)
    clearGraphics()
  }

  const handleNetworkChanged = (selectedNetwork: ImmutableObject<NetworkItem>) => {
    setIsDsEnabled(false)
    setSelectedNetwork(selectedNetwork)
    clearGraphics()
  }

  const handleReferentChanged = (selectedReferent: any) => {
    setIsDsEnabled(false)
    setSelectedReferent(selectedReferent)
  }

  const clearGraphics = (): void => {
    if (isDefined(coordinateGraphic)) {
      coordinateGraphic.removeAll()
    }
  }

  const publishDataClearedMsg = React.useCallback(() => {
    if (outputLineDS && outputPointDS) {
      const id = isOutputPoint ? outputPointDS.id : outputLineDS.id
      const dataRecordSetChangeMessage = new DataRecordSetChangeMessage(widgetId, RecordSetChangeType.Remove, [id])
      MessageManager.getInstance().publishMessage(dataRecordSetChangeMessage)
    }
  }, [outputLineDS, outputPointDS, isOutputPoint, widgetId])

  const handleMeasureFormSubmit = React.useCallback(async (routeQuery: RouteAndMeasureQuery) => {
    let TimeExtent: typeof __esri.TimeExtent = null
    let Point: typeof __esri.Point = null
    const originDS = dataSource as FeatureLayerDataSource
    let featureDS: FeatureLayerDataSource

    // Get datasoure for point or line.
    if (routeQuery.isPoint) {
      setIsOutputPoint(true)
      featureDS = outputPointDS as FeatureLayerDataSource
    } else {
      setIsOutputPoint(false)
      featureDS = outputLineDS as FeatureLayerDataSource
    }

    // Create label layer
    let labelLayer: __esri.FeatureLayer
    if (config.labelStyle.size > 0) {
      // Get the fields from the original layer.
      const layer = originDS?.layer || (await originDS.createJSAPILayerByDataSource()) as __esri.FeatureLayer
      const fields = getLabelFields(layer.fields)
      const labelExpression = createLabelExpression(selectedNetwork, routeQuery.isPoint)
      labelLayer = await createLabelLayer(fields, jimuMapView, labelExpression, labelFeatureId, config.labelStyle.color, config.labelStyle.size)
    }

    // Clear previous data.
    publishDataClearedMsg()
    recordsRef.current = null

    // Perform query on route identifier.
    await loadArcGISJSAPIModules(['esri/TimeExtent', 'esri/geometry/Point']).then(modules => {
      [TimeExtent, Point] = modules
    }).then(async () => {
      queryRoutes(originDS, selectedNetwork, routeQuery, jimuMapView)
        .then((routeRecords) => {
          // Execute measure to geometry if measure was provided. If no measures were provided,
          // just the input records are returned as results.
          executeMeasureToGeometry(widgetId, featureDS, selectedNetwork, routeRecords, routeQuery, labelLayer, jimuMapView, config, TimeExtent, Point)
            .then((newRecords) => {
              if (newRecords?.length > 0) {
                newRecords.forEach((result) => {
                  const record = result.getData()
                  getAliasRecord(record, selectedNetwork)
                })
                featureDS.setRecords(newRecords)
                setResultCount(newRecords?.length)
                recordsRef.current = featureDS.getRecordsByPage(1, config.resultConfig.pageSize)
                setNoResults(false)
                setSection(1)
              } else {
                setNoResults(true)
                setToastMsg(routeQuery.isMeasureToGeometryOperation ? getI18nMessage('noResultsMeasure') : getI18nMessage('noResults'))
              }
            })
            .finally(() => {
            })
        })
    })
  }, [dataSource, selectedNetwork, jimuMapView, config, publishDataClearedMsg, outputPointDS, outputLineDS, widgetId, getI18nMessage])

  const handleLineMeasureFormSubmit = React.useCallback(async (routeQuery: RouteAndMeasureQuery) => {
    const originDS = dataSource as FeatureLayerDataSource
    let featureDS: FeatureLayerDataSource
    let TimeExtent: typeof __esri.TimeExtent = null
    let Point: typeof __esri.Point = null

    // Get datasoure for point or line.
    if (routeQuery.isPoint) {
      setIsOutputPoint(true)
      featureDS = outputPointDS as FeatureLayerDataSource
    } else {
      setIsOutputPoint(false)
      featureDS = outputLineDS as FeatureLayerDataSource
    }

    // Create label layer
    let labelLayer: __esri.FeatureLayer
    if (config.labelStyle.size > 0) {
      // Get the fields from the original layer.
      const layer = originDS?.layer || (await originDS.createJSAPILayerByDataSource()) as __esri.FeatureLayer
      const fields = getLabelFields(layer.fields)
      const labelExpression = createLabelExpression(selectedNetwork, routeQuery.isPoint)
      labelLayer = await createLabelLayer(fields, jimuMapView, labelExpression, labelFeatureId, config.labelStyle.color, config.labelStyle.size)
    }

    // Clear previous data.
    publishDataClearedMsg()
    recordsRef.current = null

    // Perform query on route identifier.
    await loadArcGISJSAPIModules(['esri/TimeExtent', 'esri/geometry/Point']).then(modules => {
      [TimeExtent, Point] = modules
    }).then(async () => {
      queryRoutes(originDS, selectedNetwork, routeQuery, jimuMapView)
        .then((routeRecords) => {
          // Execute measure to geometry if measure was provided. If no measures were provided,
          // just the input records are returned as results.
          executeMeasureToGeometryLine(widgetId, featureDS, selectedNetwork, routeRecords, routeQuery, labelLayer, jimuMapView, config, TimeExtent, Point)
            .then((newRecords) => {
              if (newRecords?.length > 0) {
                newRecords.forEach((result) => {
                  const record = result.getData()
                  getAliasRecord(record, selectedNetwork)
                })
                featureDS.setRecords(newRecords)
                setResultCount(newRecords?.length)
                recordsRef.current = featureDS.getRecordsByPage(1, config.resultConfig.pageSize)
                setNoResults(false)
                setSection(1)
              } else {
                setNoResults(true)
                setToastMsg(routeQuery.isMeasureToGeometryOperation ? getI18nMessage('noResultsMeasure') : getI18nMessage('noResults'))
              }
              setMeasureType(routeQuery.searchMeasureBy)
            })
            .finally(() => {
            })
        })
    })
  }, [dataSource, selectedNetwork, jimuMapView, config, publishDataClearedMsg, outputPointDS, outputLineDS, widgetId, getI18nMessage])

  const handleReferentFormSubmit = async (queryParams: ReferentQuery, objectIdFromDt: any[]) => {
    const originDS = dataSource as FeatureLayerDataSource
    const featureDS = outputPointDS as FeatureLayerDataSource
    const count = 1

    // Create label layer
    let labelLayer: __esri.FeatureLayer
    if (config.labelStyle.size > 0) {
      // Get the fields from the original layer.
      const layer = originDS?.layer || (await originDS.createJSAPILayerByDataSource()) as __esri.FeatureLayer
      const fields = getLabelFields(layer.fields)
      const labelExpression = createLabelExpression(selectedNetwork, true)
      labelLayer = await createLabelLayer(fields, jimuMapView, labelExpression, labelFeatureId, config.labelStyle.color, config.labelStyle.size)
    }

    setIsOutputPoint(true)
    // Clear previous data.
    publishDataClearedMsg()
    recordsRef.current = null

    await executeReferentToGeometry(widgetId, originDS, queryParams, selectedNetwork, selectedReferent,
      featureDS, count, objectIdFromDt, config, labelLayer, jimuMapView)
      .then((newRecords) => {
        if (newRecords?.length > 0) {
          newRecords.forEach((result) => {
            const record = result.getData()
            getAliasRecord(record, selectedNetwork)
          })
          featureDS.setSourceRecords(newRecords)
          featureDS.setRecords(newRecords)
          setResultCount(newRecords?.length)
          recordsRef.current = featureDS.getRecordsByPage(1, config.resultConfig.pageSize)
          setSection(1)
          setNoResults(false)
        } else {
          setNoResults(true)
          setToastMsg(getI18nMessage('noResultReferent'))
        }
      })
      .finally(() => {
      })
  }

  const handleCoordinatesFormSubmit = React.useCallback(async (query: CoordinateQuery) => {
    const originDS = dataSource as FeatureLayerDataSource

    // Get datasoure for point or line.
    setIsOutputPoint(true)
    const featureDS = outputPointDS as FeatureLayerDataSource

    // Create label layer
    let labelLayer: __esri.FeatureLayer
    if (config.labelStyle.size > 0) {
      // Get the fields from the original layer.
      const layer = originDS?.layer || (await originDS.createJSAPILayerByDataSource()) as __esri.FeatureLayer
      const fields = getLabelFields(layer.fields)
      const labelExpression = createLabelExpression(selectedNetwork, true)
      labelLayer = await createLabelLayer(fields, jimuMapView, labelExpression, labelFeatureId, config.labelStyle.color, config.labelStyle.size)
    }

    // Clear previous data.
    publishDataClearedMsg()
    recordsRef.current = null

    // Perform spatial query based on coordinates without tolerance.
    queryRoutesByGeometry(originDS, selectedNetwork, query)
      .then(async (routeRecords) => {
        if (routeRecords.length > 0) {
          // Find the measure and distance for the routes.
          executeGeometryToMeasure(widgetId, featureDS, selectedNetwork, routeRecords, query, labelLayer, config, jimuMapView)
            .then((newRecords) => {
              featureDS.setRecords(newRecords)
              setResultCount(newRecords?.length)
            })
            .finally(() => {
              recordsRef.current = featureDS.getRecordsByPage(1, config.resultConfig.pageSize)
              setSection(1)
            })
        } else {
          await queryRoutesByGeometryWithTolerance(originDS, selectedNetwork, query)
            .then(async (rteRecords) => {
              if (rteRecords.length > 0) {
                // Query with tolerance since cannot locate route at the exact coordinates.
                // Perform geometry to measure first so we don't hit the limit of Maximum Number of Records Returned by Server.
                let allResultLocations: any[] = []
                let allResultWkid
                await Promise.all(rteRecords.map(async (rteRecord) => {
                  await executeGeometryToMeasureWithTolerance(rteRecord, featureDS, selectedNetwork, query)
                    .then(({ resultLocations, resultWkid }) => {
                      allResultLocations = allResultLocations.concat(resultLocations)
                      allResultWkid = resultWkid
                    })
                }))

                let Point: typeof __esri.Point = null
                let SpatialReference: typeof __esri.SpatialReference = null
                loadArcGISJSAPIModules(['esri/geometry/Point', 'esri/geometry/SpatialReference']).then(modules => {
                  [Point, SpatialReference] = modules
                }).then(() => {
                  // Find the results that are closest to the input coordinates.
                  let closestDistance = -1
                  const point = new Point()
                  point.x = query.xCoordinate
                  point.y = query.yCoordinate
                  if (query.zCoordinate) {
                    point.z = query.zCoordinate
                  } else {
                    point.z = 0
                  }
                  if (selectedNetwork.defaultSpatialReferenceFrom === SpatialReferenceFrom.Map) {
                    point.spatialReference = new SpatialReference({ wkid: 102100 })
                  } else {
                    if (selectedNetwork.spatialReferenceInfo.wkid) {
                      point.spatialReference = new SpatialReference({ wkid: selectedNetwork.spatialReferenceInfo.wkid })
                    } else if (selectedNetwork.spatialReferenceInfo.wkt) {
                      point.spatialReference = new SpatialReference({ wkt: selectedNetwork.spatialReferenceInfo.wkt })
                    }
                  }

                  let closestResults = []
                  let closestRouteIds = []
                  allResultLocations.forEach((location) => {
                    if (location) {
                      location.results.forEach((result) => {
                        if (result) {
                          const distance = geometryEngine.nearestCoordinate(new Point(result.geometry), point).distance
                          if (closestDistance === -1 || distance <= closestDistance) {
                            if (closestDistance === -1 || distance < closestDistance) {
                              closestResults = []
                              closestRouteIds = []
                              closestDistance = distance
                            }
                            closestResults.push(result)
                            closestRouteIds.push(result.routeId)
                          }
                        }
                      })
                    }
                  })
                  queryRoutesByClosestResults(originDS, selectedNetwork, featureDS, closestResults, closestRouteIds, allResultWkid, widgetId, labelLayer, jimuMapView, config)
                    .then(({ newRecords }) => {
                      featureDS.setRecords(newRecords)
                      setResultCount(newRecords?.length)
                      if (newRecords?.length > 0) {
                        newRecords.forEach((result) => {
                          const record = result.getData()
                          getAliasRecord(record, selectedNetwork)
                        })
                        recordsRef.current = featureDS.getRecordsByPage(1, config.resultConfig.pageSize)
                        setSection(1)
                        setNoResults(false)
                      } else {
                        setNoResults(true)
                        setToastMsg(getI18nMessage('searchRadiusResultsError'))
                      }
                    })
                })
              } else {
                setNoResults(true)
                setToastMsg(getI18nMessage('searchRadiusResultsError'))
              }
            })
        }
      })
  }, [dataSource, outputPointDS, selectedNetwork, jimuMapView, config, publishDataClearedMsg, widgetId, getI18nMessage])

  const onNavBack = React.useCallback(() => {
    // Clear preivous results.
    recordsRef.current = null
    if (isOutputPoint) {
      outputPointDS?.clearSelection()
      outputPointDS?.clearRecords()
      outputPointDS?.setCountStatus(DataSourceStatus.NotReady)
      outputPointDS?.setStatus(DataSourceStatus.NotReady)
    } else {
      outputLineDS?.clearSelection()
      outputLineDS?.clearRecords()
      outputLineDS?.setCountStatus(DataSourceStatus.NotReady)
      outputLineDS?.setStatus(DataSourceStatus.NotReady)
    }
    removeLabelLayer(jimuMapView, labelFeatureId)
    setResultCount(0)
    publishDataClearedMsg()
    setSection(0)
  }, [jimuMapView, isOutputPoint, outputLineDS, outputPointDS, publishDataClearedMsg])

  const submitForm = React.useCallback(() => {
    if (selectedMethod === SearchMethod.Measure) {
      measureRef.current?.submitForm()
    } else if (selectedMethod === SearchMethod.Referent) {
      referentRef.current?.submitForm()
    } else if (selectedMethod === SearchMethod.Coordinate) {
      coordinatesRef.current?.submitForm()
    } else if (selectedMethod === SearchMethod.LineAndMeasure) {
      lineMeasureRef.current?.submitForm()
    }
  }, [selectedMethod])

  const handleValidationChanged = React.useCallback((isValid: boolean) => {
    setIsValidInput(isValid)
  }, [])

  const getTooltipMessage = React.useMemo(() => {
    if (selectedMethod === SearchMethod.Measure) {
      return !isValidInput ? getI18nMessage('searchDisabled') : getI18nMessage('search')
    } else if (selectedMethod === SearchMethod.Referent) {
      return !isValidInput ? getI18nMessage('searchReferentTooltip') : getI18nMessage('search')
    } else if (selectedMethod === SearchMethod.Coordinate) {
      return !isValidInput ? getI18nMessage('coordinateSearchDisabled') : getI18nMessage('search')
    } else if (selectedMethod === SearchMethod.LineAndMeasure) {
      return !isValidInput ? getI18nMessage('lineMeasureSearchDisabled') : getI18nMessage('search')
    }
  }, [getI18nMessage, isValidInput, selectedMethod])

  const handleReset = () => {
    setReset(!reset)
    setSelectedReferent(defaultReferent)
  }

  return (
    <div className="search-by-route-task h-100 d-flex" css={getFormStyle()}>
      <div className={classNames('search-by-route-form__header px-3 pt-3 align-items-center', {
        'd-none': section === 1,
        [FOCUSABLE_CONTAINER_CLASS]: section !== 1
      })}>
      {!hideTitle && (
        <div className='search-by-route_title d-flex align-items-center text-truncate' css={css`font-weight: 500; font-size: 14px;`}>
            <div className='text-truncate'>
              {getI18nMessage('_widgetLabel')}
            </div>
          </div>
      )}
      </div>
      <div className={classNames('search-by-route-task__content', {
        'd-none': section === 1,
        [FOCUSABLE_CONTAINER_CLASS]: section !== 1
      })}>
        <DataSourceManager
          networkItem={selectedNetwork}
          dataSourceReady={handleDataSourceReady}
          onCreateDs={handleDataSourceCreated}
          onCreateLineDs={handleLineDsCreated}
          onCreatePointDs={handlePointDsCreated}/>
        <SearchMethodForm
          config={config}
          networkConfig={config.networkItems}
          onMethodChanged={handleMethodChanged}
          onNetworkChanged={handleNetworkChanged}
          onReferentChanged={handleReferentChanged}
          defaultReferent={selectedReferent}
        />
        {isDsEnabled && dataStoreExists && selectedMethod === SearchMethod.Measure && (
          <SearchMeasureForm
            config={config}
            ref={measureRef}
            intl={intl}
            widgetId={widgetId}
            networkItem={selectedNetwork}
            dataSource={dataSource}
            isDataSourceReady={dataSource != null}
            onSubmit={handleMeasureFormSubmit}
            onValidationChanged={handleValidationChanged}
            reset={reset}
        />
        )}
        {isDsEnabled && dataStoreExists && selectedMethod === SearchMethod.LineAndMeasure && (
          <SearchLineMeasureForm
            config={config}
            ref={lineMeasureRef}
            intl={intl}
            widgetId={widgetId}
            networkItem={selectedNetwork}
            dataSource={dataSource}
            isDataSourceReady={dataSource != null}
            onSubmit={handleLineMeasureFormSubmit}
            onValidationChanged={handleValidationChanged}
            reset={reset}
        />
        )}
        {selectedMethod === SearchMethod.Coordinate && (
        <SearchCoordinatesForm
          ref={coordinatesRef}
          networkItem={selectedNetwork}
          dataSource={dataSource}
          isDataSourceReady={dataSource != null}
          onSubmit={handleCoordinatesFormSubmit}
          onValidationChanged={handleValidationChanged}
          coordinateGraphic={coordinateGraphic}
          reset={reset}
        />
        )}
        {selectedMethod === SearchMethod.Referent && (
          <SearchReferentForm
            ref={referentRef}
            networkItem={selectedNetwork}
            referentItem={selectedReferent}
            dataSource={dataSource}
            isDataSourceReady={dataSource != null}
            onSubmit={handleReferentFormSubmit}
            config={config}
            id={widgetId}
            intl={intl}
            widgetId={widgetId}
            onValidationChanged={handleValidationChanged}
            reset={reset}
          />
        )}
        {toastOpen && (
        <div className='toast-container px-3 w-100'>
          <Alert
            className='toast w-100'
            type={toastMsgType}
            text={toastMsg}
            closable={true}
            withIcon={true}
            open={toastOpen}
            onClose={() => { setToastOpen(false); setNoResults(false) }}
          />
        </div>
        )}
      </div>

      <div className={classNames('search-by-route-footer_action w-100', {
        'd-none': section === 1,
        [FOCUSABLE_CONTAINER_CLASS]: section !== 1
      })}>
        <div className='search-by-route-footer d-flex' >
        <Label
          size='sm'
          className=' mt-auto mr-auto'
          style={{ fontWeight: 500, marginBottom: 0, alignItems: 'center', textAlign: 'left', color: 'var(--sys-color-primary-main)' }}
          onClick={handleReset}
        >
          Reset
        </Label>
          <Tooltip
            title={getTooltipMessage}>
              <div className='mt-auto ml-auto'>
                <Button
                  className='active'
                  aria-label={getI18nMessage('searchLabel')}
                  size='sm'
                  disabled={!isValidInput}
                  onClick={submitForm}>
                    {getI18nMessage('searchLabel')}
                </Button>
              </div>
          </Tooltip>
        </div>
      </div>
      <div className={classNames('search-by-route-task__content', {
        'd-none': section !== 1,
        [FOCUSABLE_CONTAINER_CLASS]: section === 1
      })}>
        <SearchTaskResult
        config={config}
        widgetId={widgetId}
        currentNetwork={selectedNetwork}
        selectedMethod={selectedMethod}
        isPoint={isOutputPoint}
        resultCount={resultCount}
        maxPerPage={(dataSource as QueriableDataSource)?.getMaxRecordCount?.()}
        records={recordsRef.current}
        routeRecords={routeRecordsRef.current}
        defaultPageSize={config.resultConfig.pageSize}
        outputDS={isOutputPoint ? outputPointDS : outputLineDS}
        inputDS={dataSource}
        jimuMapView={jimuMapView}
        highlightStyle={config.highlightStyle}
        onNavBack={onNavBack}
        intl={intl}
        measureType={measureType}
        />
      </div>
    </div>
  )
}
