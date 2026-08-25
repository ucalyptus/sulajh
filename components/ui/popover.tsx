"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import * as stylex from "@stylexjs/stylex"
import { colors, spacing, radii } from "@/styles/tokens.stylex"

export const popoverStyles = stylex.create({
  content: {
    zIndex: 50,
    width: "18rem",
    borderRadius: radii.md,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: colors.popover,
    padding: spacing[4],
    color: colors.popoverForeground,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    outline: "none",
    boxSizing: "border-box",
  },
})

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  style?: stylex.StyleXStyles
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ style, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      {...stylex.props(popoverStyles.content, style)}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
