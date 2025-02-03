/** @jsx jsx */
import { React, jsx, css, hooks } from 'jimu-core'
import { defaultMessages as jimuUIMessages, Switch } from 'jimu-ui'
import defaultMessages from '../translations/default'

interface Props {
  disabled?: boolean
  checked: boolean // switch on or switch off
  titleKey: string
  className?: string
  onSwitchChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
}

const titleKeyStyle = css`width: 184px; padding-right: 16px;`

export default function TitleWithSwitch (props: Props) {
  const { checked, titleKey, onSwitchChange } = props
  const disabled = !!props.disabled
  const customClassName = props.className || ''
  const className = `w-100 d-flex align-items-center ${customClassName}`
  const translate = hooks.useTranslation(jimuUIMessages, defaultMessages)

  return (
    <div className={className}>
      <div
        className='text-break text-wrap d-inline'
        css={titleKeyStyle}
        aria-label={translate(titleKey)}
      >
        {translate(titleKey)}
      </div>

      <div className='ml-auto'>
        <Switch
          checked={checked}
          disabled={disabled}
          onChange={onSwitchChange}
        />
      </div>
    </div>
  )
}
