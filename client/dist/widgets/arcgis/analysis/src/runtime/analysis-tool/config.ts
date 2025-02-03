import { type GPFeatureRecordSetLayer, type AnalysisToolData } from '@arcgis/analysis-ui-schema'
import { type JimuMapView } from 'jimu-arcgis'
import { type IMThemeVariables, type ImmutableObject } from 'jimu-core'
import { type ToolConfig } from '../../config'

export interface JobParamsFromOtherWidgets {
  [parameterName: string]: GPFeatureRecordSetLayer
}

export interface ToolProps {
  locale: string
  theme: IMThemeVariables
  appContainer: HTMLElement
  jimuMapView: JimuMapView
  portal: __esri.Portal
  jobParams?: AnalysisToolData
  toolUiParameters?: AnalysisToolData
  toolInfo: ImmutableObject<ToolConfig>
  disableBack?: boolean
  hasAccess: boolean
  jobParamsFromOtherWidgets?: JobParamsFromOtherWidgets
  updateJobParamsFromOtherWidgets: (jobParams: JobParamsFromOtherWidgets) => void
  onBack: () => void
  signIn: (toolInfo: ImmutableObject<ToolConfig>) => Promise<void>
}
