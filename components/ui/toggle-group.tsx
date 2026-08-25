"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import * as stylex from "@stylexjs/stylex"
import { spacing } from "@/styles/tokens.stylex"
import { toggleStyles } from "@/components/ui/toggle"

export const toggleGroupStyles = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[1],
  },
})

interface ToggleGroupContextValue {
  size?: "default" | "sm" | "lg"
  variant?: "default" | "outline"
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  size: "default",
  variant: "default",
})

export interface ToggleGroupProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
    ToggleGroupContextValue {
  style?: stylex.StyleXStyles
}

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ style, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    {...stylex.props(toggleGroupStyles.root, style)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

export interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    ToggleGroupContextValue {
  style?: stylex.StyleXStyles
}

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ style, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)
  const activeVariant = context.variant || variant || "default"
  const activeSize = context.size || size || "default"

  const variantStyle = toggleStyles[activeVariant] || toggleStyles.default
  const sizeStyle = activeSize === "default" ? toggleStyles.sizeDefault : toggleStyles[activeSize] || toggleStyles.sizeDefault

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      {...stylex.props(toggleStyles.base, variantStyle, sizeStyle, style)}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
