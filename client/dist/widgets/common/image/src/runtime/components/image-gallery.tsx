import { React, type AttachmentInfo } from 'jimu-core'
import { Button, ImageWithParam, type ImageParam, type ImageWithParamProps } from 'jimu-ui'
import { LeftOutlined } from 'jimu-icons/outlined/directional/left'
import { RightOutlined } from 'jimu-icons/outlined/directional/right'

interface ImageGalleryProps extends ImageWithParamProps {
  sources: AttachmentInfo[]
  toolTipWithAttachmentName?: boolean
  altTextWithAttachmentName?: boolean
}

interface States {
  currentIndex: number
}

export class ImageGallery extends React.PureComponent<ImageGalleryProps, States> {
  constructor (props: ImageGalleryProps) {
    super(props)
    this.state = {
      currentIndex: 0
    }
  }

  componentDidUpdate (prevProps: ImageGalleryProps, prevState: States) {
    if (prevProps.sources !== this.props.sources) {
      this.setState({
        currentIndex: 0
      })
    }
  }

  backImg = (e) => {
    const preIndex = this.state.currentIndex > 0 ? this.state.currentIndex - 1 : this.props.sources.length - 1
    this.setState({
      currentIndex: preIndex
    })
    e?.preventDefault()
    e?.stopPropagation()
  }

  forwardImg = (e) => {
    const nextIndex = this.state.currentIndex < this.props.sources.length - 1 ? this.state.currentIndex + 1 : 0
    this.setState({
      currentIndex: nextIndex
    })
    e?.preventDefault()
    e?.stopPropagation()
  }

  render () {
    let tempImageParam = {} as any

    const toolTip = this.props.toolTipWithAttachmentName ? (this.props.sources && this.props.sources[this.state.currentIndex] && this.props.sources[this.state.currentIndex].name) : this.props.toolTip
    const altText = this.props.altTextWithAttachmentName ? (this.props.sources && this.props.sources[this.state.currentIndex] && this.props.sources[this.state.currentIndex].name) : this.props.altText
    if ((this.props.imageParam as any).set) {
      tempImageParam = (this.props.imageParam as any).set('url', (this.props.sources && this.props.sources[this.state.currentIndex] && this.props.sources[this.state.currentIndex].url))
    } else {
      tempImageParam.url = this.props.sources && this.props.sources[this.state.currentIndex] && this.props.sources[this.state.currentIndex].url
    }

    return (
      <div className='w-100 h-100'>
        {this.props.sources && this.props.sources.length > 1 && <div title={toolTip} className='slider-tool-container w-100 h-100' style={{ position: 'absolute', zIndex: 1 }}>
          <Button
            icon
            variant='text'
            className='image-gallery-button ml-2'
            style={{ top: '50%', transform: 'translateY(-50%)', position: 'absolute', left: 0 }}
            onClick={this.backImg}
          >
            <LeftOutlined size='s'/>
          </Button>
          <Button
            icon
            variant='text'
            className='image-gallery-button mr-2'
            style={{ top: '50%', transform: 'translateY(-50%)', position: 'absolute', right: 0 }}
            onClick={this.forwardImg}
          >
            <RightOutlined size='s'/>
          </Button>
        </div>}
        <div className='image-gallery-content w-100 h-100'>
          <ImageWithParam
            imageParam={tempImageParam as ImageParam}
            useFadein size={this.props.size}
            imageFillMode={this.props.imageFillMode}
            isAutoHeight={this.props.isAutoHeight}
            isAutoWidth={this.props.isAutoWidth}
            toolTip={toolTip} altText={altText}
          />
        </div>
      </div>
    )
  }
}
