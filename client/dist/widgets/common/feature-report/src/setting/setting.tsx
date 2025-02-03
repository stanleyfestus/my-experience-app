/* eslint-disable multiline-ternary */
/** @jsx jsx */
import {
  React, Immutable, css, jsx, type UseDataSource, DataSourceComponent, type FeatureLayerDataSource,
  DataSourceManager, CONSTANTS
} from 'jimu-core'
import { defaultMessages as jimuDefaultMessages, Button, Dropdown, DropdownButton, DropdownItem, DropdownMenu, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Tooltip } from 'jimu-ui'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import { SettingSection, SettingRow, SidePopper } from 'jimu-ui/advanced/setting-components'
import { DataSourceSelector, AllDataSourceTypes } from 'jimu-ui/advanced/data-source-selector'
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree'
import { type IMConfig } from '../config'
import { getStyle, getModalStyle } from './css/style'
import defaultMessages from './translations/default'
import { getReportTemplates, getSurveyFromLayer, getSurveyItemInfo, generateExamTemplateFromServer, getReportQuickReferenceUrl, extractParamFromDataSource, generateSampleReport, downloadFile, getDSFeatureCount, sanitizeFilename } from '../utils'
import { ClickOutlined } from 'jimu-icons/outlined/application/click'
import { CloseOutlined } from 'jimu-icons/outlined/editor/close'
import { ImportOutlined } from 'jimu-icons/outlined/editor/import'
import { LaunchOutlined } from 'jimu-icons/outlined/editor/launch'
import { IndividualRecordIcon } from './components/icons/individual-record-icon'
import { SummaryRecordIcon } from './components/icons/summary-record-icon'
import { CombinedRecordIcon } from './components/icons/combined-record-icon'
import { MoreHorizontalOutlined } from 'jimu-icons/outlined/application/more-horizontal'
import { Fragment } from 'react'
import { ConfigItem } from './components/config-item'
import { OutputSettingPanel } from './components/output-setting-panel'
// import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning'
import { CreateSampleTemplate } from './components/create-sample-template'
import { number } from 'prop-types'
import { TemplateEditor } from './components/template-editor'
import { LampIcon } from './components/icons/lamp'
import ProgressTypeLoading from './components/loading'
import { ExpressionEditor } from './components/expression-editor'

const MESSAGES = Object.assign({}, defaultMessages, jimuDefaultMessages)

enum PopperName {
  outputSetting = 'OutputSetting',
  templateEditor = 'TemplateEditor'
}
export default class Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig>, any> {
  /**
   * state variable
   */
  dataSourceManager: any = DataSourceManager.getInstance()
  private dataSource: FeatureLayerDataSource
  supportedDsTypes = Immutable([
    AllDataSourceTypes.FeatureLayer,
    AllDataSourceTypes.SubtypeGroupLayer,
    AllDataSourceTypes.SubtypeSublayer
  ])

  public state: any = {

    // data source related
    dataSource: null,
    dataSourceInvalid: true,
    allowedDsIds: null,
    showDsInvalidAlert: false,
    featureCount: null,

    // report and settings related
    showOutputSetting: false,
    showTemplateEditor: false,
    templateItems: [],
    surveyItemInfo: null,
    featureLayerUrl: '',
    inputFeatureTemplate: '',
    allowToEdit: true, // including create, only support owner, coowner, org admin

    // template related
    seletedTemplateItems: [],
    activeTemplateIdx: number,
    popperFocusNode: null,
    editingTemplate: null,
    samplePrintingTemplateIds: [],

    // modal
    modalIsOpen: false,
    isGeneratingSampleTemplate: false,
    isGeneratingSummaryIndividualTemplate: false,
    isGeneratingIndividualTemplate: false,
    isGeneratingSummaryTemplate: false,
    quickReferenceUrl: ''
  }

  unmount = false
  closeDsInvalidAlertTimer
  closeSidePopper = (type: PopperName) => {
    const key = 'show' + type
    if (this.state[key]) {
      const obj = {}
      obj[key] = false
      this.setState(obj)
    }

    if (type === PopperName.templateEditor) {
      this.setState({
        activeTemplateIdx: null,
        editingTemplate: null
      })
    }
  }

  openSidePopper = (type: PopperName) => {
    const key = 'show' + type
    if (!this.state[key]) {
      const obj = {}
      obj[key] = true
      this.setState(obj)
    }
  }

  /**
   * open the template editor
   * @param index
   */
  openTemplateEditor = (index: any, editMode = false, editingTemplate?: any) => {
    const idx = Number(index)
    this.setState({
      activeTemplateIdx: idx,
      // showTemplateEditor: true,
      editingTemplate: editingTemplate
    })
    this.openSidePopper(PopperName.templateEditor)
    this.setTemplateSidePopperAnchor(index, true)
  }

  innerSettingButtonRef: any
  templateEditorPopperTrigger: any
  rootRef: any

  /**
   * constructor
   * @param props
   */
  constructor (props: any) {
    super(props)
    this.innerSettingButtonRef = React.createRef()
    this.templateEditorPopperTrigger = React.createRef()
    this.rootRef = React.createRef()
  }

