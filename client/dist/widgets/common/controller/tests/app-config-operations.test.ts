import { appActions, AppMode, BrowserSizeMode, getAppStore, IdManager, Immutable, type LayoutItemConstructorProps, LayoutParentType, LayoutType, type WidgetManifest, WidgetType } from 'jimu-core'
import AppConfigOperations from '../src/tools/app-config-operations'
import { BaseLayoutService, getAppConfigAction, LayoutServiceProvider } from 'jimu-for-builder'
import { getInitState } from 'jimu-for-test'
import { insertWidgetToLayout, groupWidgetsInAccordion, removeLayoutItem, applyChangeToOtherSizeModes } from '../src/runtime/builder/utils'

const ext = new AppConfigOperations()
ext.widgetId = 'w1'

describe('app config operations test', () => {
  it('controller widget with auto open config', () => {
    let appConfig: any = Immutable({
      widgets: {
        w1: {
          id: 'w1',
          label: 'W1',
          manifest: { name: 'controller', properties: { hasEmbeddedLayout: true } },
          layouts: {
            controller: {
              LARGE: 'l1'
            }
          },
          config: {
            behavior: {
              openStarts: ['w2', 'w3']
            }
          }
        },
        w2: { manifest: { properties: {} } },
        w3: { manifest: { properties: {} } }
      },
      layouts: {
        l1: {
          id: 'l1',
          order: ['0', '1'],
          content: {
            0: {
              type: 'WIDGET',
              widgetId: 'w2'
            },
            1: {
              type: 'WIDGET',
              widgetId: 'w3'
            }
          }
        }
      }
    })

    const copiedWidget = {
      id: 'w4',
      label: 'W4',
      manifest: { name: 'controller', properties: { hasEmbeddedLayout: true } },
      layouts: {
        controller: {
          LARGE: 'l2'
        }
      },
      config: {
        behavior: {
          openStarts: ['w2', 'w3']
        }
      }
    }

    const l2 = {
      id: 'l2',
      order: ['0', '1'],
      content: {
        0: {
          type: 'WIDGET',
          widgetId: 'w5'
        },
        1: {
          type: 'WIDGET',
          widgetId: 'w6'
        }
      }
    }
    appConfig = appConfig
      .setIn(['layouts', 'l2'], l2)
      .setIn(['widgets', 'w4'], copiedWidget)
      .setIn(['widgets', 'w5'], { manifest: { properties: {} } })
      .setIn(['widgets', 'w6'], { manifest: { properties: {} } })

    appConfig = ext.afterWidgetCopied('w1', appConfig, 'w4', appConfig)
    const w4 = appConfig.widgets.w4
    expect(w4.config.behavior.openStarts).toEqual(['w5', 'w6'])
  })
  it('remove empty layout items and sync large to small', () => {
    const appConfig: any = Immutable({
      mainSizeMode: 'LARGE',
      widgets: {
        w1: {
          id: 'w1',
          label: 'Controller',
          manifest: { name: 'controller', properties: { hasEmbeddedLayout: true } },
          layouts: {
            controller: {
              LARGE: 'l1',
              SMALL: 'l2'
            }
          }
        },
        w2: {
          manifest: { properties: {} },
          parent: {
            LARGE: [
              {
                layoutId: 'l1',
                layoutItemId: '1'
              }
            ]
          }
        },
        w3: {
          id: 'w3',
          label: 'Group',
          icon: 'icon string',
          config: { useQuickStyle: 3 },
          manifest: { name: 'accordion', properties: { hasEmbeddedLayout: true } },
          layouts: {
            DEFAULT: {
              LARGE: 'l3'
            }
          },
          parent: {
            LARGE: [
              {
                layoutId: 'l1',
                layoutItemId: '2'
              }
            ]
          }
        }
      },
      layouts: {
        l1: {
          id: 'l1',
          order: ['0', '1', '2'],
          content: {
            0: { id: '0', type: 'WIDGET' },
            1: { id: '1', type: 'WIDGET', widgetId: 'w2' },
            2: { id: '2', type: 'WIDGET', widgetId: 'w3' }
          }
        },
        l2: {
          id: 'l2',
          order: [],
          content: {}
        },
        l3: {
          id: 'l3',
          order: ['0'],
          content: {
            0: { id: '0', type: 'WIDGET' }
          }
        }
      }
    })

    const updatedAppConfig = ext.appConfigWillChange(appConfig)
    // empty layout items should be cleared
    const l1 = updatedAppConfig.layouts.l1
    expect(l1.order.indexOf('0')).toBe(-1)
    expect(l1.content['0']).toBeUndefined()
    const l3 = updatedAppConfig.layouts.l1
    expect(l3.order.indexOf('0')).toBe(-1)
    expect(l3.content['0']).toBeUndefined()
    // large size layout should be synced to small size
    const controllerWidget = updatedAppConfig.widgets.w1
    const smallControllerLayoutId = controllerWidget.layouts.controller.SMALL
    const smallControllerLayout = updatedAppConfig.layouts[smallControllerLayoutId]
    expect(smallControllerLayout.order).toStrictEqual(['1', '2'])
    expect(smallControllerLayout.content['1'].widgetId).toBe('w2')
    expect(smallControllerLayout.content['2'].widgetId).toBe('w3')
  })
})

