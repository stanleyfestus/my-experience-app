/** @jsx jsx */
import {
  React,
  type IMIconResult,
  jsx,
  type ThemePaper,
  ReactRedux,
  type IMState,
  hooks,
  type ImmutableObject
} from 'jimu-core'
import {
  Button,
  Icon,
  Drawer,
  type NavigationProps,
  Navigation,
  PanelHeader,
  type AnchorDirection,
  type NavigationVariant
} from 'jimu-ui'
import { useDrawerAdvanceStyle, useNavAdvanceStyle, useNavigationStyleForDrawerMenu } from './utils'
import defaultMessage from './translations/default'

export type DrawerMenuProps = NavigationProps & {
  icon?: IMIconResult
  anchor: AnchorDirection
  advanced?: boolean
  variant?: ImmutableObject<NavigationVariant>
  paper?: ThemePaper
}

export const DrawerMenu = (props: DrawerMenuProps) => {
  const [open, setOpen] = React.useState(false)
  const {
    icon,
    anchor,
    advanced,
    type,
    variant,
    paper,
    vertical,
    ...others
  } = props

  const toggle = () => { setOpen(open => !open) }
  const drawerStyle = useDrawerAdvanceStyle(advanced, variant, paper)
  const navStyle = useNavAdvanceStyle(advanced, type, variant, true)
  const isInSmallDevice = hooks.useCheckSmallBrowserSizeMode()
  const navigationStyle = useNavigationStyleForDrawerMenu(isInSmallDevice)
  const currentPageId = ReactRedux.useSelector(
    (state: IMState) => state.appRuntimeInfo.currentPageId
  )
  React.useEffect(() => {
    setOpen(false)
  }, [currentPageId])

  const translate = hooks.useTranslation(defaultMessage)

  return (
    <React.Fragment>
      <div className='button-container w-100 h-100 d-flex align-items-center justify-content-center'>
        <Button className='jimu-outline-inside' icon type='tertiary' onClick={toggle} aria-label={translate('_widgetLabel')} aria-haspopup="menu">
          <Icon
            className='caret-icon'
            icon={icon?.svg}
            color={icon?.properties?.color}
            size={icon?.properties?.size}
          />
        </Button>
      </div>
      <Drawer
        anchor={anchor}
        open={open}
        toggle={toggle}
        autoFlip={false}
        css={drawerStyle}
        aria-label={translate('_widgetLabel')}
      >
        <PanelHeader className='header' title='' onClose={toggle} />
        <Navigation
          role="menu"
          className={isInSmallDevice ? 'w-100' : 'menu-navigation'}
          vertical={vertical}
          css={[navigationStyle, navStyle]}
          type={type}
          showTitle={true}
          isUseNativeTitle={true}
          right={true}
          {...others}
        />
      </Drawer>
    </React.Fragment>
  )
}
