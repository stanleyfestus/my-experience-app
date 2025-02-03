/** @jsx jsx */
import {
  React,
  css,
  type ImmutableObject,
  type DataSource,
  jsx,
  type IntlShape
} from 'jimu-core'
import { type RouteAndMeasureQuery, type NetworkItem, SearchMeasuresType, Identifiers, type IMConfig } from '../../config'
import { RouteInputControl } from './route-input-control'
import { MeasureSegmentControl } from './measures-segment-control'
import { MeasureInputControl } from './measure-input-control'
import { useImperativeHandle } from 'react'

export interface SearchMeasureProps {
  widgetId: string
  config: IMConfig
  networkItem?: ImmutableObject<NetworkItem>
  dataSource: DataSource
  isDataSourceReady: boolean
  intl: IntlShape
  reset?: boolean
  onSubmit: (query: RouteAndMeasureQuery) => void
  onValidationChanged: (isValid: boolean) => void
}

const getFormStyle = () => {
  return css`
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    .search-by-measure-form__content {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      flex: 1 1 auto;
      overflow: auto;
    }
  `
}

export const SearchMeasureForm = React.forwardRef((props: SearchMeasureProps, ref) => {
  const { widgetId, config, reset, networkItem, dataSource, isDataSourceReady, intl, onSubmit, onValidationChanged } = props
  const [routeAndMeasureRequest, setRouteAndMeasureRequest] = React.useState<RouteAndMeasureQuery>({})
  const [isRouteValid, setIsRouteValid] = React.useState<boolean>(false)
  const [isRouteIdFieldsInvalid, setIsRouteIdFieldsInvalid] = React.useState<boolean[]>(new Array<boolean>(networkItem?.routeIdFields?.length).fill(true))
  const [isMeasureValid, setIsMeasureValid] = React.useState<boolean>(true)
  const [searchMeasureBy, setSearchMeasureBy] = React.useState<SearchMeasuresType>(SearchMeasuresType.Single)

  useImperativeHandle(ref, () => ({
    submitForm
  }))

  React.useEffect(() => {
    // Set the search measure type.
    let searchBy = SearchMeasuresType.Single
    if (networkItem.searchSingle) {
      searchBy = SearchMeasuresType.Single
    } else if (networkItem.searchMultiple) {
      searchBy = SearchMeasuresType.Multiple
    } else if (networkItem.searchRange) {
      searchBy = SearchMeasuresType.Range
    }
    setSearchMeasureBy(searchBy)

    // Reset the query form.
    const resetRequest: RouteAndMeasureQuery = {
      routeId: '',
      routeName: '',
      routeIdFields: new Array(networkItem?.routeIdFields?.length).fill(''),
      measure: NaN,
      station: '',
      fromMeasure: NaN,
      fromStation: '',
      toMeasure: NaN,
      toStation: '',
      measures: [NaN],
      stations: [''],
      isPoint: false,
      searchMeasureBy: searchBy
    }
    setRouteAndMeasureRequest(resetRequest)
  }, [networkItem, reset])

  // Submit the form.
  const submitForm = () => {
    // Create a copy and update the request. This is to avoid updating the state
    // and invalidating the form for the next request.
    const requestCopy = { ...routeAndMeasureRequest }
    requestCopy.isMeasureToGeometryOperation = false
    requestCopy.isPoint = false

    if (requestCopy.searchMeasureBy === SearchMeasuresType.Single) {
      if (!isNaN(requestCopy.measure)) {
        requestCopy.isMeasureToGeometryOperation = true
        requestCopy.isPoint = true
      }
    } else if (requestCopy.searchMeasureBy === SearchMeasuresType.Multiple) {
      if (requestCopy.measures.some(item => !isNaN(item))) {
        requestCopy.isMeasureToGeometryOperation = true
        requestCopy.isPoint = true
      }
    } else {
      requestCopy.isPoint = false
      if (!isNaN(requestCopy.fromMeasure) || !isNaN(requestCopy.toMeasure)) {
        // To measure was provided, but from measure was not. Swap the measures.
        if (isNaN(requestCopy.fromMeasure) && !isNaN(requestCopy.toMeasure)) {
          requestCopy.fromMeasure = requestCopy.toMeasure
          requestCopy.toMeasure = NaN
          requestCopy.isPoint = true
        }
        if (!isNaN(requestCopy.fromMeasure) && isNaN(requestCopy.toMeasure)) {
          requestCopy.isPoint = true
        }
        if (requestCopy.fromMeasure === requestCopy.toMeasure) {
          requestCopy.toMeasure = NaN
          requestCopy.isPoint = true
        }
        requestCopy.isMeasureToGeometryOperation = true
      }
    }

    onSubmit(requestCopy)
  }

  const isValidInput = React.useMemo(() => {
    return isDataSourceReady && isRouteValid && isMeasureValid
    // isLineValid
  }, [isDataSourceReady, isRouteValid, isMeasureValid])

  React.useEffect(() => {
    onValidationChanged(isValidInput)
  }, [isValidInput, onValidationChanged])

  const handleRouteIdentifierChanged = React.useCallback((request: RouteAndMeasureQuery, index?: number) => {
    setRouteAndMeasureRequest(request)
  }, [])

  const handleRouteIdentifierAccepted = React.useCallback((request: RouteAndMeasureQuery, isValid: boolean, index?: number) => {
    setRouteAndMeasureRequest(request)

    if (networkItem.defaultIdentifer === Identifiers.RouteId && request.routeId === '') {
      setIsRouteValid(false)
    } else if (networkItem.defaultIdentifer === Identifiers.RouteName && request.routeName === '') {
      setIsRouteValid(false)
    } else if (networkItem.defaultIdentifer === Identifiers.MultiField && index > -1) {
      // For multi-field route identifier, check if all fields are valid.
      // Only need one valid field to continue, but should not have any
      // invalid fields.
      let validFields = true
      const updateFieldAndValidation = isRouteIdFieldsInvalid
      updateFieldAndValidation[index] = isValid
      updateFieldAndValidation.forEach((item, index) => {
        if (!item && request.routeIdFields[index] !== '') {
          // At least one field is invalid.
          validFields = false
        }
        if (request.routeIdFields.every(item => item === '')) {
          // All fields are empty.
          validFields = false
        }
      })
      setIsRouteValid(validFields)
      setIsRouteIdFieldsInvalid(updateFieldAndValidation)
    } else {
      setIsRouteValid(isValid)
    }
  }, [isRouteIdFieldsInvalid, networkItem.defaultIdentifer])

  const handleMeasureTypeChange = React.useCallback((value: SearchMeasuresType) => {
    const request = routeAndMeasureRequest
    request.searchMeasureBy = value
    setRouteAndMeasureRequest(request)
    setSearchMeasureBy(value)
  }, [routeAndMeasureRequest])

  const handleMeasureChanged = React.useCallback((request: RouteAndMeasureQuery, isValid: boolean) => {
    setRouteAndMeasureRequest(request)
    setIsMeasureValid(isValid)
  }, [])

  return (
    <div className='search-by-measure-form' css={getFormStyle()}>
      <div className='search-by-measure-form__content pt-3'>
        <RouteInputControl
          reset={reset}
          intl={intl}
          widgetId={widgetId}
          config={config}
          networkItem={networkItem}
          dataSource={dataSource}
          routeAndMeasureRequest={routeAndMeasureRequest}
          isDataSourceReady={isDataSourceReady}
          onChange={handleRouteIdentifierChanged}
          onAccept={handleRouteIdentifierAccepted}
        />
        <MeasureSegmentControl
          networkItem={networkItem}
          searchMeasureBy={searchMeasureBy}
          onChange={handleMeasureTypeChange}
        />
        <MeasureInputControl
          reset={reset}
          intl={intl}
          networkItem={networkItem}
          dataSource={dataSource}
          isDataSourceReady={isDataSourceReady}
          searchMeasureBy={searchMeasureBy}
          routeAndMeasureRequest={routeAndMeasureRequest}
          onChange={handleMeasureChanged}
        />
      </div>
    </div>
  )
})
