/** @jsx jsx */
import { React, jsx, css, classNames, polished } from 'jimu-core'
import { ThemeSwitchComponent, useTheme, useTheme2, useUseTheme2 } from 'jimu-theme'

interface NavQuickStyleItemProps {
  title?: string
  children: any
  selected?: boolean
  onClick?: (evt?: React.MouseEvent<HTMLDivElement>) => void
}

const useStyle = () => {
  const theme = useTheme()
  const theme2 = useTheme2()
  const isUseTheme2 = useUseTheme2()
  const appTheme = window.jimuConfig.isBuilder !== isUseTheme2 ? theme2 : theme
  const builderTheme = window.jimuConfig.isBuilder !== isUseTheme2 ? theme : theme2
  const primary600 = builderTheme.sys.color.primary.light
  const light200 = appTheme?.ref.palette.neutral[300]

  return React.useMemo(() => {
    return css`
      width: 100%;
      height:  ${polished.rem(50)};
      padding: ${polished.rem(8)}  ${polished.rem(12)};
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${light200};
      position: relative;
      &.selected {
        outline: 3px solid ${primary600};
      }
      >.overlay {
        z-index: 1;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
  `
  }, [primary600, light200])
}

export const NavQuickStyleItem = (props: NavQuickStyleItemProps) => {
  const { title, children, selected, onClick } = props
  const style = useStyle()

  return (
    <div
      css={style}
      title={title}
      className={classNames('quick-style-item', { selected })}
      onClick={onClick}
    >
      <div className='overlay' />
      <ThemeSwitchComponent useTheme2={window.jimuConfig.isBuilder}>{children}</ThemeSwitchComponent>
    </div>
  )
}
