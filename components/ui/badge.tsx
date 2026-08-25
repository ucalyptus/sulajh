import * as React from "react"
import * as stylex from "@stylexjs/stylex"
import type { WithStyleX } from "@/components/ui/types"
import { colors, spacing, radii } from "@/styles/tokens.stylex"

export const badgeStyles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: radii.full,
    borderWidth: "1px",
    borderStyle: "solid",
    paddingLeft: spacing[2.5],
    paddingRight: spacing[2.5],
    paddingTop: spacing[0.5],
    paddingBottom: spacing[0.5],
    fontSize: "0.75rem",
    fontWeight: 600,
    transitionProperty: "background-color, color, border-color",
    transitionDuration: "0.2s",
    boxSizing: "border-box",
  },
  default: {
    borderColor: "transparent",
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
  },
  secondary: {
    borderColor: "transparent",
    backgroundColor: colors.secondary,
    color: colors.secondaryForeground,
  },
  destructive: {
    borderColor: "transparent",
    backgroundColor: colors.destructive,
    color: colors.destructiveForeground,
  },
  outline: {
    borderColor: colors.border,
    backgroundColor: "transparent",
    color: colors.foreground,
  },
})

export type BadgeProps = WithStyleX<React.HTMLAttributes<HTMLDivElement>> & {
  variant?: "destructive" | "default" | "secondary" | "destructive" | "outline"
  children?: React.ReactNode
}

export function Badge({ variant = "default", style, ...props }: BadgeProps) {
  const variantStyle = badgeStyles[variant] || badgeStyles.default
  return (
    <div
      {...stylex.props(badgeStyles.base, variantStyle, style)}
      {...props}
    />
  )
}
