"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the props for the component
interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  disabled?: boolean;
  modal?: boolean;
}

export function DateTimePicker({
  date,
  setDate,
  disabled = false,
  modal = false,
}: DateTimePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Memoize the time options to prevent re-calculation on every render
  const timeOptions = React.useMemo(() => {
    return Array.from({ length: 96 }, (_, i) => {
      const hour = Math.floor(i / 4)
        .toString()
        .padStart(2, "0");
      const minute = ((i % 4) * 15).toString().padStart(2, "0");
      return `${hour}:${minute}`;
    });
  }, []);

  /**
   * Handles the selection of a date from the calendar.
   * It combines the selected date with the existing time.
   */
  const handleDateSelect = (selectedDay: Date | undefined) => {
    if (!selectedDay) {
      setDate(undefined);
      return;
    }

    // Get the time from the existing date, or default to 00:00
    const hours = date?.getHours() ?? 0;
    const minutes = date?.getMinutes() ?? 0;

    const newDate = new Date(selectedDay);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);

    setDate(newDate);
    setIsCalendarOpen(false); // Close the popover on date selection
  };

  /**
   * Handles the selection of a time from the dropdown.
   * It combines the selected time with the existing date.
   */
  const handleTimeChange = (timeValue: string) => {
    // Get the date from the existing date, or default to today
    const newDate = date ? new Date(date) : new Date();

    const [hours, minutes] = timeValue.split(":").map(Number);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);

    setDate(newDate);
  };

  // Derive the time value from the date prop for the Select component
  const timeValue = date ? format(date, "HH:mm") : "";

  return (
    <div className="flex items-end gap-2">
      {/* Date Picker Popover */}
      <Popover
        open={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
        modal={modal}
      >
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>

      {/* Time Picker Select */}
      <Select
        value={timeValue}
        onValueChange={handleTimeChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Time" />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-[200px]">
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
}
