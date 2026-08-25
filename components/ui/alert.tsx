import * as React from "react"
import * as stylex from "@stylexjs/stylex"
import { colors, spacing, radii } from "@/styles/tokens.stylex"

export const alertStyles = stylex.create({
  base: {
    position: "relative",
    width: "100%",
    borderRadius: radii.lg,
    borderWidth: "1px",
    borderStyle: "solid",
    padding: spacing[4],
    boxSizing: "border-box",
  },
  default: {
    borderColor: colors.border,
    backgroundColor: colors.background,
    color: colors.foreground,
  },
  destructive: {
    borderColor: "rgba(239, 68, 68, 0.5)",
    backgroundColor: "rgba(254, 242, 242, 0.5)",
    color: colors.destructive,
  },
  title: {
    marginBottom: spacing[1],
    fontWeight: 500,
    lineHeight: 1,
    letterSpacing: "-0.025em",
    marginTop: 0,
  },
  description: {
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
})

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
  style?: stylex.StyleXStyles
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "default", style, ...props }, ref) => {
    const variantStyle = alertStyles[variant] || alertStyles.default
    return (
      <div
        ref={ref}
        role="alert"
        {...stylex.props(alertStyles.base, variantStyle, style)}
        {...props}
      />
    )
  }
)
Alert.displayName = "Alert"

export interface AlertTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  style?: stylex.StyleXStyles
}

const AlertTitle = React.forwardRef<HTMLParagraphElement, AlertTextProps>(
  ({ style, ...props }, ref) => (
    <h5
      ref={ref}
      {...stylex.props(alertStyles.title, style)}
      {...props}
    />
  )
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertTextProps>(
  ({ style, ...props }, ref) => (
    <div
      ref={ref}
      {...stylex.props(alertStyles.description, style)}
      {...props}
    />
  )
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
