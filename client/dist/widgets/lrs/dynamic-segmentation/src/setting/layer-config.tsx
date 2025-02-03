/** @jsx jsx */
import { React, jsx, css, type ImmutableObject, hooks } from 'jimu-core'
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import { Select } from 'jimu-ui'
import defaultMessages from './translations/default'
import { useDataSourceExists } from '../common/use-data-source-exist'
import { type AttributeSets, type LrsLayer, LrsLayerType } from 'widgets/shared-code/lrs'

interface Props {
  widgetId: string
  total: number
  index: number
  lrsLayer?: ImmutableObject<LrsLayer>
  attributeSets: ImmutableObject<AttributeSets>
  lineAttributeSet: string
  pointAttributeSet: string
  onLayerChanged: (index: number, item: ImmutableObject<LrsLayer>, dsUpdateRequired?: boolean) => void
}

export function LayerConfig (props: Props) {
  const { widgetId, index, lrsLayer, attributeSets, lineAttributeSet, pointAttributeSet, onLayerChanged } = props
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const [itemLabel, setItemLabel] = React.useState(lrsLayer?.name)
  const dsExist: boolean = useDataSourceExists({ widgetId, useDataSourceId: lrsLayer?.useDataSource?.dataSourceId })

  React.useEffect(() => {
    // Update if label has changed.
    if (lrsLayer?.name && itemLabel !== lrsLayer?.name) {
      setItemLabel(lrsLayer?.name)
    }
    // eslint-disable-next-line
  }, [lrsLayer?.name])

  const updateProperty = React.useCallback((prop: string, value: any, dsUpdateRequired = false) => {
    // Updates a single property on the current layer.
    let newItem
    if (value == null) {
      newItem = lrsLayer.without(prop as any)
    } else {
      newItem = lrsLayer.set(prop, value)
    }
    onLayerChanged(index, newItem, dsUpdateRequired)
  }, [onLayerChanged, index, lrsLayer])

  const getAttributeFields = (): string[] => {
    const selectedAttributeSet = lrsLayer.eventInfo?.isPointEvent ? pointAttributeSet : lineAttributeSet
    const attributeSet = attributeSets.attributeSet.find((element) => element.title === selectedAttributeSet)
    const attributeSetLayer = attributeSet?.layers.find(l => l.layerId === lrsLayer.serviceId)
    if (!attributeSetLayer) {
      return [lrsLayer.eventInfo.eventIdFieldName]
    }
    const fieldMap = attributeSetLayer.fields.map(f => f.name)
    const fieldMapWithEventId = [...fieldMap, lrsLayer.eventInfo.eventIdFieldName]
    return fieldMapWithEventId
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const setDisplayField = (value: string) => {
    updateProperty('displayField', value)
  }

  const getDisplayField = () => {
    const fields = getAttributeFields()
    if (fields.includes(lrsLayer?.displayField)) {
      return lrsLayer?.displayField
    } else {
      setDisplayField(fields[0])
      return fields[0]
    }
  }

  return (
    <div className='h-100'>
      <div css={css`height: 100%; overflow:auto;`}>
        {lrsLayer && dsExist && lrsLayer.layerType === LrsLayerType.event && (
          <React.Fragment>
            <SettingSection role='group' aria-label={getI18nMessage('eventLabel')} title={getI18nMessage('eventLabel')}>
            {lrsLayer.name}
            <SettingRow flow="wrap" label={getI18nMessage('displayFieldLabel')}>
                  <Select
                    aria-label={getI18nMessage('displayFieldLabel')}
                    className='w-100'
                    size='sm'
                    value={getDisplayField()}
                    onChange={(e) => { setDisplayField(e.target.value) }}>
                      {getAttributeFields().map((element, index) => {
                        return (
                          <options key={index} value={element}>{element}</options>
                        )
                      })}
                  </Select>
                </SettingRow>
              </SettingSection>
            </React.Fragment>
        )}
        </div>
    </div>
  )
}