  componentDidMount () {
    this.unmount = false
    if (this.rootRef.current) {
      // we won't add the event listener on document.body, because after testing, when the selected ds is a standalone feature layer without itemid, the onClickBody function will called after the showDsInvalidAlert function, and the alert component will flash and hidden.
      this.rootRef.current.addEventListener('click', this.onClickBody, false)
    }
    if (this.props.config?.inputFeatureTemplate) {
      this.setState({
        inputFeatureTemplate: this.props.config.inputFeatureTemplate
      })
    }
  }

  componentWillUnmount () {
    this.unmount = true
    if (this.rootRef.current) {
      this.rootRef.current.removeEventListener('click', this.onClickBody, false)
      this.cancelCloseDsInvalidAlertTimer()
    }
  }

  onDataSourceCreated = (dataSource: FeatureLayerDataSource): void => {
    this.dataSource = dataSource
    this.setState({
      dataSource: dataSource
    })
    const dsParam = extractParamFromDataSource(dataSource)
    const fsUrl = dsParam.url
    if (!fsUrl) {
      console.error('The selected data source has no url')
      this.setState({
        featureLayerUrl: null
      })
      return
    }
    if (fsUrl === this.state.featureLayerUrl) {
      getDSFeatureCount(dsParam, fsUrl).then((count) => {
        this.setState({
          featureCount: count
        })
      })
    } else {
      this.setState({
        datasourceInvalid: true
      })
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('surveyItemId', null)
      })
    }

    // in the initial version of the report widget, we only support the layer that is matched to a survey
    getSurveyFromLayer(dataSource).then((surveyItemId) => {
      // ds is not survey related
      if (!surveyItemId) {
        console.log('This layer is not a survey\'s assosiate layer')
        this.showDsInvalidAlert()
        this.dataSource = null
        this.setState({
          dataSource: null
        })
        this.props.onSettingChange({
          id: this.props.id,
          useDataSources: null
        })
        this.setState({
          featureLayerUrl: null
        })
        return
      }
      this.setState({
        datasourceInvalid: false
      })
      // survey related ds
      this.hideDsInvalidAlert()
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('surveyItemId', surveyItemId)
      })
      this.setState({
        featureLayerUrl: fsUrl
      })
      // build default feature template
      if (!this.props.config.inputFeatureTemplate && !this.state.inputFeatureTemplate) {
        const inputFeatTempt = this.getDefaultInputFeatureTemplate(dataSource.getLayerDefinition())
        this.setState({
          inputFeatureTemplate: inputFeatTempt
        })
      }

      getSurveyItemInfo(surveyItemId)
        .then((surveyItemInfo) => {
          // build default outputReportName
          if (!this.props.config.reportName) {
            const defaultReportName = this.getDefaultReportName(surveyItemInfo, dataSource)
            this.props.onSettingChange({
              id: this.props.id,
              config: this.props.config.set('reportName', defaultReportName)
            })
          }

          const allowToEdit = !!(surveyItemInfo.isOwner || surveyItemInfo.isAdmin || surveyItemInfo.isCoowner)
          const quickReferenceUrl = getReportQuickReferenceUrl(fsUrl, surveyItemId, this.props.locale)
          this.setState({
            surveyItemInfo: surveyItemInfo,
            quickReferenceUrl: quickReferenceUrl,
            allowToEdit: allowToEdit
          })
          return getDSFeatureCount(dsParam, fsUrl)
        }).then((count) => {
          this.setState({
            featureCount: count
          })
          getReportTemplates(surveyItemId).then((items) => {
            this.setState({
              templateItems: items
            })

            let seletedTemplateItems = []
            if (this.props.config.reportTemplateIds?.length) {
              seletedTemplateItems = items.filter((item) => {
                return this.props.config.reportTemplateIds.includes(item.id)
              })
            }
            this.setState({
              seletedTemplateItems: seletedTemplateItems
            })
          })
        })
    })
  }

  /**
   * when data source changed, set the mode to "Selected Features" as default
   * @param useDataSources
   * @returns
   */
  onDataSourceChange = (useDataSources: UseDataSource[]) => {
    if (!useDataSources) {
      return
    }
    const currentMainDataSourceId = this.props.useDataSources ? this.props.useDataSources[0]?.mainDataSourceId : ''
    const newMainDataSourceId = useDataSources[0]?.mainDataSourceId
    let useDss = useDataSources
    // if select the main data source id is not changed, it means the user is swithing the ds type in the ui,
    // otherwise, for the new ds, set it to the "Selected Features" mode as default
    if (currentMainDataSourceId !== newMainDataSourceId) {
      useDss = useDataSources.map(u => {
        return {
          ...u,
          dataSourceId: this.dataSourceManager.getDataViewDataSourceId(u.mainDataSourceId, CONSTANTS.SELECTION_DATA_VIEW_ID),
          dataViewId: CONSTANTS.SELECTION_DATA_VIEW_ID
        }
      })

      this.setState({
        datasourceInvalid: true
      })
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('surveyItemId', null)
      })
    }
    this.props.onSettingChange({
      id: this.props.id,
      useDataSources: useDss
    })
    // the data souce is removed
    if (!useDss || !useDss.length) {
      this.reset()
    }
  }

  /**
   * reset the widget
   */
  reset = () => {
    this.props.onSettingChange({
      id: this.props.id,
      config: {}
    })
    this.setState({
      dataSource: null,
      dataSourceInvalid: true,
      allowedDsIds: null,
      featureCount: null,
      showOutputSetting: false,
      showTemplateEditor: false,
      templateItems: [],
      surveyItemInfo: null,
      featureLayerUrl: '',
      inputFeatureTemplate: '',
      allowToEdit: true,
      seletedTemplateItems: [],
      activeTemplateIdx: number,
      popperFocusNode: null,
      editingTemplate: null,
      samplePrintingTemplateIds: [],
      modalIsOpen: false,
      isGeneratingSampleTemplate: false,
      isGeneratingSummaryIndividualTemplate: false,
      isGeneratingIndividualTemplate: false,
      isGeneratingSummaryTemplate: false,
      quickReferenceUrl: ''
    })
    this.dataSource = null
  }

  /**
   * get default input feature template, if the displayField exists, use it.
   * otherwise, use the first string type field
   */
  getDefaultInputFeatureTemplate = (layerJson: any) => {
    // auto generate a default inputFeatureTemplate, show the displayField
    if (layerJson.displayField) {
      // todo: how about the displayField is a expression?
      return '{' + layerJson.displayField + '}'
    }
    const fields = layerJson.fields || []
    const firstStringField = fields.find((field) => {
      return field.type === 'esriFieldTypeString'
    })
    // show the first string type fields
    if (firstStringField) {
      return '{' + firstStringField.name + '}'
    }
    // show the first four fields
    const resultFields = (fields.length > 3 ? fields.slice(0, 4) : fields).map((field) => {
      return field.name
    })
    return resultFields.map((fieldName) => {
      return '{' + fieldName + '}'
    }).join(',')
  }

  getDefaultReportName = (surveyItemInfo, dataSource) => {
    const oidField = dataSource.getIdField() || 'objectid'
    return sanitizeFilename(surveyItemInfo.title) + (oidField ? ('_OID' + '${' + oidField + '}') : '')
  }

  onOptionChnged = (val: any) => {

  }

  showDsInvalidAlert (): void {
    if (!this.unmount) {
      this.setState({
        showDsInvalidAlert: true
      }, () => {
        // make sure Alert dom is rendered
        // if (!this.unmount) {
        //   this.forceUpdate()
        // }
      })

      this.startCloseDsInvalidAlertTimer()
    }
  }

  hideDsInvalidAlert (): void {
    this.cancelCloseDsInvalidAlertTimer()

    if (!this.unmount) {
      this.setState({
        showDsInvalidAlert: false
      })
    }
  }

  cancelCloseDsInvalidAlertTimer (): void {
    if (this.closeDsInvalidAlertTimer) {
      clearTimeout(this.closeDsInvalidAlertTimer)
      this.closeDsInvalidAlertTimer = null
    }
  }

  startCloseDsInvalidAlertTimer (): void {
    this.cancelCloseDsInvalidAlertTimer()
    this.closeDsInvalidAlertTimer = setTimeout(() => {
      if (!this.unmount) {
        this.setState({
          showDsInvalidAlert: false
        })
      }
    }, 5000)
  }

  onClickBody = () => {
    if (!this.unmount) {
      this.hideDsInvalidAlert()
    }
  }

  onDsInvalidAlertClose = () => {
    this.hideDsInvalidAlert()
  }

  i18n = (id: string, values?: { [key: string]: any }): string => {
    return this.props.intl.formatMessage(
      { id: id, defaultMessage: MESSAGES[id] },
      values
    )
  }

  /**
   * on the report segment title changed
   * @param type
   * @param value
   */
  onLabelChanged = (type: string, value: string) => {
    const key = type + 'Label'
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(key, value)
    })
  }

  /**
   * on the report segment visibility changed
   * todo: deal with the spatial key: reportSettings
   * @param type
   * @param value
   */
  onVisibilityChanged = (type: string, value: boolean) => {
    const hides: any = [].concat(this.props.config.hides || [])
    const pos = hides.indexOf(type)
    if (value) {
      // remove from the hides array
      if (pos >= 0) {
        hides.splice(pos, 1)
      }
    } else {
      // add to the hides array
      if (pos < 0) {
        hides.push(type)
      }
    }
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('hides', hides)
    })
  }

  /**
   * on the default value changed
   * @param type
   * @param value
   */
  onDefaultValueChanged = (type: string, value: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(type, value)
    })
  }

  updateTemplate = (template: any) => {
    const items = this.state.templateItems.map(tml =>
      tml.id === template.id ? template : tml
    )
    // add into templateItems if the id is new
    const findItInALlList = this.state.templateItems.find(tml => {
      return tml.id === template.id
    })
    if (!findItInALlList) {
      items.push(template)
    }
    // update selectedItems if the template is in the existing selectedItems
    const selectedItems = this.state.seletedTemplateItems.map(tml =>
      tml.id === template.id ? template : tml
    )

    // add into selectedItems if the template is not in the existing selectedItems
    const findIt = this.state.seletedTemplateItems.find(tml => {
      return tml.id === template.id
    })
    if (!findIt) {
      selectedItems.push(template)
    }

    this.setState({
      templateItems: items,
      seletedTemplateItems: selectedItems,
      activeTemplateIdx: null,
      editingTemplate: null,
      showTemplateEditor: false
    })
    const reportTemplateIds = selectedItems.map((item) => {
      return item.id
    })
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('reportTemplateIds', reportTemplateIds)
    })
  }

  /**
   * generate sample template file
   * @param type
   */
  generateExamTemplate = (type: 'summaryIndividual' | 'summary' | 'individual') => {
    const obj = {}
    const key = 'isGenerating' + type + 'Template'
    obj[key] = true
    this.setState(obj)
    generateExamTemplateFromServer(this.state.featureLayerUrl, this.state.surveyItemInfo, type).then(() => {
      const newObj = {}
      newObj[key] = false
      this.setState(newObj)
    })
  }

  /**
   * print sample report
   * @param tempalte
   */
  printSampleTemplate = (template) => {
    const dsParam = extractParamFromDataSource(this.dataSource)
    const id = template.id
    const ids = this.state.samplePrintingTemplateIds || []
    ids.push(id)
    this.setState({
      samplePrintingTemplateIds: [].concat(ids)
    })
    const removeId = () => {
      const ids = this.state.samplePrintingTemplateIds || []
      const pos = (this.state.samplePrintingTemplateIds || []).indexOf(id)
      if (pos >= 0) {
        ids.splice(pos, 1)
        this.setState({
          samplePrintingTemplateIds: [].concat(ids)
        })
      }
    }
    generateSampleReport(template, this.state.surveyItemInfo, dsParam, this.props.config, this.props.locale).then((jobInfo) => {
      removeId()
      if (jobInfo) {
        downloadFile(jobInfo)
      }
    }).catch(() => {
      removeId()
    })
  }

  /**
   * remove a template from the reportTemplateIds
   * @param index
   */
  removeTemplate = (e: any, deleteTemplateId: string, deleteFromAllList?: boolean) => {
    if (e) {
      e.stopPropagation()
    }
    // update the selected templates
    const ids = [].concat(this.props.config.reportTemplateIds)
    const index = this.state.seletedTemplateItems.findIndex((item) => {
      return item.id === deleteTemplateId
    })
    if (ids?.length > index) {
      ids.splice(index, 1)
      const newItems = this.state.seletedTemplateItems.filter((item) => {
        return item.id !== deleteTemplateId
      })
      this.setState({
        seletedTemplateItems: newItems
      })
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('reportTemplateIds', ids)
      })
    }
    this.setState({
      activeTemplateIdx: null,
      editingTemplate: null,
      showTemplateEditor: false
    })

    // update all the templates
    if (deleteFromAllList) {
      const idx = this.state.templateItems.findIndex((item) => {
        return item.id === deleteTemplateId
      })
      if (idx >= 0) {
        ids.slice(index, 1)
        const newItems = this.state.templateItems.filter((item) => {
          return item.id !== deleteTemplateId
        })
        this.setState({
          templateItems: newItems
        })
      }
    }
  }

  setTemplateSidePopperAnchor = (index?: number, newAdded = false) => {
    let node: any
    if (newAdded) {
      node = this.templateEditorPopperTrigger.current.getElementsByClassName('add-template-btn')[0]
    } else {
      node = this.templateEditorPopperTrigger.current.getElementsByClassName('jimu-tree-item__body')[index]
    }
    this.setState({
      popperFocusNode: node
    })
  }

  /**
   * on sample templates created
   */
  onSampleTemplatesCreated = (allTemplates, createdTempaltes) => {
    const newIds = createdTempaltes.map((item) => {
      return item.id
    })

    this.setState({
      templateItems: allTemplates,
      seletedTemplateItems: createdTempaltes
    })
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('reportTemplateIds', newIds)
    })
  }

  /**
   * render
   */
  render () {
    const advancedActionMap = {
      overrideItemBlockInfo: ({ itemBlockInfo }, refComponent) => {
        return {
          name: TreeItemActionType.RenderOverrideItem,
          children: [{
            name: TreeItemActionType.RenderOverrideItemDroppableContainer,
            children: [{
              name: TreeItemActionType.RenderOverrideItemDraggableContainer,
              children: [{
                name: TreeItemActionType.RenderOverrideItemBody,
                children: [{
                  name: TreeItemActionType.RenderOverrideItemMainLine,
                  children: [{
                    name: TreeItemActionType.RenderOverrideItemDragHandle
                  }, {
                    name: TreeItemActionType.RenderOverrideItemIcon,
                    autoCollapsed: true
                  }, {
                    name: TreeItemActionType.RenderOverrideItemTitle
                  }, {
                    name: TreeItemActionType.RenderOverrideItemDetailToggle
                  }, {
                    name: TreeItemActionType.RenderOverrideItemCommands
                  }]
                }]
              }]
            }]
          }]
        }
      }
    }

    const dsSelectString = this.i18n('setDataSource')

    let dataSourceComponentContent = null
    const useDataSource = this.props.useDataSources && this.props.useDataSources[0]
    if (useDataSource && useDataSource.dataSourceId) {
      dataSourceComponentContent = (
        <DataSourceComponent
          useDataSource={useDataSource}
          onDataSourceCreated={this.onDataSourceCreated}
          query={null}
        />
      )
    }

    /**
     * set data source
     */
    const dataSourceSection =
    <Fragment>
      <Alert
        closable
        className='ds-invalid-alert'
        form='basic'
        onClose={this.onDsInvalidAlertClose}
        open={this.state.showDsInvalidAlert}
        text={this.i18n('dataSourceTip')}
        type='warning'
        withIcon
      />
      <SettingSection role='group' className={useDataSource ? '' : 'border-0'} title={this.i18n('data')} aria-label={this.i18n('data')}>
        {/* <SettingRow flow="wrap">
          <div className="second-header">{this.props.intl.formatMessage({id: 'sourceDescript', defaultMessage: defaultMessages.sourceDescript})}</div>
        </SettingRow> */}
        <SettingRow>
          <DataSourceSelector
            aria-describedby="dataSourceTip"
            types={this.supportedDsTypes}
            fromDsIds={this.state.allowedDsIds}
            useDataSourcesEnabled mustUseDataSource
            useDataSources={this.props.useDataSources}
            closeDataSourceListOnChange
            // onClickDisabledDsItem={this.onClickDisabledDsItem}
            onChange={this.onDataSourceChange} widgetId={this.props.id}
          />
          {dataSourceComponentContent}
        </SettingRow>
        <SettingRow css={{ display: useDataSource ? 'none' : 'block' }} label={<span id='dataSourceTip'>{this.i18n('dataSourceTip')}</span>} flow='wrap' />
      </SettingSection>
      {useDataSource ? null
        : <div className='empty-placeholder w-100'>
          <div className='empty-placeholder-inner'>
            <div className='empty-placeholder-icon'>
              <ClickOutlined size={48} />
            </div>
            <div
              className='empty-placeholder-text'
              id='feature-report-blank-msg'
              dangerouslySetInnerHTML={{ __html: this.i18n('selectDataPlaceholder', { ButtonString: dsSelectString }) }}
            />
        </div>
        </div>
      }
    </Fragment>

    /**
     * feature report template
     */
    const templateSettingSection = (
      // <div className='template-setting-outter'>
        <SettingSection role='group' className={'template-setting-outter'} aria-label={this.i18n('reportTemplateTitle')}>
          <div ref={this.templateEditorPopperTrigger}>
          <SettingRow
            level={1}
            label={this.i18n('reportTemplateTitle')}
            flow='no-wrap'
          >
            {/* <Tooltip title={this.i18n('reportTemplateHelpDesc')} showArrow placement='left' interactive={true} leaveDelay={1000}> */}
            <Button tabIndex={0} role="button" className="p-0 help-btn" icon={true} type={'tertiary'} onClick={() => { this.setState({ modalIsOpen: true }) }}>
              {this.i18n('help')}
              <LampIcon />
            </Button>
            {/* </Tooltip> */}

          <Modal
            isOpen={this.state.modalIsOpen}
            className='bg-default w-75 d-flex justify-content-between'
            role='dialog'
            aria-label={this.i18n('reportTemplateHelpTitle')}
            css={getModalStyle(this.props.theme)}>
              <ModalHeader
                className='d-flex justify-content-between border-color-gray-300 py-4 font-16 font-dark-600'
                title={this.i18n('reportTemplateHelpTitle')}
                toggle={() => { this.setState({ modalIsOpen: false }) }}
              >
                {this.i18n('reportTemplateHelpTitle')}
              </ModalHeader>
              <ModalBody>
                <div className='px-2 py-0 template-list'>
                  <p className='font-13 font-dark-600 mt-4'>
                    {this.i18n('reportTemplateHelpDesc')}
                    <a href={'https://doc.arcgis.com/' + (this.props.locale || 'en') + '/survey123/browser/analyze-results/featurereporttemplates.htm'} target='_blank' rel='noopener noreferrer'>
                      {this.i18n('reportTemplateHelpLearnMore')}
                      </a>
                  </p>
                  <p className='font-14 font-dark-800 mt-4'>
                    {this.i18n('quickReferencePage')}
                    <a href={this.state.quickReferenceUrl} target='_blank' rel='noopener noreferrer'>
                      <LaunchOutlined css={css('margin: 0 6px')}></LaunchOutlined>
                    </a>
                  </p>

                  <p className='font-14 font-dark-800 mt-4'>
                    {this.i18n('sampleTemplate')}
                  </p>

                  <div css={css('position:relative;')}>
                    <ul>
                      <li className='px-2'>
                        <div>
                          <div>
                            <IndividualRecordIcon size={32} />
                          </div>
                          <div>
                            <p>{this.i18n('individualRecordTemplate')}</p>
                            <p>{this.i18n('individualRecordTemplateTip')}</p>
                          </div>
                          <Button tabIndex={0} role="button" className="p-0" icon={true} type={'tertiary'}
                            title={this.i18n('download')}
                            disabled={this.state.isGeneratingIndividualTemplate}
                            onClick={(e) => { this.generateExamTemplate('individual') }}
                            >
                            {this.state.isGeneratingIndividualTemplate ? <ProgressTypeLoading size={16}/> : <ImportOutlined size={16} /> }
                          </Button>
                        </div>
                      </li>
                      <li className='px-2'>
                        <div>
                          <div>
                            <SummaryRecordIcon size={32} />
                          </div>
                          <div>
                            <p>{this.i18n('summaryTemplate')}</p>
                            <p>{this.i18n('summaryTemplateTip')}</p>
                          </div>
                          <Button tabIndex={0} role="button" className="p-0" icon={true} type={'tertiary'}
                            title={this.i18n('download')}
                            disabled={this.state.isGeneratingSummaryTemplate}
                            onClick={(e) => { e.stopPropagation(); this.generateExamTemplate('summary') }}
                            >
                              {this.state.isGeneratingSummaryTemplate ? <ProgressTypeLoading size={16}/> : <ImportOutlined size={16} />}
                            </Button>
                          </div>
                      </li>
                      <li className='px-2'>
                        <div>
                          <div>
                            <CombinedRecordIcon size={32} />
                          </div>
                          <div>
                            <p>{this.i18n('combinedTemplate')}</p>
                            <p>{this.i18n('combinedTemplateTip')}</p>
                          </div>
                          <Button tabIndex={0} role="button" className="p-0" icon={true} type={'tertiary'}
                            title={this.i18n('download')}
                            disabled={this.state.isGeneratingSummaryIndividualTemplate}
                            onClick={(e) => { e.stopPropagation(); this.generateExamTemplate('summaryIndividual') }}
                            >
                              {this.state.isGeneratingSummaryIndividualTemplate ? <ProgressTypeLoading size={16}/> : <ImportOutlined size={16} />}
                            </Button>
                          </div>
                      </li>
                    </ul>
                  </div>

                </div>
              </ModalBody>

              <ModalFooter>
                <div className='d-flex justify-content-end mt10'>
                  <Button tabIndex={0} role="button" type='primary' className='mr-2' onClick={() => { this.setState({ modalIsOpen: false }) }} aria-label={this.i18n('ok')}>
                    {this.i18n('ok')}
                  </Button>
                </div>
              </ModalFooter>
            </Modal>
          </SettingRow>

          <SettingRow>
            <Button tabIndex={0} role="button" type="primary" id="newTemplateBtn" className="w-100 add-template-btn" onClick={() => { this.openTemplateEditor(this.state.seletedTemplateItems.length) }}>
              <span css={css(' padding: 0 10px;font-weight: 800;')}>+</span>
              {this.i18n('newTemplate')}
            </Button>
          </SettingRow>

          {!this.state.seletedTemplateItems.length
            ? <CreateSampleTemplate
              templates ={this.state.templateItems}
              theme={this.props.theme}
              onSampleTemplatesCreated={this.onSampleTemplatesCreated}
              surveyItemInfo={this.state.surveyItemInfo}
              featureLayerUrl={this.state.featureLayerUrl}
              editDisabled={!this.state.allowToEdit}
            ></CreateSampleTemplate>
            : ''
          }

           <SettingRow className='pt-0 border-0 template-list-container '>
              {/* <SettingSection className='pt-0 border-0 '> */}
                <div className='setting-ui-template-list w-100'>
                  {this.state.seletedTemplateItems?.length
                    ? <List
                      className='setting-ui-template-list-exsiting'
                      itemsJson={Array.from(this.state.seletedTemplateItems || []).map((item: any, index) => ({
                        itemStateDetailContent: item,
                        itemKey: `${index}`,
                        itemStateChecked: this.state.showTemplateEditor && index === this.state.activeTemplateIdx,
                        itemStateTitle: item.title
                        // itemStateCommands: [
                        //   {
                        //     label: this.formatMessage('remove'),
                        //     iconProps: () => ({ icon: CloseOutlined, size: 12 }),
                        //     action: () => {
                        //       this.removeLayer(index)
                        //     }
                        //   }
                        // ]
                      }))}

                      renderOverrideItemCommands={(actionData, refComponent) => {
                        const { itemJsons: [currentItemJson] } = refComponent.props
                        const curTemplateId = currentItemJson.itemStateDetailContent.id
                        return (<div css={css('display: flex; align-items: center;position:relative')} className="jimu-tree-command-list jimu-tree-item__commands ">
                          {/* <Button className="jimu-btn jimu-tree-command-list__command-item app-root-emotion-cache-ltr-1s0suae icon-btn btn btn-tertiary" css={css('padding: 0;background: none; outline: none; border: none;')} */}
                          <Dropdown onClick={(e: any) => { e.stopPropagation() }}>
                            <DropdownButton className="p-0" icon={true}
                              disabled={(this.state.samplePrintingTemplateIds || []).indexOf(curTemplateId) >= 0}
                              arrow={false} type='tertiary' title={this.i18n('more')} >
                              {(this.state.samplePrintingTemplateIds || []).indexOf(curTemplateId) >= 0 ? <ProgressTypeLoading size={12} /> : <MoreHorizontalOutlined size={12} className='group-dropdown-icon' />}
                            </DropdownButton>
                            <DropdownMenu>
                              <DropdownItem disabled={!this.state.featureCount} className='dropdown-item-group'
                                onClick={(e) => { e.stopPropagation(); this.printSampleTemplate(currentItemJson.itemStateDetailContent) }}>
                                <Tooltip title={!this.state.featureCount ? (this.state.dataSource?.dataViewId === CONSTANTS.SELECTION_DATA_VIEW_ID ? this.i18n('noSelectedFeature') : this.i18n('noRecordsErr')) : ''} showArrow placement='left' interactive={true} leaveDelay={100}>
                                  <div title={this.i18n('printSampleReportTip', { previewCount: 20 })}>
                                    {this.i18n('printSampleReport')}
                                  </div>
                                </Tooltip>
                              </DropdownItem>
                              <DropdownItem className='dropdown-item-group'>
                                {/* we don't want the anchor style here*/}
                                <div css={css('position: relative;')}>
                                  {this.i18n('downloadTemplate')}
                                  <a
                                    css={css('position: absolute; display: block; width: 100%; left: 0; top: 0; bottom: 0;')}
                                    href={currentItemJson.itemStateDetailContent.url}
                                    rel='noopener noreferrer'
                                    onClick={(e) => { e.stopPropagation() }}
                                    download target='_blank'>
                                  </a>
                                </div>

                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>

                          {/* <Button className="p-0" icon={true} type={'tertiary'}
                            ><MoreHorizontalOutlined size={12} /></Button> */}
                            <Button className="p-0" icon={true} type={'tertiary'}
                              disabled={(this.state.samplePrintingTemplateIds || []).indexOf(curTemplateId) >= 0}
                              title={this.i18n('removeTemplate')}
                              onClick={(e) => { this.removeTemplate(e, curTemplateId) }}
                            ><CloseOutlined size={12} /></Button>
                          {/* {(this.state.samplePrintingTemplateIds || []).indexOf(curTemplateId) >= 0 && <Loading type={LoadingType.Secondary}/>} */}
                        </div>)
                      }}

                      renderOverrideItemDetailToggle={(actionData, refComponent) => {
                        // const { itemJsons } = refComponent.props
                        // const [currentItemJson] = itemJsons
                        return ''
                        // return ((currentItemJson as any).hasSyntaxError ? <WarningOutlined color='var(--warning)'/> : '')
                      }}
                      // onUpdateItem={(actionData, refComponent) => {
                      //   const { itemJsons } = refComponent.props
                      //   const [currentItemJson, parentItemJson] = itemJsons
                      //   this.onSeletedTemplateUpdated(parentItemJson, +currentItemJson.itemKey)
                      // }}
                      onClickItemBody={(actionData, refComponent) => {
                        const { itemJsons: [currentItemJson] } = refComponent.props
                        this.openTemplateEditor(currentItemJson.itemKey, true, currentItemJson.itemStateDetailContent)
                      }}
                      {...advancedActionMap}
                    />
                    : ''
                  }
                  {this.state.seletedTemplateItems?.length === this.state.activeTemplateIdx && this.state.showTemplateEditor &&
                    <List
                      className='setting-ui-template-list-new w-100'
                      itemsJson={[{
                        name: '......'
                      }].map((item, x) => ({
                        itemStateDetailContent: item,
                        itemKey: `${this.state.activeTemplateIdx}`,
                        itemStateChecked: true,
                        itemStateTitle: item.name,
                        itemStateCommands: []
                      }))}
                      dndEnabled={false}
                      renderOverrideItemDetailToggle={() => '' }
                      {...advancedActionMap}
                    />
                  }
                </div>
              {/* the report template editor popper */}
              <SidePopper
                position='right' title={this.i18n('manageTempate')}
                aria-label={this.i18n('manageTempate')}
                isOpen={this.state.showTemplateEditor}
                toggle={() => { this.closeSidePopper(PopperName.templateEditor) }}
                trigger={this.templateEditorPopperTrigger?.current}
                backToFocusNode={this.state.popperFocusNode}
                // isOpen={this.state.showTemplateEditor} toggle={() => { this.closeSidePopper(PopperName.templateEditor) }} trigger={this.innerSettingButtonRef.current}
                >
                <TemplateEditor
                  // templates={this.state.editingTemplate}
                  featureLayerUrl={this.state.featureLayerUrl}
                  editTemplate={this.state.editingTemplate}
                  selectedTemplates={this.state.seletedTemplateItems}
                  theme={this.props.theme}
                  templates={this.state.templateItems}
                  surveyItemInfo={this.state.surveyItemInfo}
                  editDisabled={!this.state.allowToEdit}
                  onDeleteTemplate={(id) => { this.removeTemplate(null, id, true) }}
                  onSaveTemplate={(template) => { this.updateTemplate(template) }}
                  // mergeFiles={this.props.config.mergeFiles}
                  // onLabelChanged={(type, evt) => { this.onLabelChanged(type, evt) }}
                  // onVisibilityChanged={(type, evt) => { this.onVisibilityChanged(type, evt) }}
                  // onSettingValueChanged={(type, evt) => { this.onDefaultValueChanged(type, evt) }}
                >
                </TemplateEditor>
              </SidePopper>
            </SettingRow>
          </div>
        </SettingSection>
      // </div>
    )

    /**
     * configration
     */
    const configSection =
      <div className='option-setting-outter'>
        <SettingSection title={this.i18n('configration')} role="group" aria-label={this.i18n('inputFeatures')}>
          <SettingRow>
            <div className='w-100 option-setting'>
              <ConfigItem
                label={this.props.config.inputFeaturesLabel}
                defaultLabel={this.i18n('inputFeatures')}
                checked={!(this.props.config.hides || []).includes('inputFeatures') || false}
                onValueChange={(evt) => { this.onLabelChanged('inputFeatures', evt) }}
                onCheckedChange={checked => { this.onVisibilityChanged('inputFeatures', checked) }}
              >
              <div>
                {this.state.dataSource
                  ? <ExpressionEditor
                  dataSources={this.state.dataSource}
                  theme={this.props.theme}
                  value={this.state.inputFeatureTemplate}
                  // onChange={(val) => {
                  //   this.setState({
                  //     inputFeatureTemplate: val
                  //   })
                  // }}
                  onBlur={(val) => {
                    this.props.onSettingChange({
                      id: this.props.id,
                      config: this.props.config.set('inputFeatureTemplate', val)
                    })
                  }}
                >
                </ExpressionEditor> : ''}

              </div>
              </ConfigItem>
            </div>
            {/* <ExpressionInput/> */}
          </SettingRow>
          <SettingRow role="group" aria-label={this.i18n('selectTemplate')}>
            <div className='w-100 option-setting'>
              <ConfigItem
                label={this.props.config.selectTemplateLabel}
                defaultLabel={this.i18n('selectTemplate')}
                checked={!(this.props.config.hides || []).includes('selectTemplate') || false}
                onValueChange={(evt) => { this.onLabelChanged('selectTemplate', evt) }}
                onCheckedChange={checked => { this.onVisibilityChanged('selectTemplate', checked) }}
              >
              </ConfigItem>
            </div>
          </SettingRow>

          <SettingRow role="group" aria-label={this.i18n('reportSettings')}>
            <div className='w-100 option-setting'>
              <ConfigItem
                showSettingButton={true}
                ref={this.innerSettingButtonRef}
                onSettingBtnClick={() => { this.openSidePopper(PopperName.outputSetting) }}
                label={this.props.config.reportSettingLabel}
                defaultLabel={this.i18n('reportSettings')}
                checked={!(this.props.config.hides || []).includes('reportSetting') || false}
                onValueChange={(evt) => { this.onLabelChanged('reportSetting', evt) }}
                onCheckedChange={checked => { this.onVisibilityChanged('reportSetting', checked) }}
              >
              </ConfigItem>
              <SidePopper
                position='right' title={this.i18n('reportSettings')} aria-label={this.i18n('reportSettings')}
                isOpen={this.state.showOutputSetting} toggle={() => { this.closeSidePopper(PopperName.outputSetting) }} trigger={this.innerSettingButtonRef.current}
                >
                <OutputSettingPanel
                  dataSource={this.state.dataSource}
                  fileOptionsLabel={this.props.config.fileOptionsLabel}
                  reportNameLabel={this.props.config.reportNameLabel}
                  saveToAGSAccountLabel={this.props.config.saveToAGSAccountLabel}
                  outputFormatLabel={this.props.config.outputFormatLabel}
                  theme={this.props.theme}
                  hides={this.props.config.hides}
                  mergeFiles={this.props.config.mergeFiles}
                  reportName={this.props.config.reportName}
                  outputFormat={this.props.config.outputFormat}
                  onLabelChanged={(type, evt) => { this.onLabelChanged(type, evt) }}
                  onVisibilityChanged={(type, evt) => { this.onVisibilityChanged(type, evt) }}
                  onSettingValueChanged={(type, evt) => { this.onDefaultValueChanged(type, evt) }}
                >
                </OutputSettingPanel>
              </SidePopper>
            </div>
          </SettingRow>
          <SettingRow role="group" aria-label={this.i18n('showCredits')}>
            <div className='w-100 option-setting'>
              <ConfigItem
                label={this.props.config.showCreditsLabel}
                defaultLabel={this.i18n('showCredits')}
                checked={!(this.props.config.hides || []).includes('showCredits') || false}
                onValueChange={(evt) => { this.onLabelChanged('showCredits', evt) }}
                onCheckedChange={checked => { this.onVisibilityChanged('showCredits', checked) }}
              >
              </ConfigItem>
            </div>
          </SettingRow>
          <SettingRow role="group" aria-label={this.i18n('generateReports')}>
            <div className='w-100 option-setting'>
              <ConfigItem
                label={this.props.config.generateReportLabel}
                defaultLabel={this.i18n('generateReports')}
                onValueChange={(evt) => { this.onLabelChanged('generateReport', evt) }}
                hideSwitcher={true}
              >
              </ConfigItem>
            </div>
          </SettingRow>
          <SettingRow role="group" aria-label={this.i18n('recentReports')}>
            <div className='w-100 option-setting'>
              <ConfigItem
                label={this.props.config.recentReportsLabel}
                defaultLabel={this.i18n('recentReports')}
                onValueChange={(evt) => { this.onLabelChanged('recentReports', evt) }}
                hideSwitcher={true}
              >
              </ConfigItem>
            </div>
          </SettingRow>
        </SettingSection>

      </div>

    return (
      <div ref={this.rootRef} css={getStyle(this.props.theme)} className='jimu-widget-setting widget-setting-feature-report h-100 '>
        {dataSourceSection}

        {!useDataSource || this.state.datasourceInvalid ? null : templateSettingSection }

        {!useDataSource || this.state.datasourceInvalid ? null : configSection }
      </div>
    )
  }
}
