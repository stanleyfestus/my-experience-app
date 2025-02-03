import { React, utils, i18n, getAppStore, appActions, ReactRedux, type WidgetJson, type IMState, LayoutItemType } from 'jimu-core'
import { GuideComponent, type Steps, EVENTS, type GuideProps } from 'jimu-ui/basic/guide'
import defaultMessages from '../runtime/translations/default'
import { defaultMessages as jimuUIDefaultMessages } from 'jimu-ui'
const { useState, useEffect, useMemo, useRef } = React
const MESSAGES = Object.assign(
  {},
  defaultMessages,
  jimuUIDefaultMessages
)

const _WidgetGuide = (props: GuideProps & StateToProps) => {
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(props.stepIndex ?? 0)
  const listWidgetIdRef = useRef(null)
  const stepsJson = useMemo(() => {
    const stepsSrc = require('./steps.json')
    if (listWidgetIdRef.current === null) {
      if (props.widgetJson?.id) {
        const selector = `[data-widgetid="${props.widgetJson?.id}"]`
        if (stepsSrc.steps[7].target.indexOf(selector) === -1) {
          stepsSrc.steps[7].target = `${selector} ${stepsSrc.steps[7].target}`
        }
        if (stepsSrc.steps[9].target.indexOf(selector) === -1) {
          stepsSrc.steps[9].target = `${selector} ${stepsSrc.steps[9].target}`
        }
        listWidgetIdRef.current = props.widgetJson?.id
      }
    }

    return utils.replaceI18nPlaceholdersInObject(stepsSrc, i18n.getIntl(props.widgetJson?.id), MESSAGES)
  }, [props.widgetJson])

  const onStepClick = (e, step, index) => {
    if (index === 1) { // template step
      if (e?.target.classList.contains('btn-primary')) {
        setStepIndex(index + 1)
      }
    } else { // other steps
      setStepIndex(index + 1)
    }
  }

  const onStepChange = (data) => {
    const { nextIndex, step, event } = data
    if (nextIndex === 1) {
      getAppStore().dispatch(
        appActions.widgetStatePropChange('right-sidebar', 'collapse', true)
      )
    } else if ([5, 6, 7].includes(nextIndex) && event === EVENTS.STEP_BEFORE) {
      const settingContainerElm = document.querySelector('.jimu-widget-list-setting')
      const targetElm = document.querySelector(step?.target)
      if (settingContainerElm && targetElm) {
        const scrollTop = targetElm.getBoundingClientRect().top - settingContainerElm.getBoundingClientRect().top
        settingContainerElm?.scrollTo({ top: scrollTop > 0 ? scrollTop : 0 })
      }
    }
    props?.onStepChange(data)
  }

  useEffect(() => {
    setRun(props.run)
  }, [props.run])

  useEffect(() => {
    setStepIndex(props.stepIndex)
  }, [props.stepIndex])
  return (
    <GuideComponent
      {...props}
      run={run}
      stepIndex={stepIndex}
      steps={stepsJson.steps as Steps}
      onStepChange={onStepChange}
      onActionTriggered={onStepClick}
    />
  )
}
interface StateToProps {
  widgetJson: WidgetJson
}
const mapStateToProps = (appState: IMState): StateToProps => {
  const appConfig = appState.appStateInBuilder?.appConfig
  const layoutSelection = appState.appStateInBuilder?.appRuntimeInfo.selection
  let widget
  if (layoutSelection) {
    const { layoutId, layoutItemId } = layoutSelection
    const layoutItem = appConfig.layouts?.[layoutId]?.content?.[layoutItemId]

    if (layoutItem) {
      if (layoutItem.type === LayoutItemType.Widget) {
        if (layoutItem.widgetId) {
          widget = appConfig.widgets[layoutItem.widgetId]
        }
      }
    }
  }
  return {
    widgetJson: widget
  }
}
export default ReactRedux.connect<StateToProps, unknown, GuideProps>(mapStateToProps)(_WidgetGuide)
