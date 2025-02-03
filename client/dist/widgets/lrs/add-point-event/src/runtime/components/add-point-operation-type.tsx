/** @jsx jsx */
import {
  React,
  jsx,
  hooks
} from 'jimu-core'
import defaultMessages from '../translations/default'
import { OperationType } from '../../config'
import { Label, Select } from 'jimu-ui'

export interface AddPointEventOperationTypeProps {
  operationType: OperationType
  onOperationTypeChanged: (type: OperationType) => void
}

export function AddPointEventOperationType (props: AddPointEventOperationTypeProps) {
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const { operationType, onOperationTypeChanged } = props

  const getOperationType = React.useMemo(() => {
    return operationType
  }, [operationType])

  return (
    <div className='add-point-event-operation-type'>
        <Label size="default" className='pt-2 mb-0 px-3' style={{ fontWeight: 500, width: 100, alignItems: 'center' }} >
          {getI18nMessage('typeLabel')}
        </Label>
        <Select
          aria-label={getI18nMessage('typeLabel')}
          className='w-100 px-3'
          size='sm'
          value={getOperationType}
          onChange={(e) => { onOperationTypeChanged(e.target.value) }}
        >
          <option value={OperationType.single}> {getI18nMessage('singleOperation')}</option>
          <option value={OperationType.multiple}> {getI18nMessage('multipleOperation')}</option>
        </Select>
    </div>
  )
}
