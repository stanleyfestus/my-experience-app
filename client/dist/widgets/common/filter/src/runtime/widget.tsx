/** @jsx jsx */
import {
  React, classNames, type AllWidgetProps, jsx, type DataSource, type QueriableDataSource,
  dataSourceUtils, type ImmutableArray, type UseDataSource, type ImmutableObject, Immutable, type IMSqlExpression,
  type IconResult, DataSourceStatus, MessageManager, DataSourceFilterChangeMessage, type SqlQueryParams
} from 'jimu-core'
import { type IMConfig, type filterItemConfig, FilterArrangeType, FilterTriggerType, FilterItemType } from '../config'
import FilterItem from './filter-item'
import { WidgetPlaceholder, Button, Icon, Popper, Badge, defaultMessages as jimuUIMessages } from 'jimu-ui'
import { versionManager } from '../version-manager'
import defaultMessages from './translations/default'
import { getPanelStyles, getFilterItemsStyles, FILTER_PANEL_WIDTH } from './style'
import { getShownClauseNumberByExpression, getTotalClauseNumberByExpression } from 'jimu-ui/basic/sql-expression-runtime'
import FilterItemDataSource from './filter-item-ds'
import { ResetOutlined } from 'jimu-icons/outlined/editor/reset'
import { popperModifiers } from './utils'

const FilterIcon = require('../../icon.svg')

