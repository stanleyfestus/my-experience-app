import {
  esri,
  type FeatureLayerDataSource,
  type ImmutableObject,
  SessionManager
} from 'jimu-core'
import {
  type LrsLayer,
  type RouteInfo,
  getDateToUTC,
  type ApplyEditsResponse
} from 'widgets/shared-code/lrs'
import { type MergeEventsRequest } from '../config'

export async function requestService (opts: any): Promise<any> {
  return new Promise(function (resolve, reject) {
    const requestOptions = {
      params: opts.params,
      httpMethod: opts.method
    }
    esri.restRequest
      .request(opts.url, requestOptions)
      .then((result: any) => {
        resolve(result)
      })
      .catch((e: any) => {
        resolve(e)
      })
  })
}

export async function LrsApplyEdits (
  eventDS: FeatureLayerDataSource,
  lrsLayer: ImmutableObject<LrsLayer>,
  query: MergeEventsRequest,
  routeInfo: RouteInfo
): Promise<ApplyEditsResponse> {
// Get LRS server endpoint.
  const lrsUrl = lrsLayer.lrsUrl
  const REST = `${lrsUrl}/applyEdits`
  const token = await SessionManager.getInstance().getSessionByUrl(lrsUrl).getToken(lrsUrl)

  const layerId = lrsLayer.serviceId

  const mergeEvents = {
    objectIds: query.objectIds,
    objectIdToPreserve: query.objectIdToPreserve,
    fromDate: query.fromDate ? getDateToUTC(query.fromDate) : null,
    toDate: query.toDate ? getDateToUTC(query.toDate) : null,
    attributes: query.attributes
  }

  const edits = []
  const edit = {
    id: layerId,
    mergeEvents: mergeEvents
  }

  edits.push(edit)

  let gdbVersion = eventDS.getGDBVersion()
  if (!gdbVersion) {
    gdbVersion = ''
  }

  const params = {
    f: 'json',
    token: token,
    gdbVersion: gdbVersion,
    edits: edits
  }

  return requestService({ method: 'GET', url: REST, params: params })
    .then(async (results) => {
      const response: ApplyEditsResponse = {
        success: false,
        editResults: [],
        code: 0,
        message: '',
        details: ''
      }
      // eslint-disable-next-line no-prototype-builtins
      if (results.hasOwnProperty('success')) {
        response.success = true
        response.editResults = results.editResults
      } else {
        response.success = false
        response.code = results.code
        response.message = results.message
      }
      return response
    })
}
