/** @jsx jsx */
import { css, jsx, React, type IntlShape, type IMThemeVariables } from 'jimu-core'
import { Progress, defaultMessages } from 'jimu-ui'

interface Props {
  progress: number
  intl: IntlShape
  theme: IMThemeVariables
  onClick: () => void
}

export default class SelectProgress extends React.PureComponent<Props> {
  constructor (props: Props) {
    super(props)
    this.state = {}
  }

  getStyle () {
    const progressColor = this.props.theme.sys.color.mode === 'dark' ? 'black' : 'white'

    return css`
      position: relative;

      .select-circle-progress {
        position: absolute;
        left: 6px;
        top: 6px;

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
        width: 6px;
        height: 6px;
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
  }

  render () {
    const progress = this.props.progress * 100
    const progressInt = parseFloat(progress.toFixed(2))
    const defaultStr = defaultMessages.selectingFeaturesTip
    const title = this.props.intl?.formatMessage({ id: 'selectingFeaturesTip', defaultMessage: defaultStr }) || defaultStr

    return (
      <button css={this.getStyle()}
        onClick={this.props.onClick}
        className='esri-widget--button  border-0 select-tool-btn d-flex align-items-center justify-content-center active select-progress'
      >
        <Progress className='select-circle-progress' color={this.props.theme.ref.palette.neutral[200]} type='circular' value={progressInt} circleSize={20} />
        <div className='progress-stop'></div>
        <div className='progress-mask' title={title}></div>
      </button>
    )
  }
}
