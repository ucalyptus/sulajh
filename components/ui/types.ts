import type * as stylex from '@stylexjs/stylex'

/**
 * Replaces a component's native `style?: CSSProperties` with StyleX styles,
 * so prop interfaces can extend HTML/Radix attribute types without conflict.
 */
export type WithStyleX<T> = Omit<T, 'style'> & {
  style?: stylex.StyleXStyles
}
