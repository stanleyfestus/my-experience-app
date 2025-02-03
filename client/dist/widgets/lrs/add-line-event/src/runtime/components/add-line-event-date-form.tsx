/** @jsx jsx */
import { React, jsx, hooks, type ImmutableObject } from 'jimu-core'
import defaultMessages from '../translations/default'
import { Checkbox, Label, Tooltip } from 'jimu-ui'
import {
  type RouteInfo,
  type EventInfo,
  type NetworkInfo,
  isDefined,
  getCalciteBasicTheme
} from 'widgets/shared-code/lrs'
import { CalciteInputDatePicker } from 'calcite-components'

export interface AddLineEventDateFormProps {
  routeInfo: RouteInfo
  eventInfo?: ImmutableObject<EventInfo>
  network: ImmutableObject<NetworkInfo>
  revalidateRouteFromDataAction: boolean
  hideDates: boolean
  useRouteStartEndDate: boolean
  onUpdateRouteInfo: (updatedRouteInfo: RouteInfo) => void
}

export type Status = 'invalid' | 'valid' | 'idle'

export function AddLineEventDateForm (props: AddLineEventDateFormProps) {
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const { routeInfo, eventInfo, network, revalidateRouteFromDataAction, hideDates, useRouteStartEndDate, onUpdateRouteInfo } = props
  const [useRouteFromDate, setUseRouteFromDate] = React.useState<boolean>(false)
  const [useRouteToDate, setUseRouteToDate] = React.useState<boolean>(false)
  const [fromDateStatus, setFromDateStatus] = React.useState<Status>('idle')
  const [toDateStatus, setToDateStatus] = React.useState<Status>('idle')
  const [fromDateToolTip, setFromDateToolTip] = React.useState<string>('')
  const [toDateToolTip, setToDateToolTip] = React.useState<string>('')
  const [routeDateCheckboxEnabled, setRouteDateCheckboxEnabled] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (revalidateRouteFromDataAction) {
      setUseRouteFromDate(false)
      setUseRouteToDate(false)
      setFromDateToolTip('')
      setToDateToolTip('')
    }
    // eslint-disable-next-line
  }, [revalidateRouteFromDataAction])

  React.useEffect(() => {
    setUseRouteFromDate(useRouteStartEndDate)
    setUseRouteToDate(useRouteStartEndDate)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideDates])

  React.useEffect(() => {
    let didUpdate = false
    const updateRouteInfo = { ...routeInfo }

    if (!revalidateRouteFromDataAction) {
      if (fromDateStatus === 'idle') {
        setFromDateToolTip('')
      }

      if (toDateStatus === 'idle') {
        setToDateToolTip('')
      }
    }

    // enable / disable use date checkboxes
    // multiline event where network supports lines
    if (!isDefined(eventInfo) && isDefined(network?.lineIdFieldSchema)) {
      setRouteDateCheckboxEnabled(false)
    } else if (eventInfo?.canSpanRoutes) {
      setRouteDateCheckboxEnabled(false)
    } else if (routeInfo.routeId === '' && routeInfo.routeName === '') {
      setRouteDateCheckboxEnabled(false)
    } else {
      setRouteDateCheckboxEnabled(true)
    }

    // the form was reset so uncheck use from/to date
    if (routeInfo.routeId === '' && routeInfo.toRouteId === '' &&
        routeInfo.routeName === '' && routeInfo.toRouteName === '') {
      setUseRouteFromDate(false)
      setUseRouteToDate(false)
      setFromDateStatus('idle')
      setToDateStatus('idle')
      setFromDateToolTip('')
      setToDateToolTip('')
      return
    }

    if (isDefined(eventInfo) && eventInfo.canSpanRoutes) {
      setUseRouteFromDate(false)
      setUseRouteToDate(false)
    }

    // Update selected if the check is enabled, the routes from/to date has been set and the
    // date isn't already set to the current date. This gets hit every time routeInfo updates so
    // make sure we don't continue unnessasary updates.
    if (isDefined(routeInfo.selectedFromDate) && useRouteFromDate && routeInfo.selectedFromDate !== routeInfo.fromDate) {
      updateRouteInfo.selectedFromDate = routeInfo.fromDate
      didUpdate = true
    }
    if (useRouteToDate && routeInfo.selectedToDate !== routeInfo.toDate) {
      updateRouteInfo.selectedToDate = routeInfo.toDate
      didUpdate = true
    }

    const validFromDate = validateDate(routeInfo.selectedFromDate, true)
    if (validFromDate) {
      validateDate(routeInfo.selectedToDate, false)
    }

    if (didUpdate) {
      onUpdateRouteInfo(updateRouteInfo)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onUpdateRouteInfo, routeInfo, eventInfo, useRouteFromDate, useRouteToDate])

  const handleUseRouteFromDate = (e, checked: boolean) => {
    validateDate(routeInfo.fromDate, true)
    setUseRouteFromDate(checked)
  }

  const handleUseRouteToDate = (e, checked: boolean) => {
    validateDate(routeInfo.toDate, false)
    setUseRouteToDate(checked)
  }

  const handleFromDateChanged = (evt) => {
    if (evt) {
      const date = evt.target?.valueAsDate
      validateDate(date, true)
      if (date) {
        const updatedRoute = {
          ...routeInfo,
          selectedFromDate: date
        }
        onUpdateRouteInfo(updatedRoute)
      } else {
        const updatedRoute = {
          ...routeInfo,
          selectedFromDate: null
        }
        onUpdateRouteInfo(updatedRoute)
      }
    }
  }

  const handleToDateChanged = (evt) => {
    if (evt) {
      const date = evt.target?.valueAsDate
      validateDate(date, false)
      if (date) {
        // At least one date is provided. If one was not, its value will be null.
        const updatedRoute = {
          ...routeInfo,
          selectedToDate: date
        }
        onUpdateRouteInfo(updatedRoute)
      } else {
        const updatedRoute = {
          ...routeInfo,
          selectedToDate: null
        }
        onUpdateRouteInfo(updatedRoute)
      }
    }
  }

  const validateDate = (date: Date, isFromDate: boolean): boolean => {
    const selectedDate = date
    if (!isDefined(selectedDate)) {
      isFromDate ? setFromDateStatus('idle') : setToDateStatus('idle')
      isFromDate ? setFromDateToolTip('') : setToDateToolTip('')
      return true
    }

    let validDate = true

    // Check if selected date is before the routes from date.
    if (isDefined(routeInfo.fromDate)) {
      if (selectedDate < routeInfo.fromDate) {
        isFromDate ? setFromDateStatus('invalid') : setToDateStatus('invalid')
        isFromDate ? setFromDateToolTip(getI18nMessage('invalidFromDateBefore')) : setToDateToolTip(getI18nMessage('invalidToDateBefore'))
        validDate = false
        return false
      }
    }

    // Check if the selected date is before the to routes from date
    // Verify that the selected date is not before the to route from date.
    if (isDefined(routeInfo.toRouteFromDate)) {
      if (selectedDate < routeInfo.toRouteFromDate) {
        isFromDate ? setFromDateStatus('invalid') : setToDateStatus('invalid')
        isFromDate ? setFromDateToolTip(getI18nMessage('invalidFromDateBefore')) : setToDateToolTip(getI18nMessage('invalidToDateBefore'))
        validDate = false
        return false
      }
    }

    // Check if the selected date is after the routes to date.
    if (isDefined(routeInfo.toDate)) {
      if (selectedDate > routeInfo.toDate) {
        isFromDate ? setFromDateStatus('invalid') : setToDateStatus('invalid')
        isFromDate ? setFromDateToolTip(getI18nMessage('invalidFromDateAfter')) : setToDateToolTip(getI18nMessage('invalidToDateAfter'))
        validDate = false
        return false
      }
    }

    // Check if the selected date is after the to routes to date.
    // Verify that the selected date is not after the to route to date.
    if (isDefined(routeInfo.toRouteToDate)) {
      if (selectedDate > routeInfo.toRouteToDate) {
        isFromDate ? setFromDateStatus('invalid') : setToDateStatus('invalid')
        isFromDate ? setFromDateToolTip(getI18nMessage('invalidFromDateAfter')) : setToDateToolTip(getI18nMessage('invalidToDateAfter'))
        validDate = false
        return false
      }
    }

    // From date is greater than to date
    if (isDefined(routeInfo.selectedToDate)) {
      if (isFromDate) {
        if (selectedDate > routeInfo.selectedToDate) {
          setFromDateStatus('invalid')
          isFromDate ? setFromDateToolTip(getI18nMessage('invalidDatesOrder')) : setToDateToolTip(getI18nMessage('invalidDatesOrder'))
          validDate = false
        }
        // see if we need to clear toDate error
        if (toDateToolTip === getI18nMessage('invalidDatesOrder')) {
          if (selectedDate < routeInfo.selectedToDate) {
            setToDateStatus('idle')
            setToDateToolTip('')
          }
        // see if this fixes to date error where dates were same
        } else if (toDateToolTip === getI18nMessage('invalidDatesSameDay')) {
          if (selectedDate !== routeInfo.selectedFromDate) {
            setToDateStatus('idle')
            setToDateToolTip('')
          }
        }
      }
    }

    // From date and to date are equal
    if (isDefined(routeInfo.selectedToDate)) {
      if (isFromDate && selectedDate.getTime() === routeInfo.selectedToDate.getTime()) {
        setFromDateStatus('invalid')
        isFromDate ? setFromDateToolTip(getI18nMessage('invalidDatesSameDay')) : setToDateToolTip(getI18nMessage('invalidDatesSameDay'))
        validDate = false
      }
    }

    // To date is less than from date
    if (isDefined(routeInfo.selectedFromDate)) {
      if (!isFromDate) {
        if (selectedDate < routeInfo.selectedFromDate) {
          setToDateStatus('invalid')
          isFromDate ? setFromDateToolTip(getI18nMessage('invalidDatesOrder')) : setToDateToolTip(getI18nMessage('invalidDatesOrder'))
          validDate = false
        }
        // see if we need to clear from date error
        if (fromDateToolTip === getI18nMessage('invalidDatesOrder')) {
          if (selectedDate > routeInfo.selectedFromDate) {
            setFromDateStatus('idle')
            setFromDateToolTip('')
          }
        // see if we need to clear from date equals error
        } else if (fromDateToolTip === getI18nMessage('invalidDatesSameDay')) {
          if (selectedDate !== routeInfo.selectedFromDate) {
            setFromDateStatus('idle')
            setFromDateToolTip('')
          }
        }
      }
    }

    // To date and from date are equal
    if (isDefined(routeInfo.selectedFromDate)) {
      if (!isFromDate && selectedDate.getTime() === routeInfo.selectedFromDate.getTime()) {
        setToDateStatus('invalid')
        isFromDate ? setFromDateToolTip(getI18nMessage('invalidDatesSameDay')) : setToDateToolTip(getI18nMessage('invalidDatesSameDay'))
        validDate = false
      }
    }

    if (validDate) {
      isFromDate ? setFromDateStatus('idle') : setToDateStatus('idle')
      isFromDate ? setFromDateToolTip('') : setToDateToolTip('')
    }

    return validDate
  }

  return (
    <div className="add-line=event-form-header px-3" css={getCalciteBasicTheme()}>
      {!hideDates && (
        <div>
          <Label
            size="sm"
            className="mb-0 pt-3"
            style={{ width: 100, alignItems: 'center', fontWeight: 500 }}
          >
            {getI18nMessage('startDateLabel')}
          </Label>

          <Tooltip title={fromDateToolTip}>
            <CalciteInputDatePicker
              scale="s"
              disabled={useRouteFromDate ? true : undefined}
              valueAsDate={routeInfo.selectedFromDate}
              onCalciteInputDatePickerChange={handleFromDateChanged}
              status={fromDateStatus}
              placement='top'
              overlayPositioning='fixed'
            />
          </Tooltip>

          <Label size="sm" className="w-100 pt-2" centric check>
            <Checkbox
              checked={useRouteFromDate}
              className="mr-2"
              disabled={!routeDateCheckboxEnabled}
              onChange={handleUseRouteFromDate}
            />
            {getI18nMessage('useStartDateLabel')}
          </Label>

          <Label
            size="sm"
            className="mb-0 pt-1"
            style={{ width: 100, alignItems: 'center', fontWeight: 500 }}
          >
            {getI18nMessage('endDateLabel')}
          </Label>

          <Tooltip title={toDateToolTip}>
            <CalciteInputDatePicker
              scale="s"
              disabled={useRouteToDate ? true : undefined}
              valueAsDate={routeInfo.selectedToDate}
              onCalciteInputDatePickerChange={handleToDateChanged}
              status={toDateStatus}
              placement='top'
              overlayPositioning='fixed'
            />
          </Tooltip>

          <Label size="sm" className="w-100 pt-2" centric check>
            <Checkbox
              checked={useRouteToDate}
              className="mr-2"
              disabled={!routeDateCheckboxEnabled}
              onChange={handleUseRouteToDate}
            />
            {getI18nMessage('useEndDateLabel')}
          </Label>
       </div>
      )}
    </div>
  )
}
