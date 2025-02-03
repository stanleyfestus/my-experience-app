/** @jsx jsx */
import {
  React,
  type IMThemeVariables,
  type SerializedStyles,
  css,
  jsx,
  polished,
  esri,
  AppMode
} from 'jimu-core'
import { TextInput, Button, type InputProps, Popper } from 'jimu-ui'
import { type Suggestion } from '../../config'
import { CloseOutlined } from 'jimu-icons/outlined/editor/close'
import { SearchOutlined } from 'jimu-icons/outlined/editor/search'
import { ArrowLeftOutlined } from 'jimu-icons/outlined/directional/arrow-left'
const Sanitizer = esri.Sanitizer
const sanitizer = new Sanitizer()

interface Props {
  theme: IMThemeVariables
  placeholder?: string
  searchText?: string
  onSearchTextChange?: (searchText: string) => void
  formatMessage?: (id: string) => string
  onSubmit?: (searchText: string, isEnter: boolean) => void
  showClear?: boolean
  hideSearchIcon?: boolean
  inputRef?: (ref: HTMLInputElement) => void
  searchSuggestion: Suggestion[]
  suggestionWidth: number
  showLoading: boolean
  isShowBackButton?: boolean
  appMode: AppMode
  toggleSearchBoxVisible?: (isVisible: boolean) => void
}

interface Stats {
  searchText: string
  isShowSuggestion: boolean
}

