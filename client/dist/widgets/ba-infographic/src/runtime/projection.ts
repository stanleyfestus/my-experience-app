class BAProjection {
  fixForLint: string

  constructor () {
    this.fixForLint = ''
  }

  public static pointToGeographic = function (x, y) {
    const limit = 20037508.3427892
    // prevent converting invalid coordinates
    if ((Math.abs(x) < 180 && Math.abs(y) < 90) || Math.abs(x) > limit || Math.abs(y) > limit) {
      return null
    }
    const d = x / 6378137.0
    const h = d * 57.295779513082323
    const v = Math.floor(((h + 180.0) / 360.0))
    const r = 1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * y) / 6378137.0)))
    const lat = r * 57.295779513082323
    const lon = h - (v * 360.0)

    return { lat, lon }
  }

  public static pointToWebMercator = function (lat, lon) {
    // prevent converting invalid coordinates
    if ((Math.abs(lon) > 180 || Math.abs(lat) > 90)) {
      return null
    }
    const h = lon * 0.017453292519943295
    const x = 6378137.0 * h
    const d = lat * 0.017453292519943295
    const y = 3189068.5 * Math.log((1.0 + Math.sin(d)) / (1.0 - Math.sin(d)))

    return { x, y }
  }
}
export default BAProjection
