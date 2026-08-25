"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import * as stylex from "@stylexjs/stylex"
import { colors, spacing, radii } from "@/styles/tokens.stylex"

export const sheetStyles = stylex.create({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  base: {
    position: "fixed",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
    backgroundColor: colors.background,
    padding: spacing[6],
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    transitionProperty: "transform",
    transitionDuration: "0.3s",
    boxSizing: "border-box",
  },
  top: {
    insetLeft: 0,
    insetRight: 0,
    top: 0,
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: colors.border,
  },
  bottom: {
    insetLeft: 0,
    insetRight: 0,
    bottom: 0,
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: colors.border,
  },
  left: {
    insetTop: 0,
    insetBottom: 0,
    left: 0,
    height: "100%",
    width: "75%",
    maxWidth: "24rem",
    borderRightWidth: "1px",
    borderRightStyle: "solid",
    borderRightColor: colors.border,
  },
  right: {
    insetTop: 0,
    insetBottom: 0,
    right: 0,
    height: "100%",
    width: "75%",
    maxWidth: "24rem",
    borderLeftWidth: "1px",
    borderLeftStyle: "solid",
    borderLeftColor: colors.border,
  },
  close: {
    position: "absolute",
    right: spacing[4],
    top: spacing[4],
    borderRadius: radii.sm,
    opacity: 0.7,
    borderWidth: 0,
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: spacing[1],
    ":hover": {
      opacity: 1,
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
    color: colors.foreground,
  },
  description: {
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
})

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal

export interface SheetComponentProps {
  style?: stylex.StyleXStyles
}

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> & SheetComponentProps
>(({ style, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    {...stylex.props(sheetStyles.overlay, style)}
    {...props}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    SheetComponentProps {
  side?: "top" | "bottom" | "left" | "right"
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", style, children, ...props }, ref) => {
  const sideStyle = sheetStyles[side] || sheetStyles.right
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        {...stylex.props(sheetStyles.base, sideStyle, style)}
        {...props}
      >
        {children}
        <SheetPrimitive.Close {...stylex.props(sheetStyles.close)}>
          <X style={{ width: 16, height: 16 }} />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
})
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & SheetComponentProps) => (
  <div {...stylex.props(sheetStyles.header, style)} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & SheetComponentProps) => (
  <div {...stylex.props(sheetStyles.footer, style)} {...props} />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title> & SheetComponentProps
>(({ style, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    {...stylex.props(sheetStyles.title, style)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description> & SheetComponentProps
>(({ style, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    {...stylex.props(sheetStyles.description, style)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
