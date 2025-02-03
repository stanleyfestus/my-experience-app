import { React, Immutable, appActions, lodash, getAppStore } from 'jimu-core'
import BookmarkSetting from '../src/setting/setting'
import { TemplateType, PageStyle } from '../src/config'
import { mockTheme, wrapWidget, widgetRender, getInitState, initGlobal } from 'jimu-for-test'
import '@testing-library/jest-dom'
import { fireEvent } from '@testing-library/react'
import { FontFamilyValue } from 'jimu-ui'

jest.mock('jimu-for-builder', () => ({
  ...jest.requireActual<any>('jimu-for-builder'),
  templateUtils: {
    processForTemplate: jest.fn()
  }
}))

jest.mock('jimu-ui', () => {
  return {
    ...jest.requireActual<any>('jimu-ui'),
    NumericInput: (props) => <input className='jimu-input jimu-input-sm jimu-numeric-input jimu-numeric-input-input' {...props} />
  }
})

jest.mock('jimu-arcgis', () => {
  return {
    loadArcGISJSAPIModules: async () => {
      return await Promise.resolve([
        { fromJSON: () => {} },
        function () {
          return { fromJSON: () => {} }
        },
        { fromJSON: () => {} },
        { fromJSON: () => {} },
        { fromJSON: () => {} }
      ])
    }
  }
})

initGlobal()
window.jimuConfig.isBuilder = true
const initState = getInitState().merge({
  appStateInBuilder: {
    appConfig: { widgets: {}, pages: { p1: { id: 'p1' } } },
    appRuntimeInfo: { currentPageId: 'p1' },
    widgetsState: {},
    appContext: { isRTL: false }
  }
})

getAppStore().dispatch(appActions.updateStoreState(initState))

describe('bookmark setting test', function () {
  let render = null
  const fixedTooltip = {
    fontSize: '0.875rem',
    maxWidth: '200px',
    color: 'inherit',
    bg: '#fff',
    borderRadius: '0.25rem',
    border: {
      width: '1px',
      color: '#a8a8a8'
    },
    boxShadow: '0 .125rem .5rem rgba(0,0,0,0.2)',
    opacity: 1,
    paddingY: '0.25rem',
    paddingX: '0.5rem',
    margin: '0.375rem',
    arrow: {
      size: '0.375rem',
      color: '#fff',
      border: {
        width: '1px',
        color: '#a8a8a8'
      }
    }
  }
  const fixedComponents = lodash.assign({}, mockTheme.components, { tooltip: fixedTooltip })
  const fixedMockTheme = lodash.assign({}, mockTheme, { components: fixedComponents })
  beforeAll(() => {
    render = widgetRender(false, fixedMockTheme as any)
  })

  afterAll(() => {
    render = null
  })

  const config = Immutable({
    templateType: TemplateType.Slide1,
    isTemplateConfirm: true,
    isInitialed: true,
    bookmarks: [{
      id: 1,
      name: 'SettingTest-1',
      title: 'SettingTest-1',
      type: '2d',
      extent: {
        spatialReference: {
          latestWkid: 3857,
          wkid: 102100
        },
        xmin: 12753609.910596116,
        ymin: 4661461.4019647185,
        xmax: 13223239.012380214,
        ymax: 5095012.226398217
      },
      showFlag: true,
      mapViewId: 'widget_2editor-dataSource_1',
      mapDataSourceId: 'dataSource_1',
      cardNameStyle: {
        fontFamily: FontFamilyValue.AVENIRNEXT,
        fontStyles: {
          style: 'normal',
          weight: 'normal',
          decoration: 'none'
        },
        fontColor: 'var(--black)',
        fontSize: '13'
      },
      slidesNameStyle: {
        fontFamily: FontFamilyValue.AVENIRNEXT,
        fontStyles: {
          style: 'normal',
          weight: 'bold',
          decoration: 'none'
        },
        fontColor: 'var(--black)',
        fontSize: '16'
      },
      slidesDescriptionStyle: {
        fontFamily: FontFamilyValue.AVENIRNEXT,
        fontStyles: {
          style: 'normal',
          weight: 'normal',
          decoration: 'none'
        },
        fontColor: 'var(--black)',
        fontSize: '13'
      }
    },
    {
      id: 2,
      name: 'SettingTest-2',
      title: 'SettingTest-2',
      type: '2d',
      extent: {
        spatialReference: {
          latestWkid: 3857,
          wkid: 102100
        },
        xmin: 12753609.910596116,
        ymin: 4661461.4019647185,
        xmax: 13223239.012380214,
        ymax: 5095012.226398217
      },
      showFlag: true,
      mapViewId: 'widget_2editor-dataSource_1',
      mapDataSourceId: 'dataSource_1'
    }],
    autoPlayAllow: true,
    autoInterval: 3,
    autoLoopAllow: true,
    pageStyle: PageStyle.Paging,
    cardNameStyle: {
      fontFamily: FontFamilyValue.AVENIRNEXT,
      fontStyles: {
        style: 'normal',
        weight: 'normal',
        decoration: 'none'
      },
      fontColor: 'var(--black)',
      fontSize: '13'
    },
    slidesNameStyle: {
      fontFamily: FontFamilyValue.AVENIRNEXT,
      fontStyles: {
        style: 'normal',
        weight: 'bold',
        decoration: 'none'
      },
      fontColor: 'var(--black)',
      fontSize: '16'
    },
    slidesDescriptionStyle: {
      fontFamily: FontFamilyValue.AVENIRNEXT,
      fontStyles: {
        style: 'normal',
        weight: 'normal',
        decoration: 'none'
      },
      fontColor: 'var(--black)',
      fontSize: '13'
    }
  })

  const props = {
    config,
    dispatch: jest.fn()
  }

  it.only('double click bookmark item title should trigger the edit mode', () => {
    const ref: { current: HTMLElement } = { current: null }
    const Setting = wrapWidget(BookmarkSetting as any, { theme: fixedMockTheme, ref } as any)
    const { getByTitle, getByRole } = render(<Setting widgetId='bookmarkSettingTest1' useMapWidgetIds={Immutable(['widget_1'])} {...props} />)
    fireEvent.doubleClick(getByTitle('SettingTest-2'))
    const input = getByRole('textbox', { name: 'SettingTest-2' })
    expect(input).toBeInTheDocument()
  })
})
