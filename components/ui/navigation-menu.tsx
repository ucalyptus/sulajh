import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { ChevronDown } from "lucide-react"
import * as stylex from "@stylexjs/stylex"
import { colors, spacing, radii } from "@/styles/tokens.stylex"

export const navigationMenuStyles = stylex.create({
  root: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    maxWidth: "max-content",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    display: "flex",
    flex: 1,
    listStyleType: "none",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[1],
    padding: 0,
    margin: 0,
  },
  trigger: {
    display: "inline-flex",
    height: "2.5rem",
    width: "max-content",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    backgroundColor: colors.background,
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    fontSize: "0.875rem",
    fontWeight: 500,
    color: colors.foreground,
    outline: "none",
    borderWidth: 0,
    cursor: "pointer",
    transitionProperty: "background-color, color",
    transitionDuration: "0.2s",
    ":hover": {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  triggerChevron: {
    marginLeft: spacing[1],
    height: "0.75rem",
    width: "0.75rem",
    transitionProperty: "transform",
    transitionDuration: "0.2s",
  },
  content: {
    left: 0,
    top: 0,
    width: "100%",
  },
  viewportWrapper: {
    position: "absolute",
    left: 0,
    top: "100%",
    display: "flex",
    justifyContent: "center",
  },
  viewport: {
    position: "relative",
    marginTop: spacing[1.5],
    height: "var(--radix-navigation-menu-viewport-height)",
    width: "100%",
    overflow: "hidden",
    borderRadius: radii.md,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  indicator: {
    top: "100%",
    zIndex: 1,
    display: "flex",
    height: "0.625rem",
    alignItems: "flex-end",
    justifyContent: "center",
    overflow: "hidden",
  },
  indicatorArrow: {
    position: "relative",
    top: "60%",
    height: "0.5rem",
    width: "0.5rem",
    transform: "rotate(45deg)",
    borderRadius: radii.sm,
    backgroundColor: colors.border,
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  },
})

export interface NavigationMenuComponentProps {
  style?: stylex.StyleXStyles
}

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & NavigationMenuComponentProps
>(({ style, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    {...stylex.props(navigationMenuStyles.root, style)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List> & NavigationMenuComponentProps
>(({ style, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    {...stylex.props(navigationMenuStyles.list, style)}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> & NavigationMenuComponentProps
>(({ style, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    {...stylex.props(navigationMenuStyles.trigger, style)}
    {...props}
  >
    {children}
    <ChevronDown {...stylex.props(navigationMenuStyles.triggerChevron)} aria-hidden="true" />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content> & NavigationMenuComponentProps
>(({ style, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    {...stylex.props(navigationMenuStyles.content, style)}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport> & NavigationMenuComponentProps
>(({ style, ...props }, ref) => (
  <div {...stylex.props(navigationMenuStyles.viewportWrapper)}>
    <NavigationMenuPrimitive.Viewport
      ref={ref}
      {...stylex.props(navigationMenuStyles.viewport, style)}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator> & NavigationMenuComponentProps
>(({ style, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    {...stylex.props(navigationMenuStyles.indicator, style)}
    {...props}
  >
    <div {...stylex.props(navigationMenuStyles.indicatorArrow)} />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
