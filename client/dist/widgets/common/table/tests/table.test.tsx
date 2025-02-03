import {
  React,
  Immutable,
  appActions,
  lodash,
  BrowserSizeMode,
  getAppStore
} from 'jimu-core'
import TableWidget from '../src/runtime/widget'
import {
  mockTheme,
  wrapWidget,
  widgetRender,
  getInitState,
  mockSystemJs
} from 'jimu-for-test'
import { fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TableArrangeType } from '../src/config'
import {
  layerConfig,
  LayoutConfig,
  UseDataSources,
  Widgets
} from './config'
mockSystemJs()
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

jest.mock('jimu-arcgis', () => {
  return {
    ...jest.requireActual<any>('jimu-arcgis'),
    loadArcGISJSAPIModules: async () => {
      return await Promise.resolve([
        function () {
          return {
            fromJSON: () => {},
            clearSelection: () => {}
          }
        },
        function () {
          return { fromJSON: () => {} }
        }
      ])
    }
  }
})

jest.mock('jimu-ui', () => {
  return {
    ...jest.requireActual<any>('jimu-ui'),
    AdvancedSelect: jest.fn(() => <div data-testid='tableSelectTest' />)
  }
})

jest.mock('jimu-core', () => {
  return {
    ...jest.requireActual<any>('jimu-core'),
    ResizeObserver: jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    }))
  }
})

const initState = getInitState().merge({
  appContext: { isRTL: false },
  appConfig: {
    widgets: Widgets as any,
    layouts: LayoutConfig as any,
    dataSources: UseDataSources[0],
    dialogs: {},
    pages: {
      page_0: {
        id: 'page_0',
        isDefault: true,
        isVisible: true,
        label: 'Page',
        layout: {
          LARGE: 'layout_0'
        }
      }
    }
  }
})

getAppStore().dispatch(appActions.updateStoreState(initState))