export default class SearchBox extends React.PureComponent<
Props & InputProps,
Stats
> {
  reference: HTMLDivElement
  suggestionRequestTimeout: any
  containerRef: HTMLDivElement
  searchInputRef: HTMLElement
  focusTimeout: any
  constructor (props) {
    super(props)
    this.state = {
      searchText: props.searchText || '',
      isShowSuggestion: false
    }
  }

  componentDidUpdate (preProps) {
    if (
      this.props.searchText !== preProps.searchText &&
      this.props.searchText !== this.state.searchText
    ) {
      const { searchText } = this.props
      this.setState({
        searchText: searchText
      })
    }
    if (this.props?.appMode === AppMode.Design && this.state.isShowSuggestion) {
      this.setState({
        isShowSuggestion: false,
        searchText: ''
      })
    }
  }

  handleChange = searchText => {
    this.setState(
      {
        searchText: searchText,
        isShowSuggestion: searchText?.length > 2
      },
      () => {
        const { onSearchTextChange } = this.props
        if (onSearchTextChange) {
          onSearchTextChange(searchText)
        }
      }
    )
  }

  handleSubmit = (value, isEnter = false) => {
    const { onSubmit } = this.props
    if (onSubmit) {
      onSubmit(value, isEnter)
    }
  }

  onKeyUp = evt => {
    if (!evt || !evt.target) return
    const { isShowSuggestion } = this.state
    if (evt.key === 'Enter') {
      this.setState({
        isShowSuggestion: false
      })
      this.handleSubmit(evt.target.value, true)
    }
    if (isShowSuggestion) {
      const items = this.getMenuItems() || []
      const itemLength = items?.length - 1
      if (evt.key === 'ArrowUp') {
        setTimeout(() => {
          items[itemLength]?.focus()
        })
      } else if (evt.key === 'ArrowDown') {
        setTimeout(() => {
          this.containerRef?.focus()
          items[0]?.focus()
        })
      }
    }
  }

  onSuggestionConfirm = suggestion => {
    this.setState(
      {
        searchText: suggestion,
        isShowSuggestion: false
      },
      () => {
        this.handleSubmit(suggestion)
        this.props?.toggleSearchBoxVisible(true)
      }
    )
  }

  handleClear = evt => {
    this.setState({
      searchText: ''
    })
    evt.stopPropagation()
  }

  getStyle = (): SerializedStyles => {
    const { theme } = this.props

    return css`
      position: relative;
      .search-input {
        margin-bottom: -1px;
        padding-left: 3px;
        border: 0;
        // border-bottom-width: 1px;
        // border-bottom-style: solid;
        // border-color: ${theme.sys.color.primary.main};
        background: transparent;
        height: ${polished.rem(26)};
        min-width: 0;
        .input-wrapper {
          background: transparent;
          border: none;
          padding: 0;
          height: 100%;
        }
      }
      .search-input:focus {
        background: transparent;
      }
      .search-loading-con {
        @keyframes loading {
          0% {transform: rotate(0deg); };
          100% {transform: rotate(360deg)};
        }
        width: ${polished.rem(13)};
        height: ${polished.rem(13)};
        min-width: ${polished.rem(13)};
        border: 2px solid ${theme?.sys.color?.secondary?.light};
        border-radius: 50%;
        border-top: 2px solid ${theme?.sys.color?.primary?.main};
        box-sizing: border-box;
        animation:loading 2s infinite linear;
        margin-right: ${polished.rem(4)};
      }
      .clear-search, .search-back {
        cursor: pointer;
        padding: ${polished.rem(6)};
        background: none;
        border: none;
        color: ${theme?.ref.palette?.neutral?.[1100]}
      }
      .search-back {
        margin-left: ${polished.rem(-6)};
      }
      .clear-search:hover {
        background: none;
      }
    `
  }

  getSuggestionListStyle = (): SerializedStyles => {
    const { suggestionWidth } = this.props
    return css`
      & {
        max-height: ${polished.rem(300)};
        min-width: ${polished.rem(suggestionWidth)};
        overflow: auto;
      }
      button {
        display: block;
        width: 100%;
        text-align: left;
        border: none;
        border-radius: 0;
      }
      .suggestion-item:focus {
        background: var(--sys-color-primary-main);
        color: var(--ref-palette-white);
      }
      button:hover {
        border: none;
      }
    `
  }

  clearSearchText = () => {
    const { searchText } = this.state
    if (searchText) {
      this.handleChange('')
      this.setState({
        isShowSuggestion: false
      })
    }
  }

  getMenuItems = () => {
    return this.containerRef ? Array.prototype.slice.call(this.containerRef.querySelectorAll('[role="button"]')).filter(item => !item.disabled) : []
  }

  getTextInputSuffixElement = () => {
    const { theme, showLoading, formatMessage } = this.props
    const { searchText } = this.state
    return (
      <div className='d-flex align-items-center'>
        {showLoading && <div className='search-loading-con' />}
        {searchText && (
          <Button
            className='clear-search'
            icon
            size='sm'
            onClick={this.clearSearchText}
            title={formatMessage('clearSearch')}
          >
            <CloseOutlined size={14} color={theme.ref.palette.neutral[1100]}/>
          </Button>
        )}
      </div>
    )
  }

  getTextInputPrefixElement = () => {
    const { theme, formatMessage } = this.props
    return (
      <Button
        type='tertiary'
        icon
        size='sm'
        title={formatMessage('SearchLabel')}
        onClick={evt => { this.handleSubmit(this.state.searchText) }}
      >
        <SearchOutlined size={16} color={theme.ref.palette.neutral[700]}/>
      </Button>
    )
  }

  handlePopperKeyDown = (e) => {
    const { isShowSuggestion } = this.state
    if (!isShowSuggestion) {
      return
    }
    const isTargetMenuItem = e.target.getAttribute('role') === 'button'
    if (!['Tab', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      return
    }

    if (((e.which >= 48) && (e.which <= 90)) || e.key === 'Tab') {
      e.preventDefault()
    }

    if (isShowSuggestion && isTargetMenuItem) {
      if (e.key === 'Escape') {
        this.handleEscEvent(e)
      } else if (
        ['ArrowUp', 'ArrowDown'].includes(e.key) || (['n', 'p'].includes(e.key) && e.ctrlKey)
      ) {
        const $menuitems = this.getMenuItems()
        let index = $menuitems.indexOf(e.target)
        let isArrowUp = false
        if (e.key === 'ArrowUp' || (e.key === 'p' && e.ctrlKey)) {
          index = index !== 0 ? index - 1 : $menuitems.length - 1
          isArrowUp = true
        } else if (e.key === 'ArrowDown' || (e.key === 'n' && e.ctrlKey)) {
          isArrowUp = false
          index = index === $menuitems.length - 1 ? 0 : index + 1
        }

        const isArrowUpToInput = (index === 0 && !isArrowUp)
        const isArrowDownToInput = (index === $menuitems.length - 1 && isArrowUp)
        clearTimeout(this.focusTimeout)
        if (isArrowUpToInput || isArrowDownToInput) {
          this.focusTimeout = setTimeout(() => {
            this.searchInputRef?.focus()
          })
        } else {
          this.focusTimeout = setTimeout(() => {
            this.containerRef?.focus()
            $menuitems[index].focus()
          })
        }
      } else if (e.key === 'End') {
        const $menuitems = this.getMenuItems()
        $menuitems[$menuitems.length - 1].focus()
      } else if (e.key === 'Home') {
        const $menuitems = this.getMenuItems()
        $menuitems[0].focus()
      } else if ((e.which >= 48) && (e.which <= 90)) {
        const $menuitems = this.getMenuItems()
        const charPressed = String.fromCharCode(e.which).toLowerCase()
        for (let i = 0; i < $menuitems.length; i += 1) {
          const firstLetter = $menuitems[i].textContent && $menuitems[i].textContent[0].toLowerCase()
          if (firstLetter === charPressed) {
            $menuitems[i].focus()
            break
          }
        }
      }
    }
  }

  handleEscEvent = (e) => {
    const { isShowSuggestion } = this.state
    e.preventDefault()
    this.setState({ isShowSuggestion: !isShowSuggestion })
    this.searchInputRef?.focus()
  }

  setInputRef = (ref) => {
    const { inputRef } = this.props
    this.searchInputRef = ref
    inputRef && inputRef(ref)
  }

  render () {
    const {
      placeholder,
      className,
      showClear,
      hideSearchIcon,
      onFocus,
      onBlur,
      theme,
      searchSuggestion,
      formatMessage,
      isShowBackButton
    } = this.props
    const { searchText, isShowSuggestion } = this.state

    return (
      <div ref={ref => { this.reference = ref }}>
        <div
          css={this.getStyle()}
          className={`d-flex align-items-center ${className}`}
        >
          {isShowBackButton && (
            <Button
              className='search-back'
              icon
              size='sm'
              onClick={evt => {
                this.props?.toggleSearchBoxVisible(false)
              }}
              title={formatMessage('topToolBack')}
            >
              <ArrowLeftOutlined size={20} color={theme.ref.palette.neutral[1100]}/>
            </Button>
          )}
          <TextInput
            className='search-input flex-grow-1'
            ref={ref => { this.setInputRef(ref) }}
            placeholder={placeholder}
            onChange={e => { this.handleChange(e.target.value) }}
            onBlur={onBlur}
            onFocus={onFocus}
            title={searchText || placeholder}
            value={searchText || ''}
            onKeyDown={e => { this.onKeyUp(e) }}
            prefix={(!hideSearchIcon && !isShowBackButton) && this.getTextInputPrefixElement()}
            suffix={this.getTextInputSuffixElement()}
          />
          {showClear && (
            <Button id='test-focus' icon size='sm' onClick={this.handleSubmit}>
              <CloseOutlined size={12} color={theme.ref.palette.neutral[1100]}/>
            </Button>
          )}
        </div>
        <div>
          <Popper
            css={this.getSuggestionListStyle()}
            placement='bottom-start'
            reference={this.reference}
            offset={[0, 8]}
            open={isShowSuggestion}
            autoFocus={false}
            toggle={e => {
              this.setState({ isShowSuggestion: !isShowSuggestion })
            }}
          >
            <div ref={ref => { this.containerRef = ref }} onKeyDown={this.handlePopperKeyDown}>
              {searchSuggestion.map((suggestion, index) => {
                const suggestionHtml = sanitizer.sanitize(
                  suggestion.suggestionHtml
                )
                return (
                  <Button
                    key={index}
                    type='secondary'
                    size='sm'
                    role='button'
                    title={suggestion?.suggestion}
                    className='suggestion-item'
                    onClick={() => {
                      this.onSuggestionConfirm(suggestion.suggestion)
                    }}
                  >
                    <div className='w-100' dangerouslySetInnerHTML={{ __html: suggestionHtml }}></div>
                  </Button>
                )
              })}
            </div>
          </Popper>
        </div>
      </div>
    )
  }
}
