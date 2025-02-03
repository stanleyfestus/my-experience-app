/** @jsx jsx */
import { React, jsx, hooks, css } from 'jimu-core'
import { defaultMessages as jimuUiDefaultMessage, Alert, Dropdown, DropdownButton, DropdownMenu, DropdownItem } from 'jimu-ui'
import { type IMConfig, type PrintTemplateProperties } from '../../config'
import { checkIsReportsTemplateAvailable, getIndexByTemplateId } from '../../utils/utils'
import { getNewTemplateId } from '../util/util'
import { MoreHorizontalOutlined } from 'jimu-icons/outlined/application/more-horizontal'

const STYLE = css`
  .report-remind-alert .jimu-icon-component {
    color: var(--sys-color-warning-main) !important;
  }
`
interface SearchOptionsProps {
  activeTemplateId: string
  itemStateDetailContent: any
  templateList: PrintTemplateProperties[]
  config: IMConfig
  handelActiveTemplateIdChange?: (templateId: string, index?: number) => void
  handelTemplateListChange?: (newTemplate: PrintTemplateProperties[]) => void
}

const TemplateListEditItem = (props: SearchOptionsProps) => {
  const nls = hooks.useTranslation(jimuUiDefaultMessage)
  const { config, templateList, itemStateDetailContent, activeTemplateId, handelActiveTemplateIdChange, handelTemplateListChange } = props
  const [isDropDownOpen, setIsDropDownOpen] = React.useState(false)

  const onRemoveTemplateButtonClick = () => {
    const index = getIndexByTemplateId(templateList, activeTemplateId)
    const newTemplateList = templateList
    newTemplateList?.splice(index, 1)
    handelTemplateListChange(newTemplateList)
    handelActiveTemplateIdChange(null)
  }

  const onDuplicateTemplateButtonClick = (e) => {
    e.stopPropagation()
    const index = getIndexByTemplateId(templateList, activeTemplateId)
    const newTemplateId = getNewTemplateId(templateList, config.printServiceType, config.printTemplateType)
    const newTemplateList = templateList
    const newLabel = getNewLabel(templateList[index].label)
    const newTemplateItem = {
      ...templateList[index],
      templateId: newTemplateId,
      label: newLabel
    } as any
    newTemplateList.push(newTemplateItem)
    handelTemplateListChange(newTemplateList)
    setTimeout(() => {
      handelActiveTemplateIdChange(newTemplateId)
    }, 200)
  }

  const getNewLabel = hooks.useEventCallback((label: string) => {
    let index = 0

    const checkIsLabelExist = (label: string) => {
      const isExist = templateList.some(item => item.label === label)
      return isExist
    }

    const getLabel = (l: string) => {
      if (checkIsLabelExist(l)) {
        index += 1
        l = `${label} ${index}`
        return getLabel(l)
      } else {
        return l
      }
    }
    return getLabel(label)
  })

  const checkIsTemplateAvailable = (template: PrintTemplateProperties): boolean => {
    const { defaultCustomReportItem, defaultReportTemplate, supportCustomReport, supportReport } = config
    const option = {
      defaultCustomReportItem,
      defaultReportTemplate,
      supportCustomReport,
      supportReport,
      reportOptions: template?.reportOptions,
      reportTypes: template?.reportTypes
    }
    return checkIsReportsTemplateAvailable(option)
  }

  const toggleDropDown = (e) => {
    setIsDropDownOpen(!isDropDownOpen)
    e.stopPropagation()
  }

  return (
    (<div className='d-flex align-items-center' css={STYLE}>
      {!checkIsTemplateAvailable(itemStateDetailContent) && <Alert
        className='report-remind-alert'
        buttonType='tertiary'
        form='tooltip'
        size='small'
        type='warning'
        text={nls('reportTemplateRemind')}
      />}
      <Dropdown direction='down' size='sm' useKeyUpEvent toggle={toggleDropDown} isOpen={isDropDownOpen}>
        <DropdownButton size='sm' arrow={false} icon onClick={toggleDropDown} type='tertiary' title={nls('more')}>
          <MoreHorizontalOutlined size='s'/>
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem title={nls('duplicate')} onClick={onDuplicateTemplateButtonClick}>{nls('duplicate')}</DropdownItem>
          <DropdownItem title={nls('deleteOption')} onClick={onRemoveTemplateButtonClick}>{nls('deleteOption')}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>)
  )
}

export default TemplateListEditItem