describe('table test', function () {
  let render = null
  beforeAll(() => {
    render = widgetRender(false, mockTheme as any)
  })

  afterAll(() => {
    render = null
  })

  const config = Immutable({
    layersConfig: [layerConfig],
    arrangeType: TableArrangeType.Tabs,
    tableMode: 'LAYER'
  })

  let props = {
    id: 'widget2',
    config,
    browserSizeMode: BrowserSizeMode.Large
  }

  const mockTableFunction = {
    destroy: jest.fn(() => Promise.resolve()),
    refresh: jest.fn(() => Promise.resolve()),
    filterBySelection: jest.fn(() => Promise.resolve()),
    clearSelectionFilter: jest.fn(() => Promise.resolve()),
    clearSelection: jest.fn(() => Promise.resolve()),
    highlightIds: {
      add: jest.fn(() => Promise.resolve()),
      removeAll: jest.fn(() => Promise.resolve())
    }
  }

  const mockDsFunction = {
    getInfo: jest.fn(() => Promise.resolve()),
    getPopupInfo: jest.fn(() => {
      return { fieldInfos: [] }
    }),
    getIdField: jest.fn(() => 'OBJECTID'),
    getLayerDefinition: jest.fn(() => Promise.resolve()),
    updateQueryParams: jest.fn(() => Promise.resolve()),
    clearSelection: jest.fn(() => Promise.resolve()),
    getLabel: jest.fn(() => 'ds-label'),
    getCurrentQueryParams: jest.fn(() => Promise.resolve('1=1')),
    getSelectedRecords: jest.fn(() => [
      {
        dataSource: { id: 'dataSource_1-allFields_9212-selection' },
        feature: {}
      }
    ]),
    getSchema: jest.fn(() => {
      return {
        fields: {},
        filter: null,
        idField: 'OBJECTID',
        label: 'Hydrants'
      }
    })
  }

  it('show selection/all change test', () => {
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(TableWidget, { theme: mockTheme, ref } as any)
    const { getByTitle, rerender } = render(<Widget widgetId={'tableTest1'} {...props} />)
    const current = ref.current as any
    current.table = {
      grid: {
        highlightIds: {
          items: [3]
        }
      },
      layer: { definitionExpression: '' },
      menu: { open: false },
      ...mockTableFunction
    }
    current.setState({
      dataSource: mockDsFunction,
      fullLayersConfig: [layerConfig],
      activeTabId: 'test-1',
      tableLoaded: true,
      tableSelected: 1
    })
    rerender(<Widget widgetId='tableTest1' {...props} />)
    fireEvent.click(getByTitle('Show selection'))
    expect(current.table.filterBySelection).toHaveBeenCalled()
    expect(current.state.selectQueryFlag).toBe(true)
    expect(getByTitle('Show all')).toBeInTheDocument()
  })

  it('different table tab with same ds change tab', () => {
    const newLayerConfig = lodash.assign({}, layerConfig, {
      id: 'test-2',
      name: 'test-table-2'
    })
    const mutConfig = config.asMutable({ deep: true })
    mutConfig.layersConfig.push(newLayerConfig)
    const newProps = { ...props, config: Immutable(mutConfig), dispatch: jest.fn() }
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(TableWidget, { theme: mockTheme, ref } as any)
    const { getByTitle, rerender } = render(
      <Widget widgetId='tableTest2' {...newProps} />
    )
    const current = ref.current as any
    current.destroyTable = jest.fn(() => Promise.resolve())
    current.setState({
      dataSource: {
        id: 'dataSource_1-Hydrants_8477',
        ...mockDsFunction
      },
      fullLayersConfig: mutConfig.layersConfig,
      activeTabId: 'test-1'
    })
    rerender(<Widget widgetId='tableTest2' {...newProps} />)
    fireEvent.click(getByTitle('test-table-2'))
    expect(current.state.activeTabId).toEqual('test-2')
  })

  it('remove table should show the placeholder', () => {
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(TableWidget, { theme: mockTheme, ref } as any)
    const { getByTestId, rerender } = render(<Widget widgetId={'tableTest3'} {...props} />)
    const mutConfig = config.asMutable({ deep: true })
    mutConfig.layersConfig = []
    const newProps = { config: Immutable(mutConfig), dispatch: jest.fn() }
    rerender(<Widget widgetId='tableTest3' {...newProps} />)
    expect(getByTestId('tablePlaceholder')).toBeInTheDocument()
  })

  it('when sizeMode is small, search tool should be responsive', () => {
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(TableWidget, { theme: mockTheme, ref } as any)
    render( // getByTestId, getByTitle,
      <Widget widgetId='tableTest4' {...props} />
    )
    const current = ref.current as any
    current.setState({
      fullLayersConfig: [layerConfig],
      activeTabId: 'test-1',
      searchToolFlag: true
    })
    props = lodash.assign({}, props, { browserSizeMode: BrowserSizeMode.Small })
    // rerender(<Widget widgetId='tableTest4' {...props} />)
    // expect(getByTitle('search')).toBeInTheDocument()
    // fireEvent.click(getByTitle('search'))
    // expect(getByTestId('popper')).toBeInTheDocument()
  })

  it('clearSelection should clear table, refresh should keep selection', () => {
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(TableWidget, { theme: mockTheme, ref } as any)
    const { getByTitle, rerender } = render(<Widget widgetId={'tableTest5'} {...props} />)
    const current = ref.current as any
    current.setState({
      fullLayersConfig: [layerConfig],
      activeTabId: 'test-1',
      dataSource: mockDsFunction,
      tableLoaded: true
    })
    current.table = {
      grid: {
        selectedItems: {
          items: [
            {
              objectId: 5,
              feature: {
                attributes: {
                  OBJECTID: 5
                }
              }
            }
          ]
        }
      },
      layer: { definitionExpression: '' },
      menu: { open: false },
      ...mockTableFunction
    }
    rerender(<Widget widgetId='tableTest5' {...props} />)
    fireEvent.click(getByTitle('Show selection'))
    // expect(current.table.layer.definitionExpression).toBe('OBJECTID IN (5)')
    // expect(current.table.filterBySelection).toHaveBeenCalled()
    // expect(current.state.selectQueryFlag).toBe(true)
    // expect(getByTitle('Show all')).toBeInTheDocument()
    fireEvent.click(getByTitle('Clear selection'))
    expect(current.table.layer.definitionExpression).toBeFalsy()
    expect(current.state.selectQueryFlag).toBe(false)
    expect(getByTitle('Show selection')).toBeInTheDocument()

    rerender(<Widget widgetId='tableTest5' {...props} />)
    fireEvent.click(getByTitle('Refresh'))
    expect(current.table.refresh).toHaveBeenCalled()
    expect(current.table.layer.definitionExpression).toBeFalsy()
    expect(current.state.selectQueryFlag).toBe(false)
    expect(getByTitle('Show selection')).toBeInTheDocument()
  })

  it('button should be disabled in some condition', () => {
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(TableWidget, { theme: mockTheme, ref } as any)
    const { getByTitle, rerender } = render(
      <Widget widgetId='tableTest5' {...props} />
    )
    const current = ref.current as any
    current.setState({
      fullLayersConfig: [layerConfig],
      activeTabId: 'test-1',
      emptyTable: true
    })
    rerender(<Widget widgetId='tableTest5' {...props} />)
    expect(getByTitle('Show selection')).toBeDisabled()
    expect(getByTitle('Clear selection')).toBeDisabled()
    expect(getByTitle('Refresh')).toBeDisabled()
  })

  it('when unselect all fields, do not render table', () => {
    const newLayerConfig = lodash.assign({}, layerConfig, {
      tableFields: []
    })
    const mutConfig = config.asMutable({ deep: true })
    mutConfig.layersConfig.push(newLayerConfig)
    const newProps = { config: Immutable(mutConfig), dispatch: jest.fn() }
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(TableWidget, { theme: mockTheme, ref } as any)
    const { queryBySelector } = render(
      <Widget widgetId='tableTest6' {...newProps} />
    )
    expect(queryBySelector('.esri-feature-table__content')).not.toBeInTheDocument()
  })
})
