import {
  SessionManager,
  type FeatureLayerDataSource,
  type ImmutableObject
} from 'jimu-core'
import {
  type LrsLayer,
  getDateToUTC,
  requestService,
  type ApplyEditsResponse
} from 'widgets/shared-code/lrs'
import { type SplitEventRequest } from '../config'

export async function LrsApplyEdits (
  eventDS: FeatureLayerDataSource,
  lrsLayer: ImmutableObject<LrsLayer>,
  query: SplitEventRequest
): Promise<ApplyEditsResponse> {
// Get LRS server endpoint.
  const lrsUrl = lrsLayer.lrsUrl
  const REST = `${lrsUrl}/applyEdits`
  const token = await SessionManager.getInstance().getSessionByUrl(lrsUrl).getToken(lrsUrl)

  const layerId = lrsLayer.serviceId

  const splitEvent = {
    objectId: query.eventOid,
    routeId: query.routeId,
    measure: query.measure,
    fromDate: query.fromDate ? getDateToUTC(query.fromDate) : null,
    attributes: query.attributes,
    attributes2: query.attributes2
  }

  const edits = []
  const edit = {
    id: layerId,
    splitEvent: splitEvent
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
        response.details = results.response.error.details[0]
      }
      return response
    })
}
