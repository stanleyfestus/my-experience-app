/** @jsx jsx */
import { React, css, jsx, defaultMessages as jimuCoreDefaultMessage, type ImmutableArray, Immutable, polished, hooks } from 'jimu-core'
import { SettingSection, SettingRow, SidePopper } from 'jimu-ui/advanced/setting-components'
import { TextInput, Select, Option, Checkbox, Switch, NumericInput, MultiSelect, AlertPopup, CollapsablePanel, Loading, defaultMessages as jimuiDefaultMessage } from 'jimu-ui'
import { type SettingChangeFunction } from 'jimu-for-builder'
import { type JimuMapView } from 'jimu-arcgis'
import { type IMPrintTemplateProperties, type PrintTemplateProperties, type IMConfig, DEFAULT_MAP_WIDTH, DEFAULT_MAP_HEIGHT, PrintTemplateType, type ReportTypes, ModeType, LayoutTypes, type ActiveItem } from '../../config'
import defaultMessages from '../translations/default'
import { getIndexByTemplateId, checkIsCustomTemplate, checkIsMapOnly, getLegendLayer, getScaleBarList, mergeTemplateSetting, getKeyOfNorthArrow, checkIsReportsTemplateAvailable } from '../../utils/utils'
import CommonTemplateSetting from './template-common-setting'
import LayoutTemplateSetting from './layout-template-setting'
import ReportTemplateSetting from './report-template-setting'
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning'
import { getNewLayoutTemplateByLayoutName } from '../util/util'
const { useEffect, useState, useRef } = React
const EditIcon = require('jimu-icons/svg/outlined/editor/edit.svg')

interface Props {
  id: string
  isOpen: boolean
  config: IMConfig
  trigger?: HTMLElement
  popperFocusNode?: HTMLElement
  activeTemplateId: string
  jimuMapView: JimuMapView
  toggle: () => void
  handelTemplateListChange?: (newTemplate: PrintTemplateProperties[]) => void
  onSettingChange?: SettingChangeFunction
}

interface CustomTextElementsOpenType {
  [key: string]: boolean
}

type IMCustomTextElementsOpenList = ImmutableArray<CustomTextElementsOpenType>

enum SettingCollapseType {
  MapSize = 'MAP SIZE',
  Author = 'AUTHOR',
  Copyright = 'COPYRIGHT',
  Legend = 'LEGEND',
  ScaleBarUnit = 'SCALE BAR UNIT',
  AttributionVisible = 'ATTRIBUTION VISIBLE',
  CustomTextElements = 'CUSTOM TEXZT ELEMENTS',
  NorthArrow = 'NORTH ARROW'
}

interface AvailableReportTemplateInfo {
  reportOptions: any
  reportTypes?: ReportTypes
  customReportItem?: ActiveItem
  report?: string
  templateIndex?: number
  templateId?: string
}

interface TemplateItemUpdateTypes {
  isTemplateChange: boolean
  newTemplateItem?: PrintTemplateProperties
}

