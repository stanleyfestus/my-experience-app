import { React, hooks, Immutable, type UseDataSource, DataSourceManager, dataSourceUtils, type ImmutableArray } from 'jimu-core'
import defaultMessages from '../translations/default'
import { defaultMessages as jimuUIMessages, TextArea, Button, TextInput } from 'jimu-ui'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import { SqlExpressionBuilderPopup } from 'jimu-ui/advanced/sql-expression-builder'
import { type DataSourceItem } from '../../config'
import { type RootSettingProps, getUseDataSourcesByConfig, checkIsValidNewUseDataSourceForDataAttributeInfo } from '../utils'
import { IM_SUPPORTED_DATA_SOURCE_TYPES } from '../../utils'

export interface DataSourceItemDetailProps {
  rootSettingProps: RootSettingProps
  currentDataSourceItem: DataSourceItem
}

/**
 * Configure sqlHint and sqlExpression for one data source.
 */
export default function DataSourceItemDetail (props: DataSourceItemDetailProps): React.ReactElement {
  const [isSqlBuilderPopupVisible, setSqlBuilderPopupVisible] = React.useState<boolean>(false)

  const {
    rootSettingProps,
    currentDataSourceItem
  } = props

  const {
    id: widgetId,
    config
  } = rootSettingProps

  const translate = hooks.useTranslation(jimuUIMessages, defaultMessages)

  const imDataSourceItem = Immutable(currentDataSourceItem)
  const imUseDataSources = Immutable([currentDataSourceItem.useDataSource])
  const sqlHint = currentDataSourceItem.sqlHint || ''
  const dataSource = DataSourceManager.getInstance().getDataSource(currentDataSourceItem.useDataSource.dataSourceId)
  let displaySQL = imDataSourceItem.sqlExpression?.displaySQL || ''

  if (imDataSourceItem.sqlExpression && dataSource) {
    displaySQL = dataSourceUtils.getArcGISSQL(imDataSourceItem.sqlExpression, dataSource)?.displaySQL
  }

  displaySQL = displaySQL || ''

  const onDataSourceItemUpdate = React.useCallback((newImDataSourceItem: Immutable.ImmutableObject<DataSourceItem>) => {
    const newDataSourceItems = config.dataAttributeInfo.dataSourceItems.map((item) => {
      if (item.uid === currentDataSourceItem.uid) {
        return newImDataSourceItem
      } else {
        return item
      }
    })

    const newConfig = config.setIn(['dataAttributeInfo', 'dataSourceItems'], newDataSourceItems)
    const useDataSources = getUseDataSourcesByConfig(newConfig)
    rootSettingProps.onSettingChange({
      id: widgetId,
      config: newConfig,
      useDataSources
    })
  }, [config, currentDataSourceItem.uid, rootSettingProps, widgetId])

  // change data source, try to change imDataSourceItem.useDataSource to newUseDataSource
  const onDataSourceChange = React.useCallback((evtUseDataSources: UseDataSource[]) => {
    const newUseDataSource = evtUseDataSources && evtUseDataSources[0]

    if (!newUseDataSource) {
      return
    }

    const currPropDataSourceId = imDataSourceItem?.useDataSource?.dataSourceId
    let filteredDataSourceItems: ImmutableArray<DataSourceItem> = null

    if (currPropDataSourceId) {
      // imDataSourceItem.useDataSource is going to replaced by newUseDataSource, so we need to filter it before validate the newUseDataSource.
      filteredDataSourceItems = config.dataAttributeInfo.dataSourceItems.filter(dataSourceItem => {
        return dataSourceItem.useDataSource?.dataSourceId !== currPropDataSourceId
      })
    } else {
      filteredDataSourceItems = config.dataAttributeInfo.dataSourceItems
    }

    const isValidNewUseDataSource = checkIsValidNewUseDataSourceForDataAttributeInfo(filteredDataSourceItems, newUseDataSource)

    if (!isValidNewUseDataSource) {
      return
    }

    // When user selects a new data source, needs to reset sqlExpression to null.
    const newItem = imDataSourceItem.set('useDataSource', newUseDataSource).set('sqlExpression', null)
    onDataSourceItemUpdate(newItem)
  }, [imDataSourceItem, onDataSourceItemUpdate, config])

  // sqlHint is changed
  const onSqlHintChange = React.useCallback((evt) => {
    const newLabel = evt.target.value
    const newItem = imDataSourceItem.set('sqlHint', newLabel)
    onDataSourceItemUpdate(newItem)
  }, [imDataSourceItem, onDataSourceItemUpdate])

  const onClickSqlBuilderButton = React.useCallback(() => {
    setSqlBuilderPopupVisible(true)
  }, [setSqlBuilderPopupVisible])

  // SqlExpressionBuilderPopup is closed.
  const onSqlExpressionBuilderPopupToggle = React.useCallback(() => {
    setSqlBuilderPopupVisible(false)
  }, [setSqlBuilderPopupVisible])

  const onSqlExpressionBuilderPopupChange = React.useCallback((sqlExpression) => {
    const newItem = imDataSourceItem.set('sqlExpression', sqlExpression)
    onDataSourceItemUpdate(newItem)
  }, [imDataSourceItem, onDataSourceItemUpdate])

  return (
    <div>
      <SettingSection title={translate('sourceLabel')}>
        <SettingRow>
          <DataSourceSelector
            widgetId={widgetId}
            isMultiple={false}
            types={IM_SUPPORTED_DATA_SOURCE_TYPES}
            mustUseDataSource
            hideDataView={true}
            hideCreateViewButton={true}
            useDataSources={imUseDataSources}
            onChange={onDataSourceChange}
            disableRemove={() => true}
          />
        </SettingRow>
      </SettingSection>

      <SettingSection title={translate('labelForAttribution')}>
        <SettingRow>
          <TextInput
            className='w-100'
            size='sm'
            value={sqlHint}
            placeholder={translate('addAttributionTip')}
            onChange={onSqlHintChange}
          />
        </SettingRow>
      </SettingSection>

      <SettingSection title={translate('sqlExpr')}>
        <SettingRow flow='wrap' truncateLabel label={translate('addSqlExprForSelection')}>
          <Button
            className='w-100 text-default set-link-btn'
            type={'primary'}
            disabled={false}
            onClick={onClickSqlBuilderButton}
            title={translate('sqlExpressionBuilder')}
          >
            {translate('sqlExpressionBuilder')}
          </Button>
        </SettingRow>

        <SettingRow>
          <TextArea
            height={80}
            value={displaySQL}
            spellCheck={false}
            readOnly
            placeholder={translate('addSqlExprFirst')}
            onClick={(e) => { e.currentTarget.select() }}
          />
        </SettingRow>

        {
          dataSource &&
          <SqlExpressionBuilderPopup
            dataSource={dataSource}
            isOpen={isSqlBuilderPopupVisible}
            toggle={onSqlExpressionBuilderPopupToggle}
            expression={imDataSourceItem.sqlExpression}
            onChange={onSqlExpressionBuilderPopupChange}
          />
        }
      </SettingSection>
    </div>
  )
}
