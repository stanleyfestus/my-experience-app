import { ExtensionManager, extensionSpec, getAppStore, appActions, DataSourceTypes } from 'jimu-core'
import { ArcGISDependencyDefineExtension, ArcGISDataSourceFactoryUriExtension } from 'jimu-arcgis'
import { initGlobal, getInitState, getDefaultAppConfig } from './lib/init-state'
import * as mockData from './lib/mock-data'

export * from './lib/widget-wrapper'
export * from './lib/widget-setting-wrapper'
export * from './lib/test-utils'
export * from './lib/mock-service'
export * from './lib/mock-item'
export * from './lib/mock-get-selections'
export * from './lib/mock-systemjs'
export * from './lib/mock-window-location'
export * from './lib/mock-numeric-input'
export { mockData, initGlobal, getInitState, getDefaultAppConfig }
export * from './lib/mock-js-api'
export * from './lib/mock-indexed-db'

export function updateStore (storeItem) {
  let appState = getInitState()
  appState = appState.merge(storeItem)
  getAppStore().dispatch(appActions.updateStoreState(appState))
}

/**
 * Init extensions. Will init `DependencyDefine` and `DataSourceFactoryUri`.
 */
export function initExtensions () {
  ExtensionManager.getInstance().registerExtension({
    epName: extensionSpec.ExtensionPoints.DependencyDefine,
    extension: new ArcGISDependencyDefineExtension()
  })
  ExtensionManager.getInstance().registerExtension({
    epName: extensionSpec.ExtensionPoints.DataSourceFactoryUri,
    extension: new ArcGISDataSourceFactoryUriExtension()
  })

  // jimu-core does not export this class, so we define it here.
  class JimuCoreDataSourceFactoryUriExtension implements extensionSpec.DataSourceFactoryUriExtension {
    id = 'jimu-core-ds-factory'

    getFactoryUri (dataSourceType): string {
      if (Object.keys(DataSourceTypes).map(t => DataSourceTypes[t]).includes(dataSourceType)) {
        return 'jimu-core/data-source'
      }
    }
  }
  ExtensionManager.getInstance().registerExtension({
    epName: extensionSpec.ExtensionPoints.DataSourceFactoryUri,
    extension: new JimuCoreDataSourceFactoryUriExtension()
  })
}

/** Init store with default app config. */
export function initStore () {
  getAppStore().dispatch(appActions.updateStoreState(getInitState().merge({ appConfig: getDefaultAppConfig() })))
}

export { default as mockTheme } from './lib/theme-mock'
