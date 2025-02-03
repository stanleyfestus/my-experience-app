/** @jsx jsx */
import {
  React,
  jsx,
  css
} from 'jimu-core'
import { TextInput } from 'jimu-ui'

const styles = css`
  .label-text {
    padding: 3px 0;
    width: 110px;
  }
  .label-input {
    padding: 3px 0;
    width: 110px;
    .input-wrapper {
      height: 26px;
      border: 1px solid transparent;
      padding-left: 0;
      background-color: transparent;
      &:focus-within {
        padding-left: 6px;
        background-color: var(--ref-palette-neutral-1100);
      }
      input {
        height: 18px;
        line-height: 18px;
        font-size: 14px;
      }
    }
  }
`

interface BookmarkListTitleProps {
  bookmarkLabel: string
  onBookmarkNameChange: (inputValue: string) => void
  onBookmarkNameBlur: (value: string) => void
  onClickBookmarkName: () => void
}

export const BookmarkListTitle = (props: BookmarkListTitleProps) => {
  const { bookmarkLabel, onBookmarkNameChange, onBookmarkNameBlur, onClickBookmarkName } = props

  const [isEditingTitle, setIsEditingTitle] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>()

  React.useEffect(() => {
    if (isEditingTitle) {
      focusInput()
    }
  }, [isEditingTitle])

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }

  const stopPropagation = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
  }

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const titleInput = e.target as HTMLInputElement
      titleInput?.blur()
      setIsEditingTitle(false)
    }
  }

  const handleBlur = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setIsEditingTitle(false)
    onBookmarkNameBlur(evt.target.value)
  }

  const enableEditing = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditingTitle(true)
  }

  return (
    <div css={styles}>
    {!isEditingTitle && <div
      title={bookmarkLabel}
      className='label-text text-truncate'
      onDoubleClick={enableEditing}
      onClick={onClickBookmarkName}
      onKeyUp={evt => {
        if (evt.key === 'Tab') {
          setIsEditingTitle(true)
        }
      }}
      tabIndex={0}
      role='button'
      >
      {bookmarkLabel}
    </div>}
    {isEditingTitle && <TextInput
      className='label-input'
      title={bookmarkLabel}
      value={bookmarkLabel || ''}
      ref={inputRef}
      type='text'
      onChange={evt => { onBookmarkNameChange(evt.target.value) }}
      onBlur={evt => { handleBlur(evt) }}
      onClick={stopPropagation}
      onKeyDown={handleKeydown}
    />}
  </div>
  )
}
