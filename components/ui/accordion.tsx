"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import * as stylex from "@stylexjs/stylex"
import { colors, spacing } from "@/styles/tokens.stylex"

export const accordionStyles = stylex.create({
  item: {
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: colors.border,
  },
  header: {
    display: "flex",
    margin: 0,
  },
  trigger: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
    fontWeight: 500,
    fontSize: "0.875rem",
    color: colors.foreground,
    backgroundColor: "transparent",
    borderWidth: 0,
    cursor: "pointer",
    textDecoration: {
      default: "none",
      ":hover": "underline",
    },
  },
  content: {
    overflow: "hidden",
    fontSize: "0.875rem",
  },
  contentInner: {
    paddingBottom: spacing[4],
    paddingTop: 0,
  },
})

const Accordion = AccordionPrimitive.Root

export interface AccordionComponentProps {
  style?: stylex.StyleXStyles
}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & AccordionComponentProps
>(({ style, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    {...stylex.props(accordionStyles.item, style)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & AccordionComponentProps
>(({ style, children, ...props }, ref) => (
  <AccordionPrimitive.Header {...stylex.props(accordionStyles.header)}>
    <AccordionPrimitive.Trigger
      ref={ref}
      {...stylex.props(accordionStyles.trigger, style)}
      {...props}
    >
      {children}
      <ChevronDown style={{ width: 16, height: 16 }} />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & AccordionComponentProps
>(({ style, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    {...stylex.props(accordionStyles.content)}
    {...props}
  >
    <div {...stylex.props(accordionStyles.contentInner, style)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
