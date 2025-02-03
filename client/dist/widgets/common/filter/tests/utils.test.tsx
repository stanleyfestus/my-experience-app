import { createIntl } from 'jimu-core'
import { getGroupOrCustomName } from '../src/setting/utils'
import { defaultMessages as jimuUIMessages } from 'jimu-ui'
import defaultMessages from './../src/setting/translations/default'

import { FilterItemType } from '../src/config'

const intl = createIntl({
  locale: 'en',
  defaultLocale: 'en',
  messages: Object.assign({}, defaultMessages, jimuUIMessages)
})

const i18nMessage = (id: string, values?: any) => {
  return intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] }, values)
}

describe('setting utils', function () {
  describe('getGroupOrCustomName', function () {
    it('use custom label if it exists.', function () {
      const fItems = [
        { type: FilterItemType.Group, name: 'Group 3' },
        { type: FilterItemType.Single, name: 'Group 7' },
        { type: FilterItemType.Custom, name: 'Custom filter 5' }
      ]
      const groupLabel = getGroupOrCustomName(fItems as any, { name: 'Group name' } as any, FilterItemType.Group, i18nMessage)
      expect(groupLabel).toEqual('Group name')
      const customLabel = getGroupOrCustomName(fItems as any, { name: 'Custom filter name' } as any, FilterItemType.Custom, i18nMessage)
      expect(customLabel).toEqual('Custom filter name')
    })
    it('get biggest num from group items, ignore single items.', function () {
      const fItems = [
        { type: FilterItemType.Group, name: 'Group 3' },
        { type: FilterItemType.Group, name: 'Group 4' },
        { type: FilterItemType.Custom, name: 'Custom filter 2' },
        { type: FilterItemType.Custom, name: 'Custom filter 6' },
        { type: FilterItemType.Single, name: 'Group 7' },
        { type: FilterItemType.Single, name: 'Group 9' }
      ]
      const groupLabel = getGroupOrCustomName(fItems as any, null, FilterItemType.Group, i18nMessage)
      expect(groupLabel).toEqual('Group 5')
      const customLabel = getGroupOrCustomName(fItems as any, null, FilterItemType.Custom, i18nMessage)
      expect(customLabel).toEqual('Custom filter 7')
    })
    it('get bigger num from group items, only when item prefix equals "Group" exactly.', function () {
      const fItems = [
        { type: FilterItemType.Group, name: 'Group abc 3' },
        { type: FilterItemType.Group, name: 'abc Group 4' },
        { type: FilterItemType.Group, name: 'Group 1' }
      ]
      const label = getGroupOrCustomName(fItems as any, null, FilterItemType.Group, i18nMessage)
      expect(label).toEqual('Group 2')
    })
  })
})
