import { getAppStore, indexedDBUtils, utils } from 'jimu-core'
import { DB_VERSION, STORES } from '../../../constants'

export async function getDataByCursor (trackIndexedDB, direction = 'prev') {
  return new Promise((resolve, reject) => {
    const transaction = trackIndexedDB.db.transaction([trackIndexedDB.storeName], 'readonly')
    const objectStore = transaction.objectStore(trackIndexedDB.storeName)
    const myIndex = trackIndexedDB.indexName ? objectStore.index(trackIndexedDB.indexName) : objectStore

    const list = []

    const cursorRequest = direction ? myIndex.openCursor(null, direction) : myIndex.openCursor()

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        list.push(cursor.value)
        cursor.continue()
      } else {
        trackIndexedDB.close()
        resolve(list)
      }
    }

    cursorRequest.onerror = (event) => {
      trackIndexedDB.close()
      reject(event.target.error)
    }
  })
}
export interface storeScheme {
  storeName: string
  indexName: string
  indexKey: string
  keyPath: string
}

/**
 * create db and stores
 * @param version db version
 * @param dbName db name
 * @param stores store list
 * @returns void
 */
export function createDBAndStores (version, dbName, stores: storeScheme[]) {
  // support the version
  const request = indexedDB.open(dbName, version)
  request.onupgradeneeded = () => {
    const db = request.result
    // If the db doesn't contain the store, will create it.

    stores.forEach(element => {
      if (!db.objectStoreNames.contains(element.storeName)) {
        createStore(db, element.storeName, element.indexName, element.indexKey, element.keyPath)
      }
    })
  }

  return indexedDBUtils.whenRequest(request)
}

/**
 * create store
 * @param db IndexedDB
 * @param storeName storeName
 * @param indexName IndexName
 * @param indexKey indexKey
 * @param keyPath keyPath
 */
function createStore (db, storeName, indexName, indexKey, keyPath) {
  //support the keyPath
  let objectStore
  if (keyPath) {
    objectStore = db.createObjectStore(storeName, { keyPath: keyPath })
  } else {
    objectStore = db.createObjectStore(storeName, { autoIncrement: true })
  }
  //support the index
  if (indexName) {
    objectStore.createIndex(indexName, indexKey)
  }
}

// delete db
export function deleteDB (name: string) {
  utils.removeFromLocalStorage(STORES[0].storeName)
  utils.removeFromLocalStorage(STORES[1].storeName)
  utils.removeFromLocalStorage(STORES[2].storeName)
  const request = indexedDB.deleteDatabase(name)
  return indexedDBUtils.whenRequest(request)
}

// clear store
export async function clearStore (widgetId, widgetLabel, index: number): Promise<void> {
  const db = new indexedDBUtils.IndexedDBCache(widgetId, widgetLabel, STORES[index].storeName, DB_VERSION, STORES[index].indexName, STORES[index].indexKey, STORES[index].keyPath)
  await db.init().catch((error) => {
    return Promise.reject('Error init store')
  })
  if (db && db.initialized()) {
    return db.clear()
  } else {
    return Promise.reject('Error init db')
  }
}
// delete item
export async function deleteObjectsByKeys (widgetId, widgetLabel, index: number, keys: number[]): Promise<void> {
  const db = new indexedDBUtils.IndexedDBCache(widgetId, widgetLabel, STORES[index].storeName, DB_VERSION, STORES[index].indexName, STORES[index].indexKey, STORES[index].keyPath)
  await db.init().catch((error) => {
    db.close()
    return Promise.reject('Error init store')
  })
  if (db && db.initialized()) {
    const result = db.deleteAll(keys)
    db.close()
    return result
  }
  return Promise.reject('Error init db')
}

// insert item
export async function insertObjectsToStore (widgetId, widgetLabel, index: number, objects: object[]): Promise<void> {
  const db = new indexedDBUtils.IndexedDBCache(widgetId, widgetLabel, STORES[index].storeName, DB_VERSION, STORES[index].indexName, STORES[index].indexKey, STORES[index].keyPath)
  await db.init().catch((error) => {
    db.close()
    return Promise.reject('Error init store')
  })
  if (db && db.initialized()) {
    const result = db.putAllObject(objects)
    db.close()
    return result
  }
  return Promise.reject('Error init db')
}
/**
 * create indexded db name
 * @param widgetId widget id
 * @param widgetName widget name
 * @returns indexded db name
 */
export function getDBName (widgetId: string, widgetName: string): string {
  const appId = window.jimuConfig?.isBuilder ? getAppStore().getState().appStateInBuilder?.appId : getAppStore().getState().appId
  return `exb-${appId}-${widgetName}-${widgetId}-cache`
}

/**
 * get data from db by index filter
* @param trackIndexedDB IndexedDB
 * @param filterField index Field
 * @param filterValue index filter value
 * @param sortBy sort filed
 * @returns array datas
 */
export async function queryAndSortObjectStore (trackIndexedDB, filterField, filterValue, sortBy) {
  const datas = []
  return new Promise((resolve, reject) => {
    const transaction = trackIndexedDB.db.transaction([trackIndexedDB.storeName], 'readonly')
    const objectStore = transaction.objectStore(trackIndexedDB.storeName)
    const index = objectStore.index(trackIndexedDB.indexName)
    const condition = IDBKeyRange.only(filterValue)
    const request = index.openCursor(condition)

    request.onsuccess = function (event) {
      const cursor = event.target.result

      if (cursor) {
        // if (cursor.value[filterField] === filterValue) {
        datas.push(cursor.value)
        // }
        cursor.continue()
      } else {
        datas.sort((a, b) => b[sortBy] - a[sortBy]) // Assuming numeric sorting, adjust as needed
        trackIndexedDB.close()
        resolve(datas)
      }
    }

    request.onerror = function (event) {
      trackIndexedDB.close()
      reject(event.target.error)
    }
  })
}

// check db existence
export function checkDatabaseExistence (dbName) {
  return new Promise((resolve, reject) => {
    if (!indexedDB.databases) {
      const request = indexedDB.open(dbName)
      let existed = true

      request.onupgradeneeded = function () {
        existed = false
        request.transaction.abort()
      }

      request.onsuccess = function () {
        request.result.close()
        resolve(existed)
      }

      request.onerror = function () {
        resolve(false)
      }
    } else {
      indexedDB.databases().then(function (dbs) {
        const exists = dbs.some(function (db) {
          return db.name === dbName
        })
        resolve(exists)
      }).catch(function (error) {
        resolve(false)
      })
    }
  })
}

/**
 * delete useless dbs
 * @param {string} widgetName
 */
export async function clearUselessDB (widgetName: string) {
  const dbNames = await listIndexedDBDatabases()
  const appWidgets = getAppStore().getState()?.appConfig?.widgets
  if (appWidgets !== undefined) {
    const trackWidgetsIds = Object.keys(appWidgets).filter(widgitId => appWidgets[widgitId].manifest.name === widgetName)
    const appDBNames = trackWidgetsIds.map(widgetId => getDBName(widgetId, widgetName))
    dbNames.forEach(name => {
      if (!appDBNames.includes(name)) {
        deleteDB(name)
      }
    })
  }
}
/**
 * get all indexed db names in the browser
 * @returns {Array<string>} indexed db names
 */
async function listIndexedDBDatabases (): Promise<string[]> {
  if (typeof indexedDB.databases === 'function') {
    const databases = await indexedDB.databases()
    return databases.map(db => db.name || '')
  } else {
    return []
  }
}
