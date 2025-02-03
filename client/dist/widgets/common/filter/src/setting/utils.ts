import { Immutable, type ImmutableArray, type UseDataSource, type IMUseDataSource, type ImmutableObject, appConfigUtils } from 'jimu-core'
import { FilterItemType, type filterItemConfig } from '../config'

export const getGroupOrCustomName = (
  fItems: ImmutableArray<filterItemConfig>,
  currentFI: ImmutableObject<filterItemConfig>,
  itemType: FilterItemType,
  i18nMessage: any
): string => {
  let label
  if (currentFI) {
    label = currentFI.name
  } else {
    let index = 1
    const typeKey = itemType === FilterItemType.Group ? 'groupName' : 'customFilterName'
    if (fItems) {
      const indexList = []
      fItems.filter(item => item.type === itemType).forEach(item => {
        const groupPrefix = i18nMessage(typeKey, { num: '' }).trim()
        const [itemPrefix, num] = appConfigUtils.parseUniqueLabel(item.name)
        if (groupPrefix === itemPrefix && num) {
          indexList.push(num)
        }
      })
      if (indexList.length) {
        index = Math.max(...indexList) + 1
      }
    }
    label = i18nMessage(typeKey, { num: index })
  }
  return label
}

// Get useDataSources when filters of single item are changed.
// Note: need to update ds list and related use fields.
export const getUseDataSourcesBySingleFiltersChanged = (
  fItems: filterItemConfig[],
  dataSourceId: string,
  useDataSources: ImmutableArray<UseDataSource>
): ImmutableArray<UseDataSource> => {
  let newUseDss = useDataSources
  const newFields = getAllUsedFieldsByDataSourceId(fItems, dataSourceId)
  const isChanged = areUsedFieldsChanged(newFields, dataSourceId, useDataSources)
  if (isChanged) { // get latest useDss by update fields
    useDataSources.some((ds, index) => {
      if (ds.dataSourceId === dataSourceId) {
        newUseDss = (useDataSources as any).set(index, Immutable(ds).set('fields', newFields))
        return true
      }
      return false
    })
  }
  return newUseDss
}

// Get useDataSources when filters of group item are changed.
export const getUseDataSourcesByGroupFiltersChanged = (
  fItems: filterItemConfig[],
  itemUseDataSources: ImmutableArray<IMUseDataSource>,
  useDataSources: ImmutableArray<UseDataSource>
): ImmutableArray<UseDataSource> => {
  let newUseDssFor = useDataSources
  itemUseDataSources.forEach(useDs => {
    const newUseDs = getUseDataSourcesBySingleFiltersChanged(fItems, useDs.dataSourceId, useDataSources)
    if (newUseDs) {
      newUseDssFor = newUseDs
    }
  })
  return newUseDssFor
}

// Get useDss by remove action.
// Note: fItems doesn't include deleted item, or deleted ds.
export const getUseDataSourcesByRemovedAction = (
  fItems: filterItemConfig[],
  itemUseDataSources: ImmutableArray<IMUseDataSource>,
  useDataSources: ImmutableArray<UseDataSource>
) => {
  let wJsonUseDss = useDataSources
  itemUseDataSources.forEach(useDs => {
    const useDSs = getUseDataSourcesByRemovedDsId(fItems, useDs.dataSourceId, wJsonUseDss)
    if (useDSs) {
      wJsonUseDss = useDSs
    }
  })
  return wJsonUseDss
}

// Save new useDs to props.useDataSource if it's not existed.

export const getUseDataSourcesByDssAdded = (
  fItems: filterItemConfig[],
  addedUseDataSources: UseDataSource[],
  useDataSources: ImmutableArray<UseDataSource>,
  // previousDsId?: string
  previousFItem?: ImmutableObject<filterItemConfig>
): ImmutableArray<UseDataSource> => {
  let useDss = useDataSources || Immutable([])

  // Remove previous ds & fields for single filter, remove previous dss' fields for group item.
  // For case: change ds for single filter item, add ds for group item.
  if (previousFItem) {
    if (previousFItem.type === FilterItemType.Group) { // TODO: For group, it might need to keep fields when dss are changed.
      previousFItem.useDataSources.forEach(useDs => {
        useDss = getUseDataSourcesBySingleFiltersChanged(fItems, useDs.dataSourceId, useDss)
      })
    } else { // remove previous useDs
      const dsId = previousFItem.useDataSources[0].dataSourceId
      useDss = getUseDataSourcesByRemovedDsId(fItems, dsId, useDataSources)
    }
  }

  addedUseDataSources.forEach(addedUseDs => {
    // check if the dss of current item is in useDss
    const isInUseDss = useDss.filter(useDs => addedUseDs.dataSourceId === useDs.dataSourceId).length > 0
    if (!isInUseDss) {
      useDss = useDss.concat(addedUseDs)
    }
  })
  return useDss
}

// Get all used fields of current ds from latest fItems
const getAllUsedFieldsByDataSourceId = (
  fItems: filterItemConfig[],
  dataSourceId: string
): string[] => {
  let fields = []
  fItems.forEach(item => {
    item.useDataSources.some(ds => {
      if (ds.dataSourceId === dataSourceId && ds.fields) {
        fields = fields.concat(ds.fields)
        return true
      }
      return false
    })
  })
  fields = Array.from(new Set(fields)).sort()
  return fields
}

// Check if a dataSource's used fields are changed by comparing sorted fields.
const areUsedFieldsChanged = (
  fields: string[],
  dataSourceId: string,
  useDataSources: ImmutableArray<UseDataSource>
): boolean => {
  // useDs could be undefined when ds is invalid.
  const previousFields = useDataSources.filter(useDs => dataSourceId === useDs.dataSourceId)[0]?.fields?.asMutable({ deep: true }) || []
  const isFieldsChanged = JSON.stringify(fields) !== JSON.stringify(previousFields)
  return isFieldsChanged
}

// Get useDss by removed ds id.
const getUseDataSourcesByRemovedDsId = (
  fItems: filterItemConfig[],
  dataSourceId: string,
  useDataSources: ImmutableArray<UseDataSource>
) => {
  if (isDsShared(fItems, dataSourceId)) {
    return getUseDataSourcesBySingleFiltersChanged(fItems, dataSourceId, useDataSources)
  } else { // Remove useDs
    return useDataSources.filter(useDs => useDs.dataSourceId !== dataSourceId)
  }
}

// Check if current ds is shared with other filter items.
const isDsShared = (
  fItems: filterItemConfig[],
  dataSourceId: string
) => {
  let isShared = false
  fItems.some(item => {
    if (item.useDataSources.filter(ds => ds.dataSourceId === dataSourceId).length > 0) {
      isShared = true
      return true
    }
    return false
  })
  return isShared
}
