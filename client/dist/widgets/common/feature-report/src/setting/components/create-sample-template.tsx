/** @jsx jsx */
import { React, jsx, css, defaultMessages as jimuCoreMessages, hooks, type IMThemeVariables, type SerializedStyles } from 'jimu-core'
import { defaultMessages as jimuUIMessages, Checkbox, Button, Tooltip, Loading, LoadingType } from 'jimu-ui'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import defaultMessages from '../translations/default'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'
import { IndividualRecordIcon } from './icons/individual-record-icon'
import { SummaryRecordIcon } from './icons/summary-record-icon'
import { CombinedRecordIcon } from './icons/combined-record-icon'
import { createSampleTemplates, getReportTemplates } from '../../utils'
const { useState, useEffect } = React

const allDefaultMessages = Object.assign({}, defaultMessages, jimuCoreMessages, jimuUIMessages)

interface CreateSampleTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any
  onSampleTemplatesCreated?: any
  surveyItemInfo?: any
  featureLayerUrl?: string
  editDisabled?: boolean
  templates?: any[]
}

export const CreateSampleTemplate = (props: CreateSampleTemplateProps): React.ReactElement => {
  const { onSampleTemplatesCreated, theme, surveyItemInfo, featureLayerUrl, editDisabled, templates } = props
  const getStyle = (theme?: IMThemeVariables): SerializedStyles => {
    // const inputVars = theme?.components?.input
    return css`
      .option-setting {
        // padding: 0.75rem;
        padding: 0.5rem;
        background: ${theme.sys.color.action.pressed}; // #181818;
        ul {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0;
          li {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0.5rem 0;
            >div {
              max-width: calc(100% - 24px);
              display: flex;
              gap: 0.275rem;
              align-items: center;
              span.template-label {
                margin: 0 -2px;
              }
            }
          }
        }
      }
      .jimu-widget-setting--row {
        background: ${theme.sys.color.divider.tertiary}  // #3d3d3d
        padding: 0.625rem;
      }
  
      .option-setting-item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        // margin-bottom: 8px;
      }`
  }
  const translate = hooks.useTranslation(allDefaultMessages)
  const [showLoading, setShowLoading] = React.useState(false)
  const [allTemplates, setAllTemplates] = useState<any[]>(templates || [])

  useEffect(() => {
    setAllTemplates(templates)
  }, [templates])

  /**
   * on option checked
   */
  const [selectedTemplates, setSelectedTemplates] = useState([])

  const onOptionsChanged = (checked, name): void => {
    const status = [].concat(selectedTemplates)
    const idx = status.indexOf(name)
    if (checked) {
      if (idx < 0) {
        status.push(name)
      }
    } else {
      if (idx >= 0) {
        status.splice(idx, 1)
      }
    }
    setSelectedTemplates(status)
  }

  /**
   * execute creating sample templates
   */
  const createSampleTemplatesBtnClicked = () => {
    setShowLoading(true)
    let newIds = []
    createSampleTemplates(selectedTemplates, surveyItemInfo, featureLayerUrl, allTemplates).then((res) => {
      newIds = (res || []).map((tmpt) => {
        return tmpt.id
      })
      return getReportTemplates(surveyItemInfo.id)
    }).then((items) => {
      setShowLoading(false)
      const newItems = (items || []).filter((item) => {
        return newIds.includes(item.id)
      })
      onSampleTemplatesCreated(items, newItems)
    }).catch((err) => {
      console.error('Failed to create sample templates', err)
      setShowLoading(false)
    })
  }

  return (
      <SettingRow css={getStyle(theme)}>
          <div className='w-100 option-setting'>
            <p role="menu" aria-describedby="newTemplateBtn">{translate('reportTemplateTip')}</p>
            <div css={css('position:relative;')}>
              <ul>
                <li aria-describedby="individualTooltip">
                  <div>
                    <Checkbox
                        className='can-x-switch' checked={selectedTemplates.includes('individual')}
                        data-key='individual' onChange={evt => { onOptionsChanged(evt.target.checked, 'individual') }}
                        aria-label={translate('individualRecordTemplate')
                        }
                        />
                        <IndividualRecordIcon size={16} />
                        <span className='template-label'>
                          {translate('individualRecordTemplate')}
                        </span>
                  </div>
                  <Tooltip id="individualTooltip" title={translate('individualRecordTemplateTip')} placement='left' interactive={true} >
                    <span>
                      <InfoOutlined />
                    </span>
                  </Tooltip>
                </li>
                <li aria-describedby="summaryTooltip">
                  <div>
                    <Checkbox
                        className='can-x-switch' checked={selectedTemplates.includes('summary')}
                        data-key='summary' onChange={evt => { onOptionsChanged(evt.target.checked, 'summary') }}
                        aria-label={translate('summaryTemplate')}
                        />
                        <SummaryRecordIcon size={16} />
                        <span className='template-label'>
                          {translate('summaryTemplate')}
                        </span>
                  </div>

                  <Tooltip id="summaryTooltip" title={translate('summaryTemplateTip')} placement='left' interactive={true} >
                    <span>
                      <InfoOutlined />
                    </span>
                  </Tooltip>
                </li>
                <li aria-describedby="summaryIndividualTooltip">
                  <div>
                    <Checkbox
                        className='can-x-switch' checked={selectedTemplates.includes('summaryIndividual')}
                        data-key='summaryIndividual' onChange={evt => { onOptionsChanged(evt.target.checked, 'summaryIndividual') }}
                        aria-label={translate('combinedTemplate')}
                        />
                        <CombinedRecordIcon size={16} />
                        <span className='template-label'>
                          {translate('combinedTemplate')}
                        </span>
                  </div>

                  <Tooltip id="summaryIndividualTooltip" title={translate('combinedTemplateTip')} placement='left' interactive={true} >
                    <span>
                      <InfoOutlined />
                    </span>
                  </Tooltip>
                </li>
              </ul>

              <Tooltip title={editDisabled ? translate('noActions') : ''} showArrow placement='left' interactive={true} leaveDelay={100}>
                <Button type="default" disabled={!selectedTemplates.length || showLoading || editDisabled} className="w-100 add-template-btn" onClick={createSampleTemplatesBtnClicked}>
                    {translate('createSampleTemplate')}
                    {showLoading && <Loading type={LoadingType.Primary}/>}
                </Button>
              </Tooltip>
            </div>

          </div>
      </SettingRow>)
}
