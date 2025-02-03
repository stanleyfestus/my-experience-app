import { BaseVersionManager } from 'jimu-core'
import { type IMConfig } from './config'

class VersionManager extends BaseVersionManager {
  versions = [{
    version: '1.13.0',
    description: 'Remove useless line-height: normal;',
    upgrader: (oldConfig: IMConfig) => {
      let html = oldConfig.text
      if (html.includes('line-height: normal;')) {
        html = html.replace(/line-height: normal;/gm, 'line-height: 1.2;')
        return oldConfig.set('text', html)
      } else {
        return oldConfig
      }
    }
  }]
}

export const versionManager = new VersionManager()