class DefaultLayoutService extends BaseLayoutService {
  processAfterItemAdded (appConfig) {
    return appConfig
  }

  getToolItems () {
    return []
  }
}

const service = new DefaultLayoutService()
LayoutServiceProvider.getInstance().registerService(LayoutType.FixedLayout, service)
LayoutServiceProvider.getInstance().registerService(LayoutType.AccordionLayout, service)
describe('add, remove, sort, group widgets in controller', () => {
  const initAppConfig: any = Immutable({
    widgets: {
      widget_1: {
        id: 'widget_1',
        layouts: {
          controller: {
            LARGE: 'layout_1',
            SMALL: 'layout_2'
          }
        },
        manifest: {
          properties: {
            passDataSourceToChildren: true
          }
        }
      }
    },
    layouts: {
      layout_1: {
        id: 'layout_1',
        type: 'FIXED',
        content: {},
        order: [],
        parent: { type: LayoutParentType.Widget, id: 'widget_1' }
      },
      layout_2: {
        id: 'layout_2',
        type: 'FIXED',
        content: {},
        order: [],
        parent: { type: LayoutParentType.Widget, id: 'widget_1' }
      }
    },
    placeholderInfos: {},
    mainSizeMode: 'LARGE'
  })

  const initState = getInitState().merge({ appRuntimeInfo: { appMode: AppMode.Express }, appConfig: initAppConfig })
  getAppStore().dispatch(appActions.updateStoreState(initState))
  IdManager.getInstance().initIdCounter(initAppConfig)
  window.widgetsManifest = {
    'widgets/common/button/': { uri: 'widgets/common/button/', properties: { hasConfig: false } } as unknown as WidgetManifest,
    'widgets/common/image/': { uri: 'widgets/common/image/', properties: { hasConfig: false } } as unknown as WidgetManifest,
    'widgets/common/text/': { uri: 'widgets/common/text/', properties: { hasConfig: false } } as unknown as WidgetManifest,
    'widgets/layout/accordion/': {
      uri: 'widgets/layout/accordion/',
      properties: { hasConfig: false },
      widgetType: WidgetType.Layout,
      layouts: [{
        name: 'DEFAULT',
        label: 'Default',
        type: 'ACCORDION'
      }]
    } as unknown as WidgetManifest
  }
  window.isExpressBuilder = true
  window.jimuConfig = { isInBuilder: true } as any

  function syncSmall () {
    const appConfigAction = getAppConfigAction()
    applyChangeToOtherSizeModes(appConfigAction, 'widget_1', BrowserSizeMode.Small)
    appConfigAction.exec()
  }

  it('should apply operations in LARGE to SMALL in express mode', async () => {
    // add widgets
    let appConfig = getAppStore().getState().appConfig
    await insertWidgetToLayout(appConfig.layouts.layout_1, { uri: 'widgets/common/button/' } as LayoutItemConstructorProps, 0)
    await insertWidgetToLayout(appConfig.layouts.layout_1, { uri: 'widgets/common/image/' } as LayoutItemConstructorProps, 1)
    await insertWidgetToLayout(appConfig.layouts.layout_1, { uri: 'widgets/common/text/' } as LayoutItemConstructorProps, 2)
    syncSmall()
    appConfig = getAppStore().getState().appConfig
    let controllerLayouts = appConfig.widgets.widget_1.layouts.controller
    let largeControllerLayout = appConfig.layouts[controllerLayouts.LARGE]
    let smallControllerLayout = appConfig.layouts[controllerLayouts.SMALL]
    let w2 = appConfig.widgets.widget_2
    expect(w2.uri).toBe('widgets/common/button/')
    expect(largeControllerLayout.content[0].widgetId).toBe('widget_2')
    expect(smallControllerLayout.content[0].widgetId).toBe('widget_2')
    const w3 = appConfig.widgets.widget_3
    expect(w3.uri).toBe('widgets/common/image/')
    expect(largeControllerLayout.content[1].widgetId).toBe('widget_3')
    expect(smallControllerLayout.content[1].widgetId).toBe('widget_3')
    let w4 = appConfig.widgets.widget_4
    expect(w4.uri).toBe('widgets/common/text/')
    expect(largeControllerLayout.content[2].widgetId).toBe('widget_4')
    expect(smallControllerLayout.content[2].widgetId).toBe('widget_4')
    // sort widgets
    expect(largeControllerLayout.order).toStrictEqual(['0', '1', '2'])
    expect(smallControllerLayout.order).toStrictEqual(['0', '1', '2'])
    await insertWidgetToLayout(appConfig.layouts.layout_1, { layoutInfo: { layoutId: 'layout_1', layoutItemId: '0' } } as LayoutItemConstructorProps, 1)
    syncSmall()
    appConfig = getAppStore().getState().appConfig
    controllerLayouts = appConfig.widgets.widget_1.layouts.controller
    largeControllerLayout = appConfig.layouts[controllerLayouts.LARGE]
    smallControllerLayout = appConfig.layouts[controllerLayouts.SMALL]
    expect(largeControllerLayout.order).toStrictEqual(['1', '0', '2'])
    expect(smallControllerLayout.order).toStrictEqual(['1', '0', '2'])
    // group widgets
    const sourceItem = {
      manifest: {},
      layoutInfo: {
        layoutId: 'layout_1',
        layoutItemId: '0'
      }
    } as LayoutItemConstructorProps
    const targetItem = {
      manifest: {},
      layoutInfo: {
        layoutId: 'layout_1',
        layoutItemId: '1'
      }
    } as LayoutItemConstructorProps
    await groupWidgetsInAccordion(largeControllerLayout, sourceItem, 1, targetItem, 0, true)
    syncSmall()
    appConfig = getAppStore().getState().appConfig
    w2 = appConfig.widgets.widget_2
    controllerLayouts = appConfig.widgets.widget_1.layouts.controller

    const w2LargeLayoutInfo = w2.parent.LARGE[0]
    const largeAccordionLayout = appConfig.layouts[w2LargeLayoutInfo.layoutId]
    expect(largeAccordionLayout.content[w2LargeLayoutInfo.layoutItemId].widgetId).toBe('widget_2')
    const largeAccordionWidgetId = largeAccordionLayout.parent.id
    const largeAccordionWidget = appConfig.widgets[largeAccordionWidgetId]
    const largeAccordionLayoutInfo = largeAccordionWidget.parent.LARGE[0]
    expect(largeAccordionLayoutInfo.layoutId).toBe(controllerLayouts.LARGE)
    largeControllerLayout = appConfig.layouts[controllerLayouts.LARGE]
    expect(largeControllerLayout.content[largeAccordionLayoutInfo.layoutItemId].widgetId).toBe(largeAccordionWidgetId)

    const w2SmallLayoutInfo = w2.parent.SMALL[0]
    const smallAccordionLayout = appConfig.layouts[w2SmallLayoutInfo.layoutId]
    expect(smallAccordionLayout.content[w2SmallLayoutInfo.layoutItemId].widgetId).toBe('widget_2')
    const smallAccordionWidgetId = smallAccordionLayout.parent.id
    const smallAccordionWidget = appConfig.widgets[smallAccordionWidgetId]
    const smallAccordionLayoutInfo = smallAccordionWidget.parent.SMALL[0]
    expect(smallAccordionLayoutInfo.layoutId).toBe(controllerLayouts.SMALL)
    smallControllerLayout = appConfig.layouts[controllerLayouts.SMALL]
    expect(smallControllerLayout.content[smallAccordionLayoutInfo.layoutItemId].widgetId).toBe(smallAccordionWidgetId)

    // remove widgets
    appConfig = getAppStore().getState().appConfig
    w4 = appConfig.widgets.widget_4
    const w4LargeLayoutInfo = w4.parent.LARGE[0]
    const w4SmallLayoutInfo = w4.parent.SMALL[0]
    removeLayoutItem(w4LargeLayoutInfo, 'widget_1')
    syncSmall()
    appConfig = getAppStore().getState().appConfig
    expect(appConfig.layouts[w4LargeLayoutInfo.layoutId].content[w4LargeLayoutInfo.layoutItemId].widgetId).toBeUndefined()
    expect(appConfig.layouts[w4SmallLayoutInfo.layoutId]).toBeUndefined()
  })
})
