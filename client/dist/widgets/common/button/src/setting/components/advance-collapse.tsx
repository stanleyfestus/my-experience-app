import { React } from 'jimu-core'
import { Collapse, Switch, Label } from 'jimu-ui'

interface Props {
  title: string
  isOpen: boolean
  toggle: () => void
  children?: React.ReactNode
}
export default class AdvanceCollapse extends React.PureComponent<Props> {
  render () {
    return (
      <div className='w-100'>
        <div onClick={this.props.toggle} className='d-flex justify-content-between mb-2'>
          <div><Label for='open-collapse' className='collapse-label title3 hint-default'>{this.props.title}</Label></div>
          <div><Switch id='open-collapse' name='open-collapse' onChange={this.props.toggle} checked={this.props.isOpen} /></div>
        </div>
        <Collapse isOpen={this.props.isOpen}>
          {
            this.props.isOpen && this.props.children
          }
        </Collapse>
      </div>
    )
  }
}
