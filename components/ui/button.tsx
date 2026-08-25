import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import * as stylex from "@stylexjs/stylex"
import { colors, spacing, radii } from "@/styles/tokens.stylex"

export const buttonStyles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    whiteSpace: "nowrap",
    borderRadius: radii.md,
    fontSize: "0.875rem",
    fontWeight: 500,
    outline: "none",
    transitionProperty: "background-color, color, border-color, box-shadow",
    transitionDuration: "0.2s",
    cursor: "pointer",
    textDecoration: "none",
    borderWidth: 0,
    borderStyle: "solid",
    boxSizing: "border-box",
    opacity: {
      default: 1,
      ":disabled": 0.5,
    },
    pointerEvents: {
      default: "auto",
      ":disabled": "none",
    },
  },
  default: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    ":hover": {
      backgroundColor: "hsl(221 83% 45%)",
    },
  },
  destructive: {
    backgroundColor: colors.destructive,
    color: colors.destructiveForeground,
    ":hover": {
      backgroundColor: "hsl(0 84% 50%)",
    },
  },
  outline: {
    borderWidth: "1px",
    borderColor: colors.input,
    backgroundColor: colors.background,
    color: colors.foreground,
    ":hover": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  secondary: {
    backgroundColor: colors.secondary,
    color: colors.secondaryForeground,
    ":hover": {
      backgroundColor: "hsl(210 40% 90%)",
    },
  },
  ghost: {
    backgroundColor: "transparent",
    color: colors.foreground,
    ":hover": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  link: {
    backgroundColor: "transparent",
    color: colors.primary,
    textDecoration: {
      default: "none",
      ":hover": "underline",
    },
  },
  sizeDefault: {
    height: "2.5rem",
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
  },
  sm: {
    height: "2.25rem",
    borderRadius: radii.md,
    paddingLeft: spacing[3],
    paddingRight: spacing[3],
  },
  lg: {
    height: "2.75rem",
    borderRadius: radii.md,
    paddingLeft: spacing[8],
    paddingRight: spacing[8],
  },
  icon: {
    height: "2.5rem",
    width: "2.5rem",
    padding: 0,
  },
})

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
  style?: stylex.StyleXStyles
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const variantStyle = buttonStyles[variant] || buttonStyles.default
    const sizeStyle = size === "default" ? buttonStyles.sizeDefault : buttonStyles[size] || buttonStyles.sizeDefault

    return (
      <Comp
        ref={ref}
        {...stylex.props(buttonStyles.base, variantStyle, sizeStyle, style)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
