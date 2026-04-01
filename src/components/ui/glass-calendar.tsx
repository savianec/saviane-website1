"use client";

import * as React from "react";
import {
  format,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  getDate,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  startOfWeek,
} from "date-fns";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type DayCell = {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
};

export interface GlassCalendarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  selectedDate?: Date | null;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export const GlassCalendar = React.forwardRef<
  HTMLDivElement,
  GlassCalendarProps
>(
  (
    {
      className,
      selectedDate: propSelectedDate,
      onDateSelect,
      ...props
    },
    ref
  ) => {
    const [currentMonth, setCurrentMonth] = React.useState<Date>(() =>
      propSelectedDate ?? new Date()
    );
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(() =>
      propSelectedDate ?? null
    );

    React.useEffect(() => {
      if (propSelectedDate) {
        setSelectedDate(propSelectedDate);
        setCurrentMonth(propSelectedDate);
      } else {
        setSelectedDate(null);
        setCurrentMonth(new Date());
      }
    }, [propSelectedDate]);

    /** Sunday-first row alignment (matches `getDay()`). */
    const weekStartsOn = 0 as const;

    const weekdayLabels = React.useMemo(() => {
      const anchor = startOfWeek(startOfMonth(currentMonth), {
        weekStartsOn,
      });
      return Array.from({ length: 7 }, (_, i) =>
        format(addDays(anchor, i), "EEEEE")
      );
    }, [currentMonth]);

    const calendarCells = React.useMemo(() => {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      const daysInMonth = eachDayOfInterval({ start, end });
      const pad = (getDay(start) - weekStartsOn + 7) % 7;
      const cells: (DayCell | null)[] = [];
      for (let i = 0; i < pad; i++) cells.push(null);
      for (const date of daysInMonth) {
        cells.push({
          date,
          isToday: isToday(date),
          isSelected: selectedDate
            ? isSameDay(date, selectedDate)
            : false,
        });
      }
      while (cells.length % 7 !== 0) cells.push(null);
      return cells;
    }, [currentMonth, selectedDate]);

    const handleDateClick = (date: Date) => {
      setSelectedDate(date);
      onDateSelect?.(date);
    };

    const handlePrevMonth = () => {
      setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = () => {
      setCurrentMonth(addMonths(currentMonth, 1));
    };

    return (
      <div
        ref={ref}
        className={cn(
          "border-border bg-card/50 text-foreground w-full max-w-[360px] overflow-hidden rounded-3xl border p-5 shadow-lg backdrop-blur-xl",
          className
        )}
        {...props}
      >
        <div className="my-2 flex items-center justify-between">
          <motion.p
            key={format(currentMonth, "yyyy-MM")}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-3xl font-bold tracking-tight"
          >
            {format(currentMonth, "MMMM yyyy")}
          </motion.p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="text-muted-foreground hover:bg-muted/60 rounded-full p-1 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="text-muted-foreground hover:bg-muted/60 rounded-full p-1 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-7 gap-1">
            {weekdayLabels.map((label, i) => (
              <div
                key={`${label}-${i}`}
                className="text-muted-foreground flex h-6 items-center justify-center text-[10px] font-bold uppercase tracking-wide"
              >
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((cell, i) =>
              cell ? (
                <button
                  key={format(cell.date, "yyyy-MM-dd")}
                  type="button"
                  onClick={() => handleDateClick(cell.date)}
                  className={cn(
                    "relative flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    cell.isSelected
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted/80 text-foreground"
                  )}
                >
                  {cell.isToday && !cell.isSelected ? (
                    <span className="bg-primary absolute bottom-1 size-1 rounded-full" />
                  ) : null}
                  {getDate(cell.date)}
                </button>
              ) : (
                <span key={`empty-${i}`} className="size-8" aria-hidden />
              )
            )}
          </div>
        </div>
      </div>
    );
  }
);

GlassCalendar.displayName = "GlassCalendar";