const CustomSetting = (props: Props) => {
  const nls = hooks.useTranslation(defaultMessages, jimuiDefaultMessage, jimuCoreDefaultMessage)
  const { id, isOpen, trigger, popperFocusNode, config, activeTemplateId, jimuMapView, toggle, handelTemplateListChange, onSettingChange } = props
  const preTemplateIndexRef = useRef<number>(null)
  const preAvailableReportRef = useRef(null as AvailableReportTemplateInfo)
  const templateListRef = useRef(null as ImmutableArray<PrintTemplateProperties>)
  useEffect(() => {
    getCurrentTemplate()
    // eslint-disable-next-line
  }, [config, activeTemplateId])

  const [template, setTemplate] = useState(null as IMPrintTemplateProperties)
  const [templateIndex, setTemplateIndex] = useState(null as number)
  const [templateList, setTemplateList] = useState(null as ImmutableArray<PrintTemplateProperties>)
  const [templateName, setTemplateName] = useState(template?.label || '')
  const [mapWidth, setMapWidth] = useState(template?.exportOptions?.width)
  const [mapHeight, setMapHeight] = useState(template?.exportOptions?.height)
  const [authorText, setAuthorText] = useState(template?.layoutOptions?.authorText || '')
  const [copyrightText, setCopyrightText] = useState(template?.layoutOptions?.copyrightText || '')
  const [openCollapseType, setOpenCollapseType] = useState(null as SettingCollapseType)
  const [customTextElements, setCustomTextElements] = useState(template?.layoutOptions?.customTextElements)
  const [customTextElementsOpenList, setCustomTextElementsOpenList] = useState(null as IMCustomTextElementsOpenList)
  const [isOpenRemind, setIsOpenRemind] = useState(false)
  const [northArrowKey, setNorthArrowKey] = useState(null)
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    checkAndResetAvailableTemplate(preTemplateIndexRef.current)
    preAvailableReportRef.current = null
    typeof templateIndex === 'number' && (preTemplateIndexRef.current = templateIndex)
    return () => {
      checkAndResetAvailableTemplate(preTemplateIndexRef.current)
    }
    //eslint-disable-next-line
  }, [templateIndex])

  useEffect(() => {
    setNorthArrowKey(getKeyOfNorthArrow(template?.layoutOptions?.elementOverrides))
    setTemplateName(template?.label || '')
    setMapWidth(template?.exportOptions?.width)
    setMapHeight(template?.exportOptions?.height)
    setAuthorText(template?.layoutOptions?.authorText || '')
    setCopyrightText(template?.layoutOptions?.copyrightText || '')
    setCustomTextElements(template?.layoutOptions?.customTextElements)
    initPreAvailableReport(template)
    //eslint-disable-next-line
  }, [template])

  useEffect(() => {
    initCustomTextElementsOpenList()
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (checkIsUpdateCustomTextElementsOpenList()) {
      initCustomTextElementsOpenList()
    }
    //eslint-disable-next-line
  }, [customTextElements])

  const initPreAvailableReport = (template: IMPrintTemplateProperties) => {
    const { defaultCustomReportItem, defaultReportTemplate, supportCustomReport, supportReport } = config
    if (!template) return
    const option = {
      defaultCustomReportItem,
      defaultReportTemplate,
      supportCustomReport,
      supportReport,
      reportOptions: template?.reportOptions,
      reportTypes: template?.reportTypes
    }
    const isReportTemplateAvailable = checkIsReportsTemplateAvailable(option)
    if (isReportTemplateAvailable) {
      const preAvailableReport = {
        reportOptions: template?.reportOptions,
        reportTypes: template?.reportTypes,
        customReportItem: template?.customReportItem,
        report: template?.report,
        templateIndex: templateIndex,
        templateId: template.templateId
      }
      preAvailableReportRef.current = preAvailableReport
    }
  }

  const checkIsUpdateCustomTextElementsOpenList = () => {
    if (!customTextElements) return false
    if (customTextElements?.length !== customTextElementsOpenList?.length) {
      return true
    } else {
      let isUpdate = false
      customTextElements?.forEach((item, index) => {
        for (const key in item) {
          if (!Object.prototype.hasOwnProperty.call(customTextElementsOpenList[index], key)) {
            isUpdate = true
          }
        }
      })
      return isUpdate
    }
  }

  const toggleLoading = (showLoading = false) => {
    setShowLoading(showLoading)
  }

  const initCustomTextElementsOpenList = () => {
    const enableList = customTextElements?.map((info, index) => {
      const enable = {} as CustomTextElementsOpenType
      for (const key in info) {
        enable[key] = false
      }
      return enable
    })
    setCustomTextElementsOpenList(Immutable(enableList || []))
  }

  const getCurrentTemplate = () => {
    const isCustomTemplate = checkIsCustomTemplate(config?.printServiceType, config?.printTemplateType)
    const templateList = isCustomTemplate ? config?.printCustomTemplate : config?.printOrgTemplate
    const index = getIndexByTemplateId(templateList?.asMutable({ deep: true }), activeTemplateId)
    setTemplateIndex(index)
    setTemplateList(templateList)
    setTemplate(templateList?.[index] || null)
    templateListRef.current = templateList
  }

  const handelCustomSettingChange = (key: string[], value) => {
    const newTemplate = template.setIn(key, value)
    const newTemplateList = templateList?.asMutable({ deep: true })
    newTemplateList[templateIndex] = newTemplate?.asMutable({ deep: true })
    handelTemplateListChange(newTemplateList)
  }

  const handleTemplateNameAccept = (value) => {
    if (!value) {
      setTemplateName(template?.label)
      return false
    }
    handelCustomSettingChange(['label'], value)
  }

  const handleTemplateNameChange = (event) => {
    const value = event?.target?.value
    setTemplateName(value)
  }

  const handleMapWidthAccept = (value) => {
    if (!value || Number(value) < 1) {
      setMapWidth(template?.exportOptions?.width)
      return false
    }
    handelCustomSettingChange(['exportOptions', 'width'], Number(value))
  }

  const handleMapWidthChange = (value) => {
    if (value < 1) return false
    setMapWidth(value)
  }

  const handleMapHeightAccept = (value) => {
    if (!value || Number(value) < 1) {
      setMapHeight(template?.exportOptions?.height)
      return false
    }
    handelCustomSettingChange(['exportOptions', 'height'], Number(value))
  }

  const handleAuthorTextChange = (event) => {
    const value = event?.target?.value
    setAuthorText(value)
  }

  const handleAuthorTextAccept = (value) => {
    handelCustomSettingChange(['layoutOptions', 'authorText'], value)
  }

  const handleCopyrightTextChange = (event) => {
    const value = event?.target?.value
    setCopyrightText(value)
  }

  const handleCopyrightTextAccept = (value) => {
    handelCustomSettingChange(['layoutOptions', 'copyrightText'], value)
  }

  const handleMapHeightChange = (value) => {
    setMapHeight(value)
  }

  const openSettingCollapse = (openCollapseType: SettingCollapseType) => {
    closeCustomTextElementCollapse()
    setOpenCollapseType(openCollapseType)
  }

  const closeSettingCollapse = () => {
    closeCustomTextElementCollapse()
    setOpenCollapseType(null)
  }

  const closeCustomTextElementCollapse = () => {
    //close Collapse of custom text elements
    const newCustomTextElementsOpenList = customTextElementsOpenList?.map(item => {
      const enable = {} as CustomTextElementsOpenType
      for (const key in item) {
        enable[key] = false
      }
      return enable
    })
    setCustomTextElementsOpenList(newCustomTextElementsOpenList)
  }

  const handleScalebarUnitChange = (e) => {
    const format = e.target.value
    handelCustomSettingChange(['layoutOptions', 'scalebarUnit'], format)
  }

  const handleCheckBoxChange = (key: string) => {
    handelCustomSettingChange([key], !template?.[key])
  }

  const handleTemplatePropertyChange = (templateProperty: IMPrintTemplateProperties) => {
    const newTemplateList = templateList?.asMutable({ deep: true })
    newTemplateList[templateIndex] = templateProperty?.asMutable({ deep: true })
    handelTemplateListChange(newTemplateList)
  }

  const handleOverrideCommonSettingsChanged = () => {
    const overrideCommonSetting = !template?.overrideCommonSetting
    if (overrideCommonSetting) {
      let newTemplate = template.setIn(['overrideCommonSetting'], overrideCommonSetting)
      newTemplate = mergeTemplateSetting(newTemplate, config?.commonSetting)
      const newTemplateList = templateList?.asMutable({ deep: true })
      newTemplateList[templateIndex] = newTemplate?.asMutable({ deep: true })
      handelTemplateListChange(newTemplateList)
    } else {
      handelCustomSettingChange(['overrideCommonSetting'], overrideCommonSetting)
    }
  }

  const handleLegendChanged = async (e) => {
    const legendEnabled = checkIsLegendEnabled()
    const legendLayers = !legendEnabled ? await getLegendLayer(jimuMapView) : null
    handelCustomSettingChange(['layoutOptions', 'legendLayers'], legendLayers)
  }

  const checkIsLegendEnabled = () => {
    return !!template?.layoutOptions?.legendLayers
  }

  const handleAttributionVisibleChanged = (e) => {
    const attributionVisible = !template?.attributionVisible
    handelCustomSettingChange(['attributionVisible'], attributionVisible)
  }

  const renderMapOnlyCustomSetting = () => {
    return (
      <SettingSection title={nls('MapOnlyOptions')} role='group' aria-label={nls('MapOnlyOptions')}>
        <div role='group' aria-label={nls('setDefaults')}>
        <SettingRow label={nls('setDefaults')} flow='wrap'/>
        {/* Print title */}
        <CollapsablePanel
          label={nls('mapSize')}
          isOpen={openCollapseType === SettingCollapseType.MapSize}
          onRequestOpen={() => { openSettingCollapse(SettingCollapseType.MapSize) }}
          onRequestClose={closeSettingCollapse}
          role='group'
          aria-label={nls('mapSize')}
          rightIcon={EditIcon}
          type='primary'
          className={openCollapseType === SettingCollapseType.MapSize && 'active-collapse'}
        >
          <SettingRow label={nls('width')} className='mt-2'>
            <NumericInput
              className='map-size-input'
              size='sm'
              placeholder={nls('width')}
              value={mapWidth || DEFAULT_MAP_WIDTH}
              onAcceptValue={handleMapWidthAccept}
              onChange={handleMapWidthChange}
              showHandlers={false}
              aria-label={nls('width')}
            />
          </SettingRow>
          <SettingRow label={nls('height')}>
            <NumericInput
              className='map-size-input'
              size='sm'
              placeholder={nls('height')}
              value={mapHeight || DEFAULT_MAP_HEIGHT}
              onAcceptValue={handleMapHeightAccept}
              onChange={handleMapHeightChange}
              showHandlers={false}
              aria-label={nls('height')}
            />
          </SettingRow>
        </CollapsablePanel>
        <CollapsablePanel
          label={nls('mapAttribution')}
          isOpen={openCollapseType === SettingCollapseType.AttributionVisible}
          onRequestOpen={() => { openSettingCollapse(SettingCollapseType.AttributionVisible) }}
          onRequestClose={closeSettingCollapse}
          role='group'
          aria-label={nls('mapAttribution')}
          rightIcon={EditIcon}
          type='primary'
          className={openCollapseType === SettingCollapseType.AttributionVisible && 'active-collapse'}
        >
          <SettingRow flow='wrap' className='mt-2'>
            <div
              title={nls('includeAttribution')}
              className='d-flex w-100 align-items-center check-box-con'
              onClick={handleAttributionVisibleChanged}
            >
              <Checkbox
                title={nls('includeAttribution')}
                className='lock-item-ratio'
                data-field='mapSize'
                checked={!!template?.attributionVisible || false}
              />
              <div className='lock-item-ratio-label text-left ml-2'>
                {nls('includeAttribution')}
              </div>
            </div>
          </SettingRow>
        </CollapsablePanel>
        </div>

        {config.modeType === ModeType.Classic && <SettingRow className='mt-2' flow='wrap' role='group' aria-label={nls('selectEditableSettings')} label={nls('selectEditableSettings')}>
          <div className='w-100'>
            <div
              title={nls('printTitle')}
              className='d-flex w-100 align-items-center check-box-con'
              onClick={() => { handleCheckBoxChange('enableMapSize') }}
            >
              <Checkbox
                title={nls('printTitle')}
                className='lock-item-ratio'
                data-field='mapSize'
                checked={template?.enableMapSize || false}
              />
              <div className='lock-item-ratio-label text-left ml-2'>
                {nls('mapSize')}
              </div>
            </div>
          </div>
          <div className='w-100 mt-1'>
            <div
              title={nls('mapAttribution')}
              className='d-flex w-100 align-items-center check-box-con'
              onClick={() => { handleCheckBoxChange('enableMapAttribution') }}
            >
              <Checkbox
                title={nls('mapAttribution')}
                className='lock-item-ratio'
                data-field='mapSize'
                checked={template?.enableMapAttribution || false}
              />
              <div className='lock-item-ratio-label text-left ml-2'>
                {nls('mapAttribution')}
              </div>
            </div>
          </div>
        </SettingRow>}
      </SettingSection>
    )
  }

  const openCustomTextElementSetting = (key: string, index: number) => {
    const newCustomTextElementsOpenList = customTextElementsOpenList?.map((item, idx) => {
      const enable = {} as CustomTextElementsOpenType
      for (const k in item) {
        if (index === idx && k === key) {
          enable[k] = !customTextElementsOpenList[index][key]
        } else {
          enable[k] = false
        }
      }
      return enable
    })
    setOpenCollapseType(null)
    setCustomTextElementsOpenList(newCustomTextElementsOpenList)
  }

  const renderCustomTextElementsSetting = () => {
    const settingItem = []
    customTextElements?.forEach((info, index) => {
      for (const key in info) {
        const elementItem = (<CollapsablePanel
          label={key}
          key={`${key}_${index}`}
          isOpen={customTextElementsOpenList?.[index]?.[key] || false}
          onRequestOpen={() => { openCustomTextElementSetting(key, index) }}
          onRequestClose={closeSettingCollapse}
          role='group'
          aria-label={key}
          rightIcon={EditIcon}
          type='primary'
          className={customTextElementsOpenList[key] && 'active-collapse'}
        >
          {
           <SettingRow flow='wrap' className='align-item-center mt-2'>
              <TextInput
                size='sm'
                className='flex-grow-1'
                value={info[key] || ''}
                aria-label={key}
                onAcceptValue={value => { handelCustomTextElementsAccept(index, key, value) }}
                onChange={e => { handelCustomTextElementsChange(index, key, e) }}
              />
            </SettingRow>
          }
        </CollapsablePanel>)
        settingItem.push(elementItem)
      }
    })
    return settingItem
  }

  const checkAndResetAvailableTemplate = (index?: number) => {
    const itemIndex = typeof index === 'number' ? index : templateIndex
    const newTemplateList = templateListRef.current?.asMutable({ deep: true })
    let preTemplate = newTemplateList?.[itemIndex]
    if (!preTemplate) return

    let isResetTemplate = false

    const layoutTemplateCheckRes = checkAndResetLayoutTemplate(preTemplate)
    if (layoutTemplateCheckRes.isTemplateChange) {
      isResetTemplate = true
      preTemplate = layoutTemplateCheckRes.newTemplateItem
    }

    const reportTemplateCheckRes = checkAndResetReportTemplate(preTemplate)
    if (reportTemplateCheckRes.isTemplateChange) {
      isResetTemplate = true
      preTemplate = reportTemplateCheckRes.newTemplateItem
    }

    if (isResetTemplate) {
      newTemplateList[itemIndex] = preTemplate
      handelTemplateListChange(newTemplateList)
    }
  }

  const checkAndResetLayoutTemplate = (templateItem: PrintTemplateProperties): TemplateItemUpdateTypes => {
    if (!templateItem) {
      return {
        isTemplateChange: false
      }
    }

    let isTemplateChange = false
    if (templateItem?.layoutTypes === LayoutTypes.CustomLayout && !templateItem.customLayoutItem?.id && config?.layoutChoiceList?.length > 0) {
      templateItem = getNewLayoutTemplateByLayoutName(templateItem, templateItem.layout, config?.layoutChoiceList?.asMutable({ deep: true }))
      isTemplateChange = true
    }
    return {
      isTemplateChange: isTemplateChange,
      newTemplateItem: templateItem
    }
  }

  const checkAndResetReportTemplate = hooks.useEventCallback((templateItem: PrintTemplateProperties): TemplateItemUpdateTypes => {
    if (!templateItem) {
      return {
        isTemplateChange: false
      }
    }

    const { defaultCustomReportItem, defaultReportTemplate, supportCustomReport, supportReport } = config
    let isTemplateChange = false
    let newTemplate = Immutable(templateItem)

    const option = {
      defaultCustomReportItem,
      defaultReportTemplate,
      supportCustomReport,
      supportReport,
      reportOptions: templateItem?.reportOptions,
      reportTypes: templateItem?.reportTypes
    }
    const isReportTemplateAvailable = checkIsReportsTemplateAvailable(option)

    if (!isReportTemplateAvailable && preAvailableReportRef.current && preAvailableReportRef.current?.templateId === templateItem.templateId) {
      const { reportOptions, reportTypes, customReportItem, report } = preAvailableReportRef.current
      newTemplate = newTemplate.set('reportOptions', reportOptions).set('reportTypes', reportTypes).set('customReportItem', customReportItem).set('report', report).set('report', report)
      isTemplateChange = true
    }

    return {
      isTemplateChange: isTemplateChange,
      newTemplateItem: newTemplate?.asMutable({ deep: true })
    }
  })

  const handleLayoutChange = (layoutTemplate: string, index?: number) => {
    const itemIndex = typeof index === 'number' ? index : templateIndex
    const newTemplate = getNewLayoutTemplateByLayoutName(template?.asMutable({ deep: true }), layoutTemplate, config?.layoutChoiceList?.asMutable({ deep: true }))
    const newTemplateList = templateList?.asMutable({ deep: true })
    newTemplateList[itemIndex] = newTemplate
    handelTemplateListChange(newTemplateList)
  }

  const renderCustomTextElementsEnableSetting = () => {
    const settingItem = []
    customTextElements?.forEach((info, index) => {
      for (const key in info) {
        const elementItem = (<div
          key={`${key}_${index}`}
          title={key}
          className='d-flex w-100 align-items-center check-box-con'
          onClick={() => { handleCustomTextElementEnableChange(key, index) }}
        >
          <Checkbox
            title={key}
            className='lock-item-ratio'
            checked={template?.customTextElementEnableList?.[index]?.[key] || false}
          />
          <div className='lock-item-ratio-label text-left ml-2'>
            {key}
          </div>
        </div>)
        settingItem.push(elementItem)
      }
    })
    return settingItem
  }

  const handleCustomTextElementEnableChange = (key: string, index: number) => {
    const enableItem = template?.customTextElementEnableList?.[index]
    const newItem = enableItem.set(key, !enableItem?.[key])
    const newCustomTextElementEnableList = template?.customTextElementEnableList?.asMutable({ deep: true })
    newCustomTextElementEnableList.splice(index, 1, newItem)
    handelCustomSettingChange(['customTextElementEnableList'], newCustomTextElementEnableList)
  }

  const handelCustomTextElementsAccept = (index: number, key: string, value) => {
    const newItem = customTextElements[index].set(key, value)
    const newCustomTextElements = customTextElements?.asMutable({ deep: true })
    newCustomTextElements.splice(index, 1, newItem)
    handelCustomSettingChange(['layoutOptions', 'customTextElements'], newCustomTextElements)
  }

  const handelCustomTextElementsChange = (index: number, key: string, event) => {
    const value = event?.target?.value
    const newItem = customTextElements[index].set(key, value)
    const newCustomTextElements = customTextElements?.asMutable({ deep: true })
    newCustomTextElements.splice(index, 1, newItem)
    setCustomTextElements(Immutable(newCustomTextElements))
  }

  const handleNorthArrowChange = () => {
    const northArrowVisible = template?.layoutOptions?.elementOverrides?.[northArrowKey]?.visible
    handelCustomSettingChange(['layoutOptions', 'elementOverrides', northArrowKey, 'visible'], !northArrowVisible)
  }

  const renderLayoutOptionsCustomSetting = () => {
    return (
      <SettingSection title={nls('LayoutOptions')} role='group' aria-label={nls('LayoutOptions')}>
        <div role='group' aria-label={nls('setDefaults')}>
          <SettingRow label={nls('setDefaults')} flow='wrap'/>
          {template?.hasAuthorText && <CollapsablePanel
            label={nls('printTemplateAuthor')}
            isOpen={openCollapseType === SettingCollapseType.Author}
            onRequestOpen={() => { openSettingCollapse(SettingCollapseType.Author) }}
            onRequestClose={closeSettingCollapse}
            role='group'
            aria-label={nls('printTemplateAuthor')}
            type='primary'
            rightIcon={EditIcon}
            className='mb-2'
          >
            <SettingRow flow='wrap' className='mt-2'>
              <TextInput
                size='sm'
                className='w-100'
                value={authorText}
                onAcceptValue={handleAuthorTextAccept}
                onChange={handleAuthorTextChange}
                aria-label={nls('printTemplateAuthor')}
              />
            </SettingRow>
          </CollapsablePanel>}
          {template?.hasCopyrightText && <CollapsablePanel
            label={nls('copyright')}
            isOpen={openCollapseType === SettingCollapseType.Copyright}
            onRequestOpen={() => { openSettingCollapse(SettingCollapseType.Copyright) }}
            onRequestClose={closeSettingCollapse}
            role='group'
            aria-label={nls('copyright')}
            rightIcon={EditIcon}
            type='primary'
            className='mb-2'
          >
            <SettingRow flow='wrap' className='mt-2'>
              <TextInput
                size='sm'
                className='w-100'
                value={copyrightText}
                onAcceptValue={handleCopyrightTextAccept}
                onChange={handleCopyrightTextChange}
                aria-label={nls('copyright')}
              />
            </SettingRow>
          </CollapsablePanel>}
          {template?.hasLegend && <CollapsablePanel
            label={nls('legend')}
            isOpen={openCollapseType === SettingCollapseType.Legend}
            onRequestOpen={() => { openSettingCollapse(SettingCollapseType.Legend) }}
            onRequestClose={closeSettingCollapse}
            role='group'
            type='primary'
            aria-label={nls('legend')}
            rightIcon={EditIcon}
            className='mb-2'
          >
            <SettingRow flow='wrap' className='mt-2'>
              <div
                title={nls('includeLegend')}
                className='d-flex w-100 align-items-center check-box-con'
                onClick={handleLegendChanged}
              >
                <Checkbox
                  title={nls('includeLegend')}
                  className='lock-item-ratio'
                  checked={checkIsLegendEnabled()}
                />
                <div className='lock-item-ratio-label text-left ml-2'>
                  {nls('includeLegend')}
                </div>
              </div>
            </SettingRow>
          </CollapsablePanel>}
          <CollapsablePanel
            label={nls('scaleBarUnit')}
            isOpen={openCollapseType === SettingCollapseType.ScaleBarUnit}
            onRequestOpen={() => { openSettingCollapse(SettingCollapseType.ScaleBarUnit) }}
            onRequestClose={closeSettingCollapse}
            role='group'
            aria-label={nls('scaleBarUnit')}
            rightIcon={EditIcon}
            type='primary'
            className={openCollapseType === SettingCollapseType.ScaleBarUnit && 'active-collapse'}
          >
            <SettingRow flow='wrap' className='mt-2'>
              <Select
                value={template?.layoutOptions?.scalebarUnit}
                onChange={handleScalebarUnitChange}
                size='sm'
                aria-label={nls('scaleBarUnit')}
              >
                {getScaleBarList(nls).map((item, index) => {
                  return (<Option
                    key={`unit${index}`}
                    value={item.value}
                    title={item.label}
                  >
                    {item.label}
                  </Option>)
                })}
              </Select>
            </SettingRow>
          </CollapsablePanel>
          {template?.layoutOptions?.customTextElements?.length > 0 && renderCustomTextElementsSetting()}
          {northArrowKey && <CollapsablePanel
            label={nls('northArrow')}
            isOpen={openCollapseType === SettingCollapseType.NorthArrow}
            onRequestOpen={() => { openSettingCollapse(SettingCollapseType.NorthArrow) }}
            onRequestClose={closeSettingCollapse}
            role='group'
            type='primary'
            aria-label={nls('northArrow')}
            rightIcon={EditIcon}
            className='mb-2'
          >
            <SettingRow flow='wrap' className='mt-2'>
              <div
                title={nls('includeNorthArrow')}
                className='d-flex w-100 align-items-center check-box-con'
                onClick={handleNorthArrowChange}
              >
                <Checkbox
                  title={nls('includeNorthArrow')}
                  className='lock-item-ratio'
                  checked={template?.layoutOptions?.elementOverrides?.[northArrowKey]?.visible}
                />
                <div className='lock-item-ratio-label text-left ml-2'>
                  {nls('includeNorthArrow')}
                </div>
              </div>
            </SettingRow>
          </CollapsablePanel>}
        </div>

        {config.modeType === ModeType.Classic && <SettingRow className='mt-2' flow='wrap' role='group' aria-label={nls('selectEditableSettings')} label={nls('selectEditableSettings')}>
          <div className='w-100'>
            {template?.hasAuthorText && <div
              title={nls('printTemplateAuthor')}
              className='d-flex w-100 align-items-center check-box-con'
              onClick={() => { handleCheckBoxChange('enableAuthor') }}
            >
              <Checkbox
                title={nls('printTemplateAuthor')}
                className='lock-item-ratio'
                checked={template?.enableAuthor || false}
              />
              <div className='lock-item-ratio-label text-left ml-2'>
                {nls('printTemplateAuthor')}
              </div>
            </div>}
            {template?.hasCopyrightText && <div
              title={nls('copyright')}
              className='d-flex w-100 align-items-center check-box-con'
              onClick={() => { handleCheckBoxChange('enableCopyright') }}
            >
              <Checkbox
                title={nls('copyright')}
                className='lock-item-ratio'
                checked={template?.enableCopyright || false}
              />
              <div className='lock-item-ratio-label text-left ml-2'>
                {nls('copyright')}
              </div>
            </div>}
            {template?.hasLegend && <div
              title={nls('legend')}
              className='d-flex w-100 align-items-center check-box-con'
              onClick={() => { handleCheckBoxChange('enableLegend') }}
            >
              <Checkbox
                title={nls('legend')}
                className='lock-item-ratio'
                checked={template?.enableLegend || false}
              />
              <div className='lock-item-ratio-label text-left ml-2'>
                {nls('legend')}
              </div>
            </div>}
            <div
              title={nls('scaleBarUnit')}
              className='d-flex w-100 align-items-center check-box-con'
              onClick={() => { handleCheckBoxChange('enableScalebarUnit') }}
            >
              <Checkbox
                title={nls('scaleBarUnit')}
                className='lock-item-ratio'
                checked={template?.enableScalebarUnit || false}
              />
              <div className='lock-item-ratio-label text-left ml-2'>
                {nls('scaleBarUnit')}
              </div>
            </div>
            {template?.layoutOptions?.customTextElements?.length > 0 && renderCustomTextElementsEnableSetting()}
            {northArrowKey && <div
              title={nls('northArrow')}
              className='d-flex w-100 align-items-center check-box-con'
              onClick={() => { handleCheckBoxChange('enableNorthArrow') }}
            >
              <Checkbox
                title={nls('northArrow')}
                className='lock-item-ratio'
                checked={template?.enableNorthArrow || false}
              />
              <div className='lock-item-ratio-label text-left ml-2'>
                {nls('northArrow')}
              </div>
            </div>}
          </div>
        </SettingRow>}
      </SettingSection>
    )
  }

  const getFormatValue = (template: IMPrintTemplateProperties) => {
    const format = template?.format
    const selectedFormatList = template?.selectedFormatList?.asMutable({ deep: true })
    if (!format || config.formatList?.includes(format)) {
      return selectedFormatList
    } else {
      return selectedFormatList?.filter(formatItem => formatItem !== format)
    }
  }

  const renderBaseSetting = () => {
    return (
      <SettingSection>
        <SettingRow flow='wrap' label={nls('templateName')}>
          <TextInput
            size='sm'
            className='w-100'
            value={templateName}
            onAcceptValue={handleTemplateNameAccept}
            onChange={handleTemplateNameChange}
            aria-label={nls('templateName')}
            disabled={config?.printTemplateType === PrintTemplateType.OrganizationTemplate}
          />
        </SettingRow>
        <SettingRow flow='wrap' label={nls('fileFormat')} role='group' aria-label={nls('fileFormat')}>
          <MultiSelect
            fluid
            aria-label={nls('fileFormat')}
            items={Immutable(getMultiFormatSelectItems())}
            onClickItem={handleSelectFormatChange}
            values={Immutable(getFormatValue(template))}
            size='sm'
          />
        </SettingRow>

        <LayoutTemplateSetting
          id={id}
          config={config}
          template={template}
          templateIndex={templateIndex}
          handleLayoutChange={handleLayoutChange}
          onSettingChange={onSettingChange}
          toggleLoading={toggleLoading}
        />

        {(config?.supportCustomReport || config?.supportReport) && <ReportTemplateSetting
          id={id}
          config={config}
          template={template}
          templateIndex={templateIndex}
          onSettingChange={onSettingChange}
        />}

        {showLoading && <div className='layout-loading-con position-absolute w-100'>
          <Loading/>
        </div>}
      </SettingSection>
    )
  }

  const handleSelectFormatChange = (evt, value, values: string[]) => {
    if (values?.length === 0) return false
    let newTemplate = template.set('selectedFormatList', values)
    if (!values?.includes(newTemplate.format)) {
      const pdfFormat = config.formatList?.filter(format => (format.toLocaleLowerCase().includes('pdf') && values.includes(format)))
      newTemplate = newTemplate.set('format', pdfFormat[0] || values[0])
    }
    const newTemplateList = templateList?.asMutable({ deep: true })
    newTemplateList[templateIndex] = newTemplate?.asMutable({ deep: true })
    handelTemplateListChange(newTemplateList)
  }

  const getMultiFormatSelectItems = () => {
    return config?.formatList.map((format, index) => {
      return {
        value: format,
        label: format
      }
    })
  }

  const handleToggleRemindModel = () => {
    setIsOpenRemind(!isOpenRemind)
  }

  const REMIND_MODEL_STYLE = css`
    .remind-con {
      padding-left: ${polished.rem(25)};
      color: var(--ref-palette-neutral-1100);
      margin-bottom: ${polished.rem(60)};
      margin-top: ${polished.rem(19)};
      font-size: ${polished.rem(13)};
    }
    .modal-body {
      padding: ${polished.rem(30)} ${polished.rem(30)} 0 ${polished.rem(30)};
    }
    .modal-footer {
      padding: 0 ${polished.rem(30)} ${polished.rem(30)} ${polished.rem(30)};
    }
    .remind-title {
      font-size: ${polished.rem(16)};
      font-weight: 500;
    }
  `
  const renderRemindModel = () => {
    return (
      <AlertPopup
        isOpen={isOpenRemind}
        toggle={handleToggleRemindModel}
        hideHeader={true}
        onClickOk={handleOverrideCommonSettingsChanged}
        onClickClose={handleToggleRemindModel}
        css={REMIND_MODEL_STYLE}
      >
        <div className='align-middle pt-2 remind-title d-flex align-items-center' >
          <div className='mr-1'>
            <WarningOutlined className='align-middle' size='l' color={'var(--warning-600)'} />
          </div>
          <span className='align-middle flex-grow-1'>{nls('overrideSettingsTitle')}</span>
        </div>
        <div className='remind-con'>{nls('overrideSettingsRemind')}</div>
      </AlertPopup>
    )
  }

  const clickOverrideCommonSetting = (e) => {
    const value = e.target.checked
    if (value) {
      handleOverrideCommonSettingsChanged()
    } else {
      handleToggleRemindModel()
    }
  }

  const renderCommonSetting = () => {
    return (
      <SettingSection>
        <SettingRow className='mb-4' label={nls('overrideCommonSettings')}>
          <Switch
            aria-label={nls('overrideCommonSettings')}
            checked={template?.overrideCommonSetting || false}
            onChange={clickOverrideCommonSetting}
          />
        </SettingRow>
        {template?.overrideCommonSetting && <CommonTemplateSetting
          id={id}
          printTemplateProperties={template}
          handleTemplatePropertyChange={handleTemplatePropertyChange}
          modeType={config?.modeType}
          jimuMapView={jimuMapView}
        />}
        {renderRemindModel()}
      </SettingSection>
    )
  }

  const STYLE = css`
    & {
      overflow: auto;
    }
    .text-wrap {
      overflow: hidden;
      white-space: pre-wrap;
    }
    .map-size-input {
      width: ${polished.rem(80)};
    }
    .setting-collapse {
      & {
        margin-bottom: ${polished.rem(8)};
      }
      .collapse-header {
        line-height: 2.2;
        padding-left: ${polished.rem(8)} !important;
        padding-right: ${polished.rem(8)} !important;
      }
    }
    .check-box-con {
      color: var(--ref-palette-neutral-900);
      font-size: ${polished.rem(14)};
      line-height: ${polished.rem(22)};
      margin: ${polished.rem(4)} 0 ${polished.rem(8)} 0;
    }
    .layout-loading-con {
      left: 0;
      height: ${polished.rem(100)};
    }
  `

  const checkIsShowSetting = hooks.useEventCallback((showLoading: boolean, template: IMPrintTemplateProperties) => {
    const useServiceLayout = !template?.layoutTypes || template?.layoutTypes === LayoutTypes.ServiceLayout
    if (showLoading) {
      return false
    }

    if (!useServiceLayout && !template.customLayoutItem?.id) {
      return false
    } else {
      return true
    }
  })

  return (
    <SidePopper isOpen={isOpen} position='right' toggle={toggle} trigger={trigger} title={nls('templateConfiguration')} backToFocusNode={popperFocusNode}>
      <div className='w-100 h-100' css={STYLE}>
        {renderBaseSetting()}
        {checkIsShowSetting(showLoading, template) && <div>
          {/* Render map only setting */}
          {checkIsMapOnly(template?.layout) && renderMapOnlyCustomSetting()}

          {/* Render layout option setting */}
          {!checkIsMapOnly(template?.layout) && renderLayoutOptionsCustomSetting()}

          {renderCommonSetting()}
        </div>}
      </div>
    </SidePopper>
  )
}

export default CustomSetting
