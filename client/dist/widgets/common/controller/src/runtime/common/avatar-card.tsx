/** @jsx jsx */
import { React, css, jsx, type IconResult, classNames, polished } from 'jimu-core'
import { Button, Icon, Tooltip } from 'jimu-ui'
import { WIDGET_ITEM_SIZES } from '../../common/consts'
import { type AvatarCardConfig, type IMControllerButtonStylesByState, type IMAvatarProps, type AvatarProps } from '../../config'

export const LABEL_HEIGHT = 21

export const getItemLength = (buttonSize: AvatarProps['size'], showLabel: boolean, shape: AvatarProps['shape']) => {
  let size = WIDGET_ITEM_SIZES[buttonSize]
  if (showLabel) {
    size = size + LABEL_HEIGHT
  }

  const padding = calcPadding(buttonSize, shape)
  size = size + padding * 2
  return size
}

const calcPadding = (buttonSize: AvatarProps['size'], shape: AvatarProps['shape']): number => {
  const circle = shape === 'circle'
  if (!circle) return 6
  if (buttonSize === 'sm') return 4
  if (buttonSize === 'default') return 2
  if (buttonSize === 'lg') return 0
}

export interface AvatarCardProps extends Omit<AvatarCardConfig, 'avatar' | 'variant'> {
  icon?: IconResult | string
  autoFlip?: boolean
  label?: string
  avatar: IMAvatarProps
  variant?: IMControllerButtonStylesByState
  active?: boolean
  disabled?: boolean
  editDraggable?: boolean
  widgetid?: string
  onClick?: (evt: React.MouseEvent<HTMLButtonElement>) => void
  marker?: string
  onMarkerClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}

const useStyle = (size: AvatarProps['size'], showLabel: boolean, showIndicator: boolean, shape: AvatarProps['shape'], labelGrowth: number) => {
  return React.useMemo(() => {
    const length = getItemLength(size, showLabel, shape)
    const width = length + labelGrowth
    const padding = calcPadding(size, shape)
    return css`
      display: flex;
      align-items:center;
      flex-direction: column;
      justify-content: ${showLabel ? 'space-around' : 'center'};
      width: ${polished.rem(width)} !important;
      height: ${polished.rem(length)};
      .tool-drag-handler {
        cursor: auto;
      }
      .avatar {
        padding: ${padding}px;
        position: relative;
        text-align: center;
        &:hover .marker {
          visibility: visible;
        }
        .avatar-button.disabled {
          color: var(--sys-color-action-disabled-text);
          background-color: var(--sys-color-action-disabled);
          border: 1px solid var(--sys-color-divider-secondary);
        }
        .marker {
          position: absolute;
          right: 0;
          top: 0;
          padding: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          .icon-btn-sizer {
            min-width: .625rem;
            min-height: .625rem;
          }
          visibility: hidden;
        }
      }
      ${showIndicator
      ? `.avatar.active {
        .avatar-button, .marker {
          transform: translateY(-7px);
        }
        ::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          border: 1px solid var(--ref-palette-white);
          border-radius: 3px;
          width: 6px;
          height: 3px;
          background-color: var(--sys-color-primary-main);
          box-sizing: content-box;
        }
      }`
      : ''}
      .avatar-label {
        text-align: center;
        width: 100%;
        min-height: ${polished.rem(21)};
        cursor: default;
      }
    `
  }, [size, showLabel, shape, labelGrowth, showIndicator])
}

const borderRadiuses = { none: '0', sm: '0', default: 'var(--sys-shape-1)', lg: 'var(--sys-shape-2)' }

export const AvatarCard = React.forwardRef((props: AvatarCardProps, ref: React.RefObject<HTMLButtonElement>) => {
  const {
    label,
    className,
    showLabel,
    showIndicator = true,
    showTooltip = true,
    labelGrowth = 0,
    icon,
    marker,
    onClick,
    onMarkerClick,
    avatar,
    autoFlip,
    active,
    editDraggable,
    disabled,
    widgetid
  } = props

  const type = avatar.type || 'primary'
  const size = avatar.size || 'default'
  const shape = avatar.shape || 'circle'
  const cssStyle = useStyle(size, showLabel, showIndicator, shape, labelGrowth)
  const buttonBorderRadius = borderRadiuses[size]

  const avatarButton = <Button
    data-widgetid={widgetid}
    aria-label={label}
    aria-expanded={active}
    aria-haspopup='dialog'
    icon
    active={active}
    className={classNames('avatar-button', { disabled })}
    ref={ref}
    type={type}
    size={size}
    style={{ borderRadius: shape === 'circle' ? '50%' : buttonBorderRadius }}
    onClick={onClick}
  >
    <Icon
      color={typeof icon !== 'string' && icon.properties?.color}
      icon={typeof icon !== 'string' ? icon.svg : icon} autoFlip={autoFlip}
    />
  </Button>

  return (
    <div
      data-widgetid={widgetid}
      className={classNames('avatar-card', { active }, className)}
      css={cssStyle}
    >
      <div
        className={classNames({ 'no-drag-action': !editDraggable, active }, 'avatar tool-drag-handler')}
      >
        {showTooltip ? <Tooltip title={label} style={{ pointerEvents: 'none' }}>{avatarButton}</Tooltip> : avatarButton}
        {
          marker && <Button className="marker" size="sm" icon onClick={onMarkerClick}>
            <Icon size={8} icon={marker} />
          </Button>
        }
      </div>
      {
        showLabel &&
        <div className={classNames('avatar-label text-truncate', { active })}>{label}</div>
      }
    </div>
  )
})
