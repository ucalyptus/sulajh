"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import * as stylex from "@stylexjs/stylex"
import { colors, spacing, radii } from "@/styles/tokens.stylex"
import { buttonStyles } from "@/components/ui/button"

export const alertDialogStyles = stylex.create({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  content: {
    position: "fixed",
    left: "50%",
    top: "50%",
    zIndex: 50,
    display: "grid",
    width: "100%",
    maxWidth: "32rem",
    transform: "translate(-50%, -50%)",
    gap: spacing[4],
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: spacing[6],
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    borderRadius: radii.lg,
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
    textAlign: "left",
  },
  footer: {
    display: "flex",
    flexDirection: {
      default: "column-reverse",
      "@media (min-width: 640px)": "row",
    },
    justifyContent: "flex-end",
    gap: spacing[2],
  },
  title: {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: colors.foreground,
  },
  description: {
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
})

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogPortal = AlertDialogPrimitive.Portal

export interface AlertDialogComponentProps {
  style?: stylex.StyleXStyles
}

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay> & AlertDialogComponentProps
>(({ style, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    {...stylex.props(alertDialogStyles.overlay, style)}
    {...props}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & AlertDialogComponentProps
>(({ style, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      {...stylex.props(alertDialogStyles.content, style)}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & AlertDialogComponentProps) => (
  <div {...stylex.props(alertDialogStyles.header, style)} {...props} />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & AlertDialogComponentProps) => (
  <div {...stylex.props(alertDialogStyles.footer, style)} {...props} />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> & AlertDialogComponentProps
>(({ style, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    {...stylex.props(alertDialogStyles.title, style)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description> & AlertDialogComponentProps
>(({ style, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    {...stylex.props(alertDialogStyles.description, style)}
    {...props}
  />
))
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & AlertDialogComponentProps
>(({ style, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    {...stylex.props(buttonStyles.base, buttonStyles.default, buttonStyles.sizeDefault, style)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> & AlertDialogComponentProps
>(({ style, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    {...stylex.props(buttonStyles.base, buttonStyles.outline, buttonStyles.sizeDefault, style)}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
