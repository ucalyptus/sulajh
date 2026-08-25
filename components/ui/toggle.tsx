"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import * as stylex from "@stylexjs/stylex"
import { colors, spacing, radii } from "@/styles/tokens.stylex"

export const toggleStyles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    fontSize: "0.875rem",
    fontWeight: 500,
    outline: "none",
    borderWidth: 0,
    backgroundColor: "transparent",
    color: colors.foreground,
    cursor: "pointer",
    transitionProperty: "background-color, color",
    transitionDuration: "0.2s",
    boxSizing: "border-box",
  },
  default: {
    backgroundColor: "transparent",
  },
  outline: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.input,
    backgroundColor: "transparent",
  },
  sizeDefault: {
    height: "2.5rem",
    paddingLeft: spacing[3],
    paddingRight: spacing[3],
    minWidth: "2.5rem",
  },
  sm: {
    height: "2.25rem",
    paddingLeft: spacing[2.5],
    paddingRight: spacing[2.5],
    minWidth: "2.25rem",
  },
  lg: {
    height: "2.75rem",
    paddingLeft: spacing[5],
    paddingRight: spacing[5],
    minWidth: "2.75rem",
  },
})

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> {
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  style?: stylex.StyleXStyles
}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ style, variant = "default", size = "default", ...props }, ref) => {
  const variantStyle = toggleStyles[variant] || toggleStyles.default
  const sizeStyle = size === "default" ? toggleStyles.sizeDefault : toggleStyles[size] || toggleStyles.sizeDefault

  return (
    <TogglePrimitive.Root
      ref={ref}
      {...stylex.props(toggleStyles.base, variantStyle, sizeStyle, style)}
      {...props}
    />
  )
})

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle }
