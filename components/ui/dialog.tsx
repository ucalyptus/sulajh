"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import * as stylex from "@stylexjs/stylex"
import { colors, spacing, radii } from "@/styles/tokens.stylex"

export const dialogStyles = stylex.create({
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
  closeButton: {
    position: "absolute",
    right: spacing[4],
    top: spacing[4],
    borderRadius: radii.sm,
    opacity: 0.7,
    borderWidth: 0,
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: spacing[1],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ":hover": {
      opacity: 1,
      backgroundColor: colors.accent,
    },
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[1.5],
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
    lineHeight: 1,
    letterSpacing: "-0.025em",
    color: colors.foreground,
  },
  description: {
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
})

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

export interface DialogComponentProps {
  style?: stylex.StyleXStyles
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & DialogComponentProps
>(({ style, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    {...stylex.props(dialogStyles.overlay, style)}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & DialogComponentProps
>(({ style, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      {...stylex.props(dialogStyles.content, style)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close {...stylex.props(dialogStyles.closeButton)}>
        <X style={{ width: 16, height: 16 }} />
        <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", border: 0 }}>Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & DialogComponentProps) => (
  <div {...stylex.props(dialogStyles.header, style)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & DialogComponentProps) => (
  <div {...stylex.props(dialogStyles.footer, style)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & DialogComponentProps
>(({ style, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    {...stylex.props(dialogStyles.title, style)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & DialogComponentProps
>(({ style, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    {...stylex.props(dialogStyles.description, style)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
