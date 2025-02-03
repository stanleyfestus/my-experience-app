import { React, hooks, Immutable, type DataSource, dataSourceUtils } from 'jimu-core'
import defaultMessages from '../translations/default'
import { defaultMessages as jimuUIMessages, TextArea, Button, TextInput } from 'jimu-ui'
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import { SqlExpressionBuilderPopup } from 'jimu-ui/advanced/sql-expression-builder'
import { type DataSourceItem, type IMDataSourceItem } from '../../config'
import { type JimuMapView } from 'jimu-arcgis'

export interface LayerItemDetailProps {
  jimuMapView: JimuMapView
  currentDataSourceItem: DataSourceItem
  onLayerItemDetailUpdate: (newIMDataSourceItem: IMDataSourceItem) => void
}

/**
 * Configure sqlHint and sqlExpression for one layer.
 */
export default function LayerItemDetail (props: LayerItemDetailProps): React.ReactElement {
  const {
    jimuMapView,
    currentDataSourceItem,
    onLayerItemDetailUpdate: onLayerItemDetailUpdateProp
  } = props

  const {
    jimuLayerViewId
  } = currentDataSourceItem

  const jimuLayerView = jimuMapView.jimuLayerViews[jimuLayerViewId]
  const imDataSourceItem = Immutable(currentDataSourceItem)
  const sqlHint = imDataSourceItem.sqlHint || ''

  const translate = hooks.useTranslation(jimuUIMessages, defaultMessages)

  const [isSqlBuilderPopupVisible, setSqlBuilderPopupVisible] = React.useState<boolean>(false)
  const [dataSource, setDataSource] = React.useState<DataSource>(null)

  let displaySQL = imDataSourceItem.sqlExpression?.displaySQL || ''

  if (imDataSourceItem.sqlExpression && dataSource) {
    displaySQL = dataSourceUtils.getArcGISSQL(imDataSourceItem.sqlExpression, dataSource)?.displaySQL
  }

  displaySQL = displaySQL || ''

  React.useEffect(() => {
    if (jimuLayerView) {
      jimuLayerView.createLayerDataSource().then((ds) => {
        setDataSource(ds)
      }).catch(err => {
        console.error('LayerItemDetail create data source err', err)
      })
    }
  }, [jimuLayerView])

  // sqlHint is changed
  const onSqlHintChange = React.useCallback((evt) => {
    const newLabel = evt.target.value
    const newItem = imDataSourceItem.set('sqlHint', newLabel)
    onLayerItemDetailUpdateProp(newItem)
  }, [imDataSourceItem, onLayerItemDetailUpdateProp])

  const onClickSqlBuilderButton = React.useCallback(() => {
    setSqlBuilderPopupVisible(true)
  }, [setSqlBuilderPopupVisible])

  // SqlExpressionBuilderPopup is closed.
  const onSqlExpressionBuilderPopupToggle = React.useCallback(() => {
    setSqlBuilderPopupVisible(false)
  }, [setSqlBuilderPopupVisible])

  // sql is changed.
  const onSqlExpressionBuilderPopupChange = React.useCallback((sqlExpression) => {
    const newItem = imDataSourceItem.set('sqlExpression', sqlExpression)
    onLayerItemDetailUpdateProp(newItem)
  }, [imDataSourceItem, onLayerItemDetailUpdateProp])

  return (
    <div>
      {/* <SettingSection title={translate('sourceLabel')}>
        <SettingRow>
        </SettingRow>
      </SettingSection> */}

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
          dataSource && <SqlExpressionBuilderPopup
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
