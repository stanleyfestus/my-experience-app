/** @jsx jsx */
import {
  React,
  hooks,
  type ImmutableObject,
  jsx
} from 'jimu-core'
import defaultMessages from '../translations/default'
import { SearchMeasuresType, type NetworkItem } from '../../config'
import { CalciteSegmentedControl, CalciteSegmentedControlItem } from '@esri/calcite-components-react'
import { Label } from 'jimu-ui'
import { getCalciteBasicTheme } from 'widgets/shared-code/lrs'

export interface MeasureSegmentControlProps {
  networkItem?: ImmutableObject<NetworkItem>
  searchMeasureBy: SearchMeasuresType
  onChange: (value: SearchMeasuresType) => void
}

export const MeasureSegmentControl = React.memo((props: MeasureSegmentControlProps) => {
  const { networkItem, searchMeasureBy, onChange } = props
  const getI18nMessage = hooks.useTranslation(defaultMessages)

  const handleMeasureTypeChange = (e: any) => {
    onChange(e.target.value)
  }

  const showSearchBySelection = (): boolean => {
    let count = 0
    if (networkItem.searchSingle) { count++ }
    if (networkItem.searchMultiple) { count++ }
    if (networkItem.searchRange) { count++ }
    return count > 1
  }

  return (
    <div className='measures-segment-control'>
      {showSearchBySelection() && (
        <div className='w-100 px-3 pt-2' css={getCalciteBasicTheme()}>
          <Label size="default" className='mb-0 w-100' centric style={{ fontWeight: 500 }}>
            {getI18nMessage('measureType')}
          </Label>
          <CalciteSegmentedControl
            width='full'
            value={searchMeasureBy}
            appearance='outline-fill'
            scale='s'
            onCalciteSegmentedControlChange={handleMeasureTypeChange}
          >
            {networkItem.searchSingle && (
              <CalciteSegmentedControlItem
                checked={searchMeasureBy === SearchMeasuresType.Single ? true : undefined}
                value={SearchMeasuresType.Single}
              >
                {getI18nMessage('single')}
              </CalciteSegmentedControlItem>
            )}
            {networkItem.searchMultiple && (
              <CalciteSegmentedControlItem
                checked={searchMeasureBy === SearchMeasuresType.Multiple ? true : undefined}
                value={SearchMeasuresType.Multiple}
              >
                {getI18nMessage('multiple')}
              </CalciteSegmentedControlItem>
            )}
            {networkItem.searchRange && (
              <CalciteSegmentedControlItem
                checked={searchMeasureBy === SearchMeasuresType.Range ? true : undefined}
                value={SearchMeasuresType.Range}
              >
                {getI18nMessage('range')}
              </CalciteSegmentedControlItem>
            )}
          </CalciteSegmentedControl>
        </div>
      )}
    </div>
  )
})