interface State {
  popperVersion: number
  isOpen: boolean
  // needQuery: boolean;
  filterItems: ImmutableArray<filterItemConfig>
  dataSources: { [dsId: string]: DataSource }
  outputDataSourceIsNotReady: { [dsId: string]: boolean }
}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, State> {
  static versionManager = versionManager

  index: number
  // filterItems: ImmutableArray<filterItemConfig>;
  widgetIconRef: any
  _autoApplyInit: boolean
  __unmount: boolean

  constructor (props) {
    super(props)
    this.__unmount = false
    this.index = 0
    this._autoApplyInit = true
    this.state = {
      popperVersion: 1,
      isOpen: false,
      // needQuery: true,
      filterItems: this.props.config.filterItems,
      dataSources: {},
      outputDataSourceIsNotReady: {}
    }
  }

  componentWillUnmount () {
    this.__unmount = true
    // Remove SQLs for dss, and publish msg when widget is removed.
    const dsIds = []
    Object.keys(this.state.dataSources).forEach(dsId => {
      const ds = this.state.dataSources[dsId]
      // Only when ds and its sql exist. (skip: undefined and '')
      if (ds && (ds.getInfo().widgetQueries?.[this.props.id] as SqlQueryParams)?.where) {
        (ds as QueriableDataSource)?.updateQueryParams(null, this.props.id)
        dsIds.push(ds.id)
      }
    })
    if (dsIds.length > 0) {
      this.publishFilterMessage(dsIds)
    }
  }

  componentDidUpdate (prevProps: AllWidgetProps<IMConfig>, prevState: State) {
    if (this.__unmount) {
      return
    }
    this._autoApplyInit = false
    // refresh all SQLs for different dataSources when setting's changed, including filter item is removed.
    if (prevProps.config !== this.props.config) {
      this.setState({
        filterItems: this.props.config.filterItems
      })
      this.setSqlToAllDs()
      // update auto apply by arrangement & styles
    } else if (this.state.dataSources !== prevState.dataSources) {
      this._autoApplyInit = true
      this.applyAutoFiltersAtStart()
    }
  }

  onFilterItemChange = (index: number, dataSource: DataSource, sqlExprObj: IMSqlExpression, applied: boolean) => {
    if (this.__unmount) {
      return
    }

    // get updated fItems
    const fItems = this.state.filterItems
    let fItem = fItems[index].set('autoApplyWhenWidgetOpen', applied)
    if (fItem.type === FilterItemType.Single) {
      fItem = fItem.set('sqlExprObj', sqlExprObj)
    } else if (fItem.type === FilterItemType.Custom) {
      // set checked to tag the selected ds from select.
      const newUseDss = fItem.useDataSources.map(useDs => {
        return Object.assign({}, useDs, { checked: useDs.dataSourceId === dataSource.id })
      })
      fItem = fItem.set('sqlExprObj', sqlExprObj).set('useDataSources', newUseDss)
    } else if (fItem.sqlExprObjForGroup) {
      fItem = fItem.setIn(['sqlExprObjForGroup', '0', 'clause', 'valueOptions', 'value'], (sqlExprObj.parts[0] as any).valueOptions.value)
    }
    const updatedFItems = (fItems as any).set(index, fItem)

    this.setState({
      filterItems: updatedFItems
    })

    const needQuery = !((!applied && !fItems[index].autoApplyWhenWidgetOpen))
    if (needQuery) {
      const dss = {}
      dss[dataSource.id] = dataSource
      if (fItem.type === FilterItemType.Group && fItem.sqlExprObjForGroup) {
        const itemUseDsIds = fItem.useDataSources.map(useDs => useDs.dataSourceId)
        itemUseDsIds.forEach(dsId => {
          dss[dsId] = this.state.dataSources[dsId]
        })
      }
      this.setSqlToAllDs(dss, updatedFItems)
    }
  }

  setSqlToAllDs = (dss = this.state.dataSources, filterItems = this.props.config.filterItems) => {
    const dsIds = []
    Object.keys(dss).forEach(dsId => {
      const ds = dss[dsId]
      if (ds) { // exclude invalid dataSources
        const prevSqlForDs = (ds.getInfo().widgetQueries?.[this.props.id] as SqlQueryParams)?.where || ''
        const sqlResult = this.getQuerySqlFromDs(ds, filterItems)
        this.setSqlToDs(ds, sqlResult)
        if (prevSqlForDs !== sqlResult.sql) {
          dsIds.push(ds.id)
        }
      }
    })
    if (dsIds.length > 0) {
      this.publishFilterMessage(dsIds)
    }
  }

  setSqlToDs = (dataSource: DataSource, sqlResult) => {
    // Not set empty SQL for ds, because it would cause many useless requests.
    if (this._autoApplyInit && sqlResult.sql === '') {
      return
    }
    if (dataSource) {
      const queryParams = { where: sqlResult.sql, sqlExpression: sqlResult.sqlExpression } as any
      (dataSource as QueriableDataSource).updateQueryParams?.(queryParams, this.props.id)
    }
  }

  publishFilterMessage = (dataSourceIds: string[]) => {
    MessageManager.getInstance().publishMessage(new DataSourceFilterChangeMessage(this.props.id, dataSourceIds))
  }

  // get merged sqlExpression from current ds
  getQuerySqlFromDs = (dataSource: DataSource, filterItems = this.props.config.filterItems) => {
    const sqlExprs = []
    filterItems.forEach(item => {
      // collect SQLs from autoApplied, manual apply, or expand single clause. dataSource could be null when it's not available.
      if (item.autoApplyWhenWidgetOpen || (this.props.config.omitInternalStyle && getShownClauseNumberByExpression(item.sqlExprObj) === 1)) {
        const sqlExprObj = item.type === FilterItemType.Group
          ? dataSourceUtils.getSQLExpressionFromGroupSQLExpression(item.sqlExprObjForGroup, dataSource)
          : item.useDataSources.filter(useDs => useDs.dataSourceId === dataSource?.id).length && item.sqlExprObj
        if (sqlExprObj) {
          const sqlResult = dataSourceUtils.getArcGISSQL(sqlExprObj, dataSource)
          if (sqlResult.sql) {
            sqlExprs.push(sqlResult.sqlExpression)
          }
        }
      }
    })
    let sqlExpression = sqlExprs[0] || null
    if (sqlExprs.length > 1) {
      sqlExpression = dataSourceUtils.getMergedSQLExpressions(sqlExprs, dataSource, this.props.config.logicalOperator)
    }
    return {
      sql: sqlExpression?.sql || '',
      sqlExpression
    }
  }

  getDataSourceById = (dataSourceId: string): ImmutableObject<UseDataSource> => {
    const dsList = this.props.useDataSources.asMutable({ deep: true }).filter(ds => ds.dataSourceId === dataSourceId)
    return Immutable(dsList[0])
  }

  // check if it's in props.useDataSources.
  isDataSourceRemoved = (dataSourceId: string) => {
    return this.props.useDataSources?.filter(useDs => dataSourceId === useDs.dataSourceId).length === 0
  }

  onResetChange = () => {
    this.setState({
      filterItems: this.props.config.filterItems
    })
    this.setSqlToAllDs()
  }

  /**
   * Whether to show reset button at bottom of widget
   * By default: bottom.
   * Special case: right. Only when filter item(s) are displayed as buttons.
   */
  showResetAtBottom = (resetAll, arrangeType, wrap, filterItems): boolean => {
    let atBottom = true
    if (
      resetAll && arrangeType === FilterArrangeType.Inline && !wrap &&
      (filterItems.length > 1 || (filterItems.length === 1 && getShownClauseNumberByExpression(filterItems[0].sqlExprObj) === 0))
    ) {
      atBottom = false
    }
    return atBottom
  }

  getItemUseDs = (item: filterItemConfig) => {
    let useDs = item.useDataSources[0]
    if (item.type === FilterItemType.Custom) {
      useDs = item.useDataSources.filter(ds => (ds as any).checked)[0] || useDs
    } else if (item.type === FilterItemType.Group && item.sqlExprObjForGroup) {
      useDs = item.useDataSources.filter(ds => ds.dataSourceId === item.sqlExprObjForGroup[0].dataSourceId)[0]
    }
    return useDs
  }

  getFilterItems = (config, arrangeType = FilterArrangeType.Block, wrap = false, isPopup = false) => {
    const showResetAtBottom = this.showResetAtBottom(config.resetAll, arrangeType, wrap, config.filterItems)
    return (
      <div className={classNames('w-100 h-100 d-flex justify-content-between',
        showResetAtBottom ? 'flex-column' : 'flex-row')}
        css={getFilterItemsStyles(this.props.theme, this.props.config)}>
        <div
          className={classNames('w-100 filter-items-container',
            arrangeType && config.arrangeType === FilterArrangeType.Inline ? 'filter-items-inline' : '',
            wrap ? 'filter-items-wrap' : '', isPopup ? 'filter-items-popup' : '')}
        >
          {(this.state.filterItems as unknown as filterItemConfig[]).map((item, index) => {
            const useDs = this.getItemUseDs(item)
            const ds = this.isDataSourceRemoved(useDs.dataSourceId) ? null : this.state.dataSources[useDs.dataSourceId]
            const isNotReadyFromWidget = this.state.outputDataSourceIsNotReady[useDs.dataSourceId]
            return (
              <FilterItem
                key={index} id={index} widgetId={this.props.id} intl={this.props.intl}
                selectedDs={ds} useDataSource={useDs}
                dataSources={item.type === FilterItemType.Custom && this.state.dataSources}
                isNotReadyFromWidget={isNotReadyFromWidget} logicalOperator={config.logicalOperator} config={item}
                arrangeType={arrangeType} triggerType={config.triggerType} wrap={wrap} omitInternalStyle={config.omitInternalStyle} filterNum={this.state.filterItems.length}
                onChange={this.onFilterItemChange} itemBgColor={this.props.theme.ref.palette.neutral[400]} theme={this.props.theme}
              />
            )
          })}
        </div>
        {
          config.resetAll && <div className={classNames('filter-reset-container', showResetAtBottom ? 'bottom-reset' : 'right-reset')}>
            <Button icon type='default' size='default' className='reset-button'
              style={{ borderRadius: config.triggerType === FilterTriggerType.Toggle ? '16px' : null }}
              title={this.props.intl.formatMessage({ id: 'resetAllFilters', defaultMessage: jimuUIMessages.resetAllFilters })}
              aria-label={this.props.intl.formatMessage({ id: 'resetAllFilters', defaultMessage: jimuUIMessages.resetAllFilters })}
              onClick={this.onResetChange}
            >
              <ResetOutlined />
            </Button>
          </div>
        }
      </div>
    )
  }

  onShowPopper = () => {
    this.setState({
      isOpen: !this.state.isOpen,
      popperVersion: !this.state.isOpen ? this.state.popperVersion + 1 : this.state.popperVersion
    })
  }

  onTogglePopper = () => {
    this.setState({
      isOpen: false
    })
    this.widgetIconRef.focus()
  }

  checkIfAnyFiltersApplied = (): boolean => {
    const { omitInternalStyle } = this.props.config
    const filterItems = this.state?.filterItems || this.props.config.filterItems
    const isApplied = (filterItems as unknown as filterItemConfig[]).some((item) => {
      const sqlExprObj = item.type === FilterItemType.Group
        ? dataSourceUtils.getSQLExpressionFromGroupSQLExpression(item.sqlExprObjForGroup, this.state.dataSources[item.sqlExprObjForGroup?.[0].dataSourceId])
        : item.sqlExprObj

      if ((item.type !== FilterItemType.Custom && omitInternalStyle) && getTotalClauseNumberByExpression(sqlExprObj) === 1 && getShownClauseNumberByExpression(sqlExprObj) === 1) {
        const useDsId = item.type === FilterItemType.Group
          ? this.state.dataSources[item.sqlExprObjForGroup?.[0].dataSourceId]?.id
          : item.useDataSources[0].dataSourceId
        // ds exists, or it hasn't created when widget starts
        return (this.state.dataSources[useDsId]
          ? dataSourceUtils.getArcGISSQL(sqlExprObj, this.state.dataSources[useDsId]).sql
          : sqlExprObj.sql) !== ''
      } else {
        return item.autoApplyWhenWidgetOpen
      }
    })
    return isApplied
  }

  onIsDataSourceNotReady = (dataSourceId: string, dataSourceStatus) => {
    this.setState((state: State) => {
      const isOutPutDs = state.dataSources[dataSourceId]?.getDataSourceJson().isOutputFromWidget
      if (!isOutPutDs) {
        return
      }
      const outputDataSource = Object.assign({}, state.outputDataSourceIsNotReady)
      outputDataSource[dataSourceId] = dataSourceStatus === DataSourceStatus.NotReady
      return { outputDataSourceIsNotReady: outputDataSource }
    })
  }

  onCreateDataSourceCreatedOrFailed = (dataSourceId: string, dataSource: DataSource) => {
    this.setState((state: State) => {
      const newDataSources = Object.assign({}, state.dataSources)
      newDataSources[dataSourceId] = dataSource
      return { dataSources: newDataSources }
    })
  }

  // Only for first time & autoApply option, after all data sources are ready
  applyAutoFiltersAtStart = () => {
    if (this._autoApplyInit) {
      const dsLength = Object.keys(this.state.dataSources).map(() => true).length
      if (dsLength === this.props.useDataSources?.length) {
        setTimeout(() => {
          this.setSqlToAllDs()
          this._autoApplyInit = false
        }, 0)
      }
    }
  }

  render () {
    const { config, icon, label } = this.props
    const isOffPanel = this.props.controllerWidgetId && this.props.offPanel

    if (this.state.filterItems.length === 0) {
      return (
        <WidgetPlaceholder
          icon={FilterIcon} widgetId={this.props.id}
          css={getPanelStyles(isOffPanel)}
          message={this.props.intl.formatMessage({ id: '_widgetLabel', defaultMessage: defaultMessages._widgetLabel })}
        />
      )
    }
    return (
      <div className='jimu-widget widget-filter overflow-auto'>
        {
          this.props.useDataSources?.map((useDs, key) => {
            return (
              <FilterItemDataSource
                key={key}
                useDataSource={useDs}
                onIsDataSourceNotReady={this.onIsDataSourceNotReady}
                onCreateDataSourceCreatedOrFailed={this.onCreateDataSourceCreatedOrFailed}
              />
            )
          })
        }
        {
          // Filters & Clauses on Popup are as the same as Block panel.
          // use offpanel only when changing to popper style on setting panel.
          config.arrangeType === FilterArrangeType.Popper && !isOffPanel
            ? <div className='filter-widget-popper'>
              <Badge dot className='m-1' hideBadge={!this.checkIfAnyFiltersApplied()} color='primary'>
                <Button
                  icon size='sm' className='filter-widget-pill h-100'
                  ref={ref => { this.widgetIconRef = ref }}
                  title={label}
                  type='tertiary'
                  onClick={this.onShowPopper}
                  aria-pressed={this.checkIfAnyFiltersApplied()}
                  aria-haspopup='dialog'
                >
                  <Icon
                    icon={typeof icon === 'string' ? icon : (icon as IconResult).svg} size={16}
                    color={typeof icon === 'string' ? '' : (icon as IconResult).properties.color}
                  />
                </Button>
              </Badge>
              {
                this.state.popperVersion > 1 && <Popper
                  open={this.state.isOpen}
                  version={this.state.popperVersion}
                  keepMount
                  toggle={this.onTogglePopper}
                  showArrow
                  modifiers={popperModifiers}
                  forceLatestFocusElements
                  reference={this.widgetIconRef}
                >
                  <div className='p-2' style={{ width: FILTER_PANEL_WIDTH }}>
                    {this.getFilterItems(config, FilterArrangeType.Block, false, true)}
                    {
                      // to trap focus inside popper when pressing TAB key on disabled cancel button.
                      !config.resetAll && config.triggerType === FilterTriggerType.Button && <Button className='sr-only' />
                    }
                  </div>
                </Popper>
              }
            </div>
            : <div css={getPanelStyles(isOffPanel)}>
              {this.getFilterItems(config, isOffPanel ? FilterArrangeType.Block : config.arrangeType, config.wrap)}
            </div>
        }
      </div>
    )
  }
}
