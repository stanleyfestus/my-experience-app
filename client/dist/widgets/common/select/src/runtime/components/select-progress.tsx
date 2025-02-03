/** @jsx jsx */
import { React, css, jsx, hooks } from 'jimu-core'
import { Progress, defaultMessages as jimuUIMessages } from 'jimu-ui'
import defaultMessages from '../translations/default'
import { useTheme } from 'jimu-theme'

interface Props {
  // progress is in range of [0, 1]
  progress: number
  onClick: () => void
}

export default function SelectProgress (props: Props) {
  const progressColor = 'black'
  const theme = useTheme()

  const style = React.useMemo(() => {
    return css`
      display: inline-block;
      position: relative;
      width: 20px;
      height: 20px;
      background: transparent;

      .select-circle-progress {
        position: absolute;
        left: 0;
        top: 0;

        .progress-circle-bg {
          stroke: ${progressColor};
          opacity: 0.3;
        }

        .progress-circle-progress {
          stroke: ${progressColor};
          transition: none !important;
        }
      }

      .progress-stop {
        position: absolute;
        width: 6px;
        height: 6px;
        left: 7px;
        top: 7px;
        background: ${progressColor};
      }

      .progress-mask {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: transparent;
      }
    `
  }, [progressColor])

  const translate = hooks.useTranslation(jimuUIMessages, defaultMessages)

  const progress = props.progress * 100
  const progressInt = parseFloat(progress.toFixed(2))
  const title = translate('selectingFeaturesTip')

  return (
    <div
      css={style}
      onClick={props.onClick}
      className='select-progress'
      title={title}
    >
      <Progress
        className='select-circle-progress'
        color={theme.ref.palette.neutral[200]}
        type='circular'
        value={progressInt}
        circleSize={20}
      />
      <div className='progress-stop' />
      <div className='progress-mask' />
    </div>
  )
}
