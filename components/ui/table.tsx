import * as React from "react"
import * as stylex from "@stylexjs/stylex"
import { colors, spacing } from "@/styles/tokens.stylex"

export const tableStyles = stylex.create({
  wrapper: {
    position: "relative",
    width: "100%",
    overflow: "auto",
  },
  table: {
    width: "100%",
    captionSide: "bottom",
    fontSize: "0.875rem",
    borderCollapse: "collapse",
  },
  header: {
    backgroundColor: colors.muted,
  },
  body: {},
  footer: {
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: colors.border,
    backgroundColor: colors.muted,
    fontWeight: 500,
  },
  row: {
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: colors.border,
    transitionProperty: "background-color",
    transitionDuration: "0.2s",
    ":hover": {
      backgroundColor: "rgba(243, 244, 246, 0.5)",
    },
  },
  head: {
    height: "3rem",
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    textAlign: "left",
    verticalAlign: "middle",
    fontWeight: 500,
    color: colors.mutedForeground,
  },
  cell: {
    padding: spacing[4],
    verticalAlign: "middle",
  },
  caption: {
    marginTop: spacing[4],
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
})

export interface TableComponentProps {
  style?: stylex.StyleXStyles
}

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & TableComponentProps
>(({ style, ...props }, ref) => (
  <div {...stylex.props(tableStyles.wrapper)}>
    <table
      ref={ref}
      {...stylex.props(tableStyles.table, style)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & TableComponentProps
>(({ style, ...props }, ref) => (
  <thead ref={ref} {...stylex.props(tableStyles.header, style)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & TableComponentProps
>(({ style, ...props }, ref) => (
  <tbody ref={ref} {...stylex.props(tableStyles.body, style)} {...props} />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & TableComponentProps
>(({ style, ...props }, ref) => (
  <tfoot ref={ref} {...stylex.props(tableStyles.footer, style)} {...props} />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & TableComponentProps
>(({ style, ...props }, ref) => (
  <tr ref={ref} {...stylex.props(tableStyles.row, style)} {...props} />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & TableComponentProps
>(({ style, ...props }, ref) => (
  <th ref={ref} {...stylex.props(tableStyles.head, style)} {...props} />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & TableComponentProps
>(({ style, ...props }, ref) => (
  <td ref={ref} {...stylex.props(tableStyles.cell, style)} {...props} />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement> & TableComponentProps
>(({ style, ...props }, ref) => (
  <caption ref={ref} {...stylex.props(tableStyles.caption, style)} {...props} />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
