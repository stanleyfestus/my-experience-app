import { jimuHistory } from 'jimu-core'
import { sliceUrlForSharing, replaceAttr } from '../src/runtime/components/items/utils'

describe('share items utils', () => {
  beforeEach(() => {
    jimuHistory.browserHistory.replace('/')
  })

  it('isIncludeUrlParams = true', async () => {
    const location = {
      pathname: '/experience/11/page/Page-2/',
      search: '?draft=true&views=View-6%2CView-2&org=beijing',
      hash: '#widget_32=p1:encodedValue1,p2:22,p3:3'
    }
    jimuHistory.browserHistory.replace(location)

    const isIncludeUrlParams = true
    const slicedUrl = sliceUrlForSharing(isIncludeUrlParams)

    const URL = 'http://localhost/experience/11/page/Page-2/?draft=true&views=View-6%2CView-2&org=beijing#widget_32=p1:encodedValue1,p2:22,p3:3'
    expect(slicedUrl).toBe(URL)
  })

  it('isIncludeUrlParams = false', async () => {
    const location = {
      pathname: '/experience/11/page/Page-2/',
      search: '?draft=true&views=View-6%2CView-2',
      hash: '#widget_32=p1:encodedValue1,p2:22,testSetHash:false,p3:3'
    }
    jimuHistory.browserHistory.replace(location)

    const isIncludeUrlParams = false
    const slicedUrl = sliceUrlForSharing(isIncludeUrlParams)

    const URL = 'http://localhost/experience/11/?draft=true'
    expect(slicedUrl).toBe(URL)
  })

  it('test org', async () => {
    const location = {
      pathname: '/experience/11/page/Page-2/',
      search: '?draft=true&views=View-6%2CView-2&org=beijing',
      hash: '#widget_32=p1:encodedValue1,p2:22,testSetHash:false,p3:3'
    }
    jimuHistory.browserHistory.replace(location)

    const isIncludeUrlParams = false
    const slicedUrl = sliceUrlForSharing(isIncludeUrlParams)

    const URL = 'http://localhost/experience/11/?draft=true&org=beijing'
    expect(slicedUrl).toBe(URL)
  })

  it('test page/pageInfo/', async () => {
    const location = {
      pathname: '/experience/11/page/Page-2/',
      search: '?draft=true&views=View-6%2CView-2&org=beijing&any=page/pageInfo/',
      hash: '#widget_32=p1:encodedValue1,any:page/pageInfo/'
    }
    jimuHistory.browserHistory.replace(location)

    const isIncludeUrlParams = false
    const slicedUrl = sliceUrlForSharing(isIncludeUrlParams)

    const URL = 'http://localhost/experience/11/?draft=true&org=beijing'
    expect(slicedUrl).toBe(URL)
  })

  it('test replaceAttr url', async () => {
    const text = '<iframe width="800" height="600" frameborder="0" allowfullscreen src="https://arcg.is/1OmHyv1"></iframe>'
    const longUrl = 'https://horizon.esri.com:3001/experience/20/?draft=true&org=esridevbeijing#'

    const newText = replaceAttr(text, 'src', longUrl)
    expect(newText).toBe('<iframe width="800" height="600" frameborder="0" allowfullscreen src="https://horizon.esri.com:3001/experience/20/?draft=true&org=esridevbeijing#"></iframe>')
  })
  it('test replaceAttr params', async () => {
    const text = '<iframe width="800" height="600" frameborder="0" allowfullscreen src="https://arcg.is/1OmHyv1" params1>params2</iframe>'
    const longUrl = 'https://horizon.esri.com:3001/experience/20/?draft=true&org=esridevbeijing#'

    let newText = replaceAttr(text, 'width', 799)
    newText = replaceAttr(newText, 'height', 599)
    newText = replaceAttr(newText, 'src', longUrl)
    expect(newText).toBe('<iframe width="799" height="599" frameborder="0" allowfullscreen src="https://horizon.esri.com:3001/experience/20/?draft=true&org=esridevbeijing#" params1>params2</iframe>')
  })
})
