"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import * as stylex from "@stylexjs/stylex"
import { colors, spacing, radii } from "@/styles/tokens.stylex"

export const tabsStyles = stylex.create({
  list: {
    display: "inline-flex",
    height: "2.5rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    padding: spacing[1],
    color: colors.mutedForeground,
  },
  trigger: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    borderRadius: radii.sm,
    paddingLeft: spacing[3],
    paddingRight: spacing[3],
    paddingTop: spacing[1.5],
    paddingBottom: spacing[1.5],
    fontSize: "0.875rem",
    fontWeight: 500,
    outline: "none",
    borderWidth: 0,
    backgroundColor: "transparent",
    color: colors.mutedForeground,
    cursor: "pointer",
    transitionProperty: "all",
    transitionDuration: "0.2s",
  },
  content: {
    marginTop: spacing[2],
    outline: "none",
  },
})

const Tabs = TabsPrimitive.Root

export interface TabsComponentProps {
  style?: stylex.StyleXStyles
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & TabsComponentProps
>(({ style, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    {...stylex.props(tabsStyles.list, style)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & TabsComponentProps
>(({ style, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    {...stylex.props(tabsStyles.trigger, style)}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & TabsComponentProps
>(({ style, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    {...stylex.props(tabsStyles.content, style)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
