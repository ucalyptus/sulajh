"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import * as stylex from "@stylexjs/stylex"
import { colors, spacing, radii } from "@/styles/tokens.stylex"

export const selectStyles = stylex.create({
  trigger: {
    display: "flex",
    height: "2.5rem",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radii.md,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.input,
    backgroundColor: colors.background,
    paddingLeft: spacing[3],
    paddingRight: spacing[3],
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    fontSize: "0.875rem",
    color: colors.foreground,
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
    ":focus": {
      borderColor: colors.ring,
      boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.2)",
    },
    ":disabled": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
  },
  triggerIcon: {
    height: "1rem",
    width: "1rem",
    opacity: 0.5,
  },
  scrollButton: {
    display: "flex",
    cursor: "default",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing[1],
    paddingBottom: spacing[1],
  },
  content: {
    position: "relative",
    zIndex: 50,
    maxHeight: "24rem",
    minWidth: "8rem",
    overflow: "hidden",
    borderRadius: radii.md,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  viewport: {
    padding: spacing[1],
  },
  label: {
    paddingTop: spacing[1.5],
    paddingBottom: spacing[1.5],
    paddingLeft: spacing[8],
    paddingRight: spacing[2],
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  item: {
    position: "relative",
    display: "flex",
    width: "100%",
    cursor: "default",
    userSelect: "none",
    alignItems: "center",
    borderRadius: radii.sm,
    paddingTop: spacing[1.5],
    paddingBottom: spacing[1.5],
    paddingLeft: spacing[8],
    paddingRight: spacing[2],
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box",
    ":hover": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ":focus": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  itemIndicator: {
    position: "absolute",
    left: spacing[2],
    display: "flex",
    height: "0.875rem",
    width: "0.875rem",
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    marginTop: spacing[1],
    marginBottom: spacing[1],
    marginLeft: "-0.25rem",
    marginRight: "-0.25rem",
    height: "1px",
    backgroundColor: colors.muted,
  },
})

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

interface SelectComponentProps {
  style?: stylex.StyleXStyles
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>, 'style'> & SelectComponentProps
>(({ style, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    {...stylex.props(selectStyles.trigger, style)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown {...stylex.props(selectStyles.triggerIcon)} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>, 'style'> & SelectComponentProps
>(({ style, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    {...stylex.props(selectStyles.scrollButton, style)}
    {...props}
  >
    <ChevronUp style={{ width: 16, height: 16 }} />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>, 'style'> & SelectComponentProps
>(({ style, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    {...stylex.props(selectStyles.scrollButton, style)}
    {...props}
  >
    <ChevronDown style={{ width: 16, height: 16 }} />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>, 'style'> & SelectComponentProps
>(({ style, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      {...stylex.props(selectStyles.content, style)}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport {...stylex.props(selectStyles.viewport)}>
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>, 'style'> & SelectComponentProps
>(({ style, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    {...stylex.props(selectStyles.label, style)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>, 'style'> & SelectComponentProps
>(({ style, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    {...stylex.props(selectStyles.item, style)}
    {...props}
  >
    <span {...stylex.props(selectStyles.itemIndicator)}>
      <SelectPrimitive.ItemIndicator>
        <Check style={{ width: 16, height: 16 }} />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>, 'style'> & SelectComponentProps
>(({ style, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    {...stylex.props(selectStyles.separator, style)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
