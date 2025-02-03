import { BaseVersionManager } from 'jimu-core'
import { type IMConfig } from './config'
import { AnalysisEngine } from '@arcgis/analysis-ui-schema'

class VersionManager extends BaseVersionManager {
  versions = [
    {
      version: '1.14.0',
      description: 'Add analysisEngine in toolConfig',
      upgrader: (oldConfig: IMConfig) => {
        if (!oldConfig.toolList.length) return oldConfig

        if (oldConfig.toolList.every((tool) => !!tool.analysisEngine)) {
          return oldConfig
        }

        const newConfig = oldConfig.set('toolList', oldConfig.toolList.asMutable({ deep: true }).map((tool) => {
          if (!tool.analysisEngine) {
            tool.analysisEngine = AnalysisEngine.Standard
          }
          return tool
        }))

        return newConfig
      }
    },
    {
      version: '1.16.0',
      description: 'Change name for SummarizeRasterWithin and CreateViewshed tools',
      upgrader: (oldConfig: IMConfig) => {
        let newConfig = oldConfig

        const renamedTools = {
          SummarizeRasterWithin: 'ZonalStatistics',
          CreateViewshed: 'GeodesicViewshed'
        }

        const renamedToolOldNames = Object.keys(renamedTools)

        if (oldConfig.toolList?.find((t) => renamedToolOldNames.includes(t.toolName))) {
          newConfig = newConfig.set('toolList', oldConfig.toolList.asMutable({ deep: true }).map((tool) => {
            if (renamedToolOldNames.includes(tool.toolName)) {
              tool.toolName = renamedTools[tool.toolName]
            }
            return tool
          }))
        }
        if (oldConfig.historyResourceItemsFromMap?.find((h) => renamedToolOldNames.includes(h.toolName))) {
          newConfig = newConfig.set('historyResourceItemsFromMap', oldConfig.historyResourceItemsFromMap.asMutable({ deep: true }).map((history) => {
            if (renamedToolOldNames.includes(history.toolName)) {
              history.toolName = renamedTools[history.toolName]
            }
            return history
          }))
        }

        return newConfig
      }
    }
  ]
}

export const versionManager = new VersionManager()
