import * as React from "react"
import * as stylex from "@stylexjs/stylex"
import { colors, spacing, radii } from "@/styles/tokens.stylex"

export const cardStyles = stylex.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.cardForeground,
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[1.5],
    padding: spacing[6],
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: "-0.025em",
  },
  description: {
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
  content: {
    padding: spacing[6],
    paddingTop: 0,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    padding: spacing[6],
    paddingTop: 0,
  },
})

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: stylex.StyleXStyles
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ style, ...props }, ref) => (
    <div ref={ref} {...stylex.props(cardStyles.card, style)} {...props} />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ style, ...props }, ref) => (
    <div ref={ref} {...stylex.props(cardStyles.header, style)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLDivElement, CardProps>(
  ({ style, ...props }, ref) => (
    <div ref={ref} {...stylex.props(cardStyles.title, style)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLDivElement, CardProps>(
  ({ style, ...props }, ref) => (
    <div ref={ref} {...stylex.props(cardStyles.description, style)} {...props} />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ style, ...props }, ref) => (
    <div ref={ref} {...stylex.props(cardStyles.content, style)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(
  ({ style, ...props }, ref) => (
    <div ref={ref} {...stylex.props(cardStyles.footer, style)} {...props} />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
