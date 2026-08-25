"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import * as stylex from "@stylexjs/stylex"
import { colors, radii } from "@/styles/tokens.stylex"

export const switchStyles = stylex.create({
  root: {
    display: "inline-flex",
    height: "1.5rem",
    width: "2.75rem",
    shrink: 0,
    cursor: "pointer",
    alignItems: "center",
    borderRadius: radii.full,
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "transparent",
    transitionProperty: "background-color",
    transitionDuration: "0.2s",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: colors.input,
  },
  rootChecked: {
    backgroundColor: colors.primary,
  },
  thumb: {
    pointerEvents: "none",
    display: "block",
    height: "1.25rem",
    width: "1.25rem",
    borderRadius: radii.full,
    backgroundColor: colors.background,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    transitionProperty: "transform",
    transitionDuration: "0.2s",
    transform: "translateX(0)",
  },
  thumbChecked: {
    transform: "translateX(1.25rem)",
  },
})

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  style?: stylex.StyleXStyles
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ style, checked, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    checked={checked}
    {...stylex.props(
      switchStyles.root,
      checked && switchStyles.rootChecked,
      style
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      {...stylex.props(
        switchStyles.thumb,
        checked && switchStyles.thumbChecked
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
