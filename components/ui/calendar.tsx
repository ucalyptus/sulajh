"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import * as stylex from "@stylexjs/stylex"
import { spacing } from "@/styles/tokens.stylex"

export const calendarStyles = stylex.create({
  root: {
    padding: spacing[3],
  },
})

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  style?: stylex.StyleXStyles
}

function Calendar({
  style,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const rootProps = stylex.props(calendarStyles.root, style)

  return (
    <div {...rootProps}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border rounded-md inline-flex items-center justify-center",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] text-center",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          day: "h-9 w-9 p-0 font-normal rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-sm",
          day_range_end: "day-range-end",
          day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
          day_today: "bg-gray-100 text-gray-900 font-semibold",
          day_outside: "day-outside text-gray-400 opacity-50",
          day_disabled: "text-gray-400 opacity-50",
          day_range_middle: "bg-gray-100 text-gray-900",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: () => <ChevronLeft style={{ width: 16, height: 16 }} />,
          IconRight: () => <ChevronRight style={{ width: 16, height: 16 }} />,
        }}
        {...props}
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
