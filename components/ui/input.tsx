import * as React from "react"
import * as stylex from "@stylexjs/stylex"
import type { WithStyleX } from "@/components/ui/types"
import { colors, spacing, radii } from "@/styles/tokens.stylex"

export const inputStyles = stylex.create({
  input: {
    display: "flex",
    height: "2.5rem",
    width: "100%",
    borderRadius: radii.md,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.input,
    backgroundColor: colors.background,
    paddingLeft: spacing[3],
    paddingRight: spacing[3],
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    fontSize: "0.875rem",
    color: colors.foreground,
    boxSizing: "border-box",
    outline: "none",
    transitionProperty: "border-color, box-shadow",
    transitionDuration: "0.2s",
    ":focus": {
      borderColor: colors.ring,
      boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.2)",
    },
    ":disabled": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
  },
})

export type InputProps = WithStyleX<React.ComponentProps<"input">>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, style, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        {...stylex.props(inputStyles.input, style)}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
