import { type ImmutableObject, type Expression, Immutable } from 'jimu-core'

interface Style {
  wrap?: boolean
  color?: string
}

export interface Config {
  /**
   * Note: The placeholder must be a nested structure of tags with the text inside:
   *   Correct: <p><strong>foo</strong></p>
   *   Wrong:   <p>foo<strong>bar</strong></p>
   */
  placeholder?: string
  text: string
  style?: Style
  tooltip?: Expression
}

export type IMConfig = ImmutableObject<Config>

export interface WidgetState {
  showExpression?: boolean
  isInlineEditing?: boolean
}

export type IMWidgetState = ImmutableObject<WidgetState>

export const DefaultConfig: IMConfig = Immutable({
  text: '<p></p>',
  placeholder: 'Double click to edit text',
  style: {
    wrap: true
  }
})
