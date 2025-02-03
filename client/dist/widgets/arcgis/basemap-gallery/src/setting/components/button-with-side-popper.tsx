import { React } from 'jimu-core'
import { Button, type ButtonProps } from 'jimu-ui'
import { SidePopper } from 'jimu-ui/advanced/setting-components'

interface Props {
  buttonText: string
  buttonProps?: ButtonProps
  sidePopperTitle: string
  children: React.ReactNode
}

const ButtonWithSidePopper = (props: Props) => {
  const { buttonText, buttonProps = {}, sidePopperTitle, children } = props
  const importButtonRef = React.useRef<HTMLButtonElement>()

  const [isOpen, setIsOpen] = React.useState(false)
  const openSidePopper = () => {
    if (!isOpen) {
      setIsOpen(true)
    }
  }
  const closeSidePopper = () => {
    if (isOpen) {
      setIsOpen(false)
    }
  }

  return <React.Fragment>
    <Button
      type="primary"
      ref={importButtonRef}
      onClick={openSidePopper}
      {...buttonProps}
    >
      {buttonText}
    </Button>

    <SidePopper
      position='right' title={sidePopperTitle} aria-label={sidePopperTitle}
      isOpen={isOpen} toggle={closeSidePopper} trigger={importButtonRef.current}
    >
      {children}
    </SidePopper>
  </React.Fragment>
}

export default ButtonWithSidePopper
