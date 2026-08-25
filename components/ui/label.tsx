"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import * as stylex from "@stylexjs/stylex"
import { colors } from "@/styles/tokens.stylex"

export const labelStyles = stylex.create({
  label: {
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1,
    color: colors.foreground,
    cursor: "default",
    userSelect: "none",
  },
})

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  style?: stylex.StyleXStyles
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ style, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    {...stylex.props(labelStyles.label, style)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
