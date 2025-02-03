import {
  type DataSource,
  dataSourceUtils,
  type IMThemeVariables,
  type SerializedStyles,
  css,
  type QueriableDataSource,
  type ClauseValuePair,
  type FeatureLayerDataSource
} from 'jimu-core'
import { type IDomain } from '@esri/arcgis-rest-request'
import { LayerHonorModeType, type LayersConfig, type Suggestion } from '../config'

export async function fetchSuggestionRecords (
  searchText: string,
  config: LayersConfig,
  dataSource: DataSource
): Promise<Suggestion[]> {
  const option = {
    searchText,
    searchFields: config?.searchFields || [],
    dataSource,
    exact: config?.searchExact
  }
  return dataSourceUtils.querySuggestions(option)
}

export function minusArray (array1, array2, key?: string) {
  const keyField = key || 'jimuName'
  const lengthFlag = array1.length > array2.length
  const arr1 = lengthFlag ? array1 : array2
  const arr2 = lengthFlag ? array2 : array1
  return arr1.filter(item => {
    const hasField = arr2.some(ele => {
      return ele?.[keyField] === item?.[keyField]
    })
    return !hasField
  })
}

export function getTimezone (dataSource) {
  return dataSourceUtils.getTimezoneAPIFromRuntime(dataSource.getTimezone())
}

export function getUsedFields (curLayer: LayersConfig, dataSource: QueriableDataSource) {
  if (!curLayer) return { popupAllFields: [], actionUsedFields: [] }
  const popupAllFields: ClauseValuePair[] = []
  if (dataSource) {
    const allFieldsSchema = dataSource?.getSchema()
    const schemaFieldsKeys = Object.keys(allFieldsSchema?.fields)
    const popupInfo = (dataSource as FeatureLayerDataSource)?.getPopupInfo()
    if (popupInfo) {
      const popupAllFieldInfos = popupInfo.fieldInfos || []
      const filteredPopupFieldInfos = popupAllFieldInfos.filter(item => schemaFieldsKeys.includes(item.fieldName))
      for (const item of filteredPopupFieldInfos) {
        if (item.visible) popupAllFields.push({ value: item.fieldName, label: item.label || item.fieldName })
      }
    } else {
      // if popupInfo is null, use definition or 'allFields' instead
      const layerDefinitionFields = (dataSource as FeatureLayerDataSource)?.getLayerDefinition()?.fields
      const useFields = layerDefinitionFields?.length > 0 ? layerDefinitionFields : curLayer.allFields
      const filteredUseFields = (useFields as any[]).filter(item => schemaFieldsKeys.includes(item.jimuName || item.name))
      for (const item of filteredUseFields) {
        popupAllFields.push({ value: item.name, label: item.alias || item.name })
      }
    }
  }
  const isHonorWebmap = curLayer.layerHonorMode === LayerHonorModeType.Webmap
  const actionUsedFields = isHonorWebmap ? popupAllFields.map(item => item.value as string) : curLayer.tableFields.map(item => item.jimuName)
  return { popupAllFields, actionUsedFields }
}

export function getGlobalTableTools (theme: IMThemeVariables): SerializedStyles {
  return css`
    .esri-button-menu__item .esri-button-menu__item-label{
      padding: 4px 15px !important;
    }
    .table-popup-search{
      .search-icon{
        z-index: 2;
      }
      .popup-search-input{
        border: 1px solid ${theme.ref.palette.neutral[500]};
        border-radius: 2px;
        .input-wrapper{
          height: 30px;
          border: none;
        }
      }
    }
    .table-action-option{
      width: 100%;
      display: inline-flex;
      flex-direction: row;
      .table-action-option-tab{
        margin: auto 8px;
      }
      .table-action-option-close{
        flex: 1;
        button{
          :hover {
            color: ${theme.ref.palette.white};
          }
          float: right;
        }
      }
    }
    .esri-popover--open{
      z-index: 1005 !important;
      .esri-date-picker__calendar{
        background-color: ${theme.ref.palette.white};
      }
    }
    .table-hide-hover-color{
      color: unset !important;
      border: none !important;
      &:hover{
        color: unset !important; /* use color of dropdown item */
      }
    }
  `
}

export function getFieldDomain (domain: IDomain): __esri.FieldProperties['domain'] {
  if (!domain) return null
  if (domain?.type === 'codedValue') {
    // for api fault-tolerant
    if (!domain?.codedValues || domain?.codedValues?.length === 0) {
      return null
    }
    return {
      ...domain,
      type: 'coded-value'
    }
  } else if (domain?.type === 'range') {
    return {
      ...domain,
      type: 'range'
    }
  } else if (domain?.type === 'inherited') {
    return {
      ...domain,
      type: 'inherited'
    }
  } else {
    return domain as __esri.FieldProperties['domain']
  }
}
