import { acquireLock, type AcquireLockResponse, type DetailedLockInfo, formatMessage, getGDBVersion, isDefined, LockAcquireStatus, type LrsLocksInfo, QueryLock, type RouteInfo, shouldTryAcquireLock, tryAutoReconcile } from 'widgets/shared-code/lrs'
import { type TableEdits, type DynSegFieldInfo } from '../../config'
import { getAttributesByTable, getPendingEditsKey } from './table-utils'
import { type FeatureLayerQueryParams, type FeatureLayerDataSource, type DataSource } from 'jimu-core'
import { DynSegFields } from '../../constants'

export function handleCellEdit (fieldInfo: DynSegFieldInfo, incomingRecord: __esri.Graphic, fieldInfos, pendingEdits): Map<string, TableEdits> {
  const key = getPendingEditsKey(incomingRecord, fieldInfo.eventName)
  const existingEdits = pendingEdits.get(key)
  const attributes = getAttributesByTable(fieldInfos, incomingRecord, fieldInfo.eventName, false)

  const updatedPendingEdits = new Map<string, TableEdits>(pendingEdits)
  if (isDefined(existingEdits)) {
    existingEdits.attributes = attributes
    updatedPendingEdits.set(key, existingEdits)
  } else {
    const DynSegEdits = {
      layerId: fieldInfo.eventLayerId,
      attributes: attributes
    }
    updatedPendingEdits.set(key, DynSegEdits)
  }
  return updatedPendingEdits
}

export async function preventConflict (lockInfo, featureDS, intl) {
  const queryLockResults = await QueryLock(featureDS, lockInfo, false)
  let acquireLockResults
  if (shouldTryAcquireLock(featureDS, queryLockResults)) {
    acquireLockResults = await acquireLock(featureDS, queryLockResults)
    if (acquireLockResults.acquireStatus === LockAcquireStatus.EsriReconcileRequired) {
      const success = await tryAutoReconcile(featureDS)
      if (success) {
        acquireLockResults = await acquireLock(featureDS, queryLockResults)
      } else {
        return getErrorMessage(acquireLockResults, lockInfo, featureDS, intl)
      }
    } else if (acquireLockResults.acquireStatus !== LockAcquireStatus.EsriSuccess) {
      return getErrorMessage(acquireLockResults, lockInfo, featureDS, intl)
    }
  } else if (queryLockResults.status !== LockAcquireStatus.EsriSuccess) {
    return getErrorMessage(acquireLockResults, lockInfo, featureDS, intl)
  }
}

function getNameOrId (routeInfo: RouteInfo): string {
  if (routeInfo.lineId !== '' && routeInfo.lineName === '') { return routeInfo.lineId }
  if (routeInfo.lineId !== '' && routeInfo.lineName !== '') { return routeInfo.lineName }
  if (routeInfo.routeName !== '') { return routeInfo.routeName }
  return routeInfo.routeId
}

function getNameOrIdFromUnavailableLock (lock: DetailedLockInfo): string {
  if (isDefined(lock.routeName) && lock.routeName !== '') { return lock.routeName }
  if (isDefined(lock.lineName) && lock.lineName !== '') { return lock.lineName }
  if (isDefined(lock.routeId) && lock.routeId !== '') { return lock.routeId }
  if (isDefined(lock.lineId) && lock.lineId !== '') { return lock.lineId }
}

function getErrorMessage (response: AcquireLockResponse, lockInfo: LrsLocksInfo, featureDS, intl) {
  let message = ''
  let msgType = 'info'
  let nameOrId = ''
  const networkName = lockInfo?.details[0]?.lrsNetworkName
  const version = getGDBVersion(featureDS)
  switch (response.acquireStatus) {
    case LockAcquireStatus.EsriSuccess:
      nameOrId = getNameOrId(lockInfo.routeInfo)
      if (lockInfo.routeInfo.lineId !== '') {
        message = formatMessage(intl, 'YouAcquiredLockOnLine', { nameOrId: nameOrId, networkName: networkName, version: version })
      } else {
        message = formatMessage(intl, 'YouAcquiredLockOnRoute', { nameOrId: nameOrId, networkName: networkName, version: version })
      }
      msgType = 'info'
      break
    case LockAcquireStatus.EsriReconcileRequired:
      message = formatMessage(intl, 'ReconcileRequired')
      msgType = 'danger'
      break
    case LockAcquireStatus.EsriCouldNotAcquireAllLocks:
      const lockVersion = response.unavailableLocks[0].versionName
      const lockUser = response.unavailableLocks[0].user
      nameOrId = getNameOrIdFromUnavailableLock(response.unavailableLocks[0])
      if (lockVersion === '') {
        if (lockInfo.routeInfo.lineId !== '') {
          message = formatMessage(intl, 'UnavailableLockOnLineWithoutVersion', { nameOrId: nameOrId, networkName: networkName, lockUser: lockUser })
        } else {
          message = formatMessage(intl, 'UnavailableLockOnRouteWithoutVersion', { nameOrId: nameOrId, networkName: networkName, lockUser: lockUser })
        }
      } else {
        if (lockInfo.routeInfo.lineId !== '') {
          message = formatMessage(intl, 'UnavailableLockOnLine', { nameOrId: nameOrId, networkName: networkName, lockUser: lockUser, version: lockVersion })
        } else {
          message = formatMessage(intl, 'UnavailableLockOnRoute', { nameOrId: nameOrId, networkName: networkName, lockUser: lockUser, version: lockVersion })
        }
      }
      msgType = 'danger'
      break
    default:
      message = ''
      msgType = 'info'
      break
  }
  return ({ toastMsg: message, toastMsgType: msgType, toastOpen: open })
}

export async function getLineId (networkInfo, routeId, networkDS) {
  const routeIdFieldName = networkInfo.routeIdFieldSchema.name
  const lineIdFieldName = networkInfo.lineIdFieldSchema.name
  let whereClause = ''
  const routeIds = [routeId]
  if (routeIds.length > 0) {
    whereClause = routeIdFieldName + ' IN (\'' + routeIds.join('\',\'') + '\')'
  }
  const featureQuery: FeatureLayerQueryParams = ({
    where: whereClause,
    outFields: ['*']
  })
  const results = await networkDS.query(featureQuery)
  if (results?.records?.length === 0) return null
  const lineId = results?.records[0].feature.attributes[lineIdFieldName]
  return lineId
}

export function getWhereClause (networkDS: DataSource): string {
  const date = getOperationDate(networkDS)
  const isoDate = date.toISOString().slice(0, 10)
  const dateUTC = `TIMESTAMP '${isoDate}'`

  const where = `(((${DynSegFields.fromDateName.toUpperCase()} <= ${dateUTC}) AND (${DynSegFields.toDateName.toUpperCase()} IS NULL)) OR ` +
    `((${DynSegFields.fromDateName.toUpperCase()} IS NULL) AND (${DynSegFields.toDateName.toUpperCase()} >= ${dateUTC})) OR ` +
    `((${DynSegFields.fromDateName.toUpperCase()} < ${dateUTC}) AND (${DynSegFields.toDateName.toUpperCase()} > ${dateUTC})))`

  return where
}

export function getOperationDate (networkDS: DataSource): Date {
  if (isDefined(networkDS)) {
    const featureDS = networkDS as FeatureLayerDataSource
    const queryParams = featureDS.getCurrentQueryParams()
    const extent = queryParams.time
    let date = new Date(Date.now())
    if (extent) {
      date = new Date(extent[0])
    }
    return date
  }
  return null
}
