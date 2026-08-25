"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { X } from "lucide-react"
import * as stylex from "@stylexjs/stylex"
import { colors, spacing, radii } from "@/styles/tokens.stylex"

export const toastStyles = stylex.create({
  viewport: {
    position: "fixed",
    top: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    maxHeight: "100vh",
    width: "100%",
    flexDirection: "column-reverse",
    padding: spacing[4],
    boxSizing: "border-box",
  },
  base: {
    pointerEvents: "auto",
    position: "relative",
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[4],
    overflow: "hidden",
    borderRadius: radii.md,
    borderWidth: "1px",
    borderStyle: "solid",
    padding: spacing[6],
    paddingRight: spacing[8],
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    transitionProperty: "all",
    transitionDuration: "0.2s",
    boxSizing: "border-box",
  },
  default: {
    borderColor: colors.border,
    backgroundColor: colors.background,
    color: colors.foreground,
  },
  destructive: {
    borderColor: colors.destructive,
    backgroundColor: colors.destructive,
    color: colors.destructiveForeground,
  },
  action: {
    display: "inline-flex",
    height: "2rem",
    shrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: "transparent",
    paddingLeft: spacing[3],
    paddingRight: spacing[3],
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  close: {
    position: "absolute",
    right: spacing[2],
    top: spacing[2],
    borderRadius: radii.md,
    padding: spacing[1],
    opacity: 0.5,
    borderWidth: 0,
    backgroundColor: "transparent",
    cursor: "pointer",
    ":hover": {
      opacity: 1,
    },
  },
  title: {
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  description: {
    fontSize: "0.875rem",
    opacity: 0.9,
  },
})

const ToastProvider = ToastPrimitives.Provider

export interface ToastComponentProps {
  style?: stylex.StyleXStyles
}

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> & ToastComponentProps
>(({ style, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    {...stylex.props(toastStyles.viewport, style)}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> {
  variant?: "default" | "destructive"
  style?: stylex.StyleXStyles
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ style, variant = "default", ...props }, ref) => {
  const variantStyle = toastStyles[variant] || toastStyles.default
  return (
    <ToastPrimitives.Root
      ref={ref}
      {...stylex.props(toastStyles.base, variantStyle, style)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> & ToastComponentProps
>(({ style, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    {...stylex.props(toastStyles.action, style)}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close> & ToastComponentProps
>(({ style, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    {...stylex.props(toastStyles.close, style)}
    {...props}
  >
    <X style={{ width: 16, height: 16 }} />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> & ToastComponentProps
>(({ style, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    {...stylex.props(toastStyles.title, style)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description> & ToastComponentProps
>(({ style, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    {...stylex.props(toastStyles.description, style)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
