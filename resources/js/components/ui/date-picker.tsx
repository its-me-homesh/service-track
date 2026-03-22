"use client"

import * as React from "react"
import { format, parse, parseISO, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  value?: string | null
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  name?: string
  className?: string
  error?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  id,
  name,
  className,
  error,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined
    const trimmed = value.trim()
    if (!trimmed) return undefined

    const isoParsed = parseISO(trimmed)
    if (isValid(isoParsed)) {
      return isoParsed
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const parsed = parse(trimmed, "yyyy-MM-dd", new Date())
      return isValid(parsed) ? parsed : undefined
    }

    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(trimmed)) {
      const parsed = parse(trimmed, "yyyy-MM-dd HH:mm:ss", new Date())
      return isValid(parsed) ? parsed : undefined
    }

    return undefined
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          name={name}
          type="button"
          variant="outline"
          disabled={disabled}
          data-empty={!selectedDate}
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full justify-start text-left font-normal",
            "data-[empty=true]:text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, "MMM d, yyyy")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2">
        <div className="flex items-center justify-between gap-2 px-1 pb-2">
          <span className="text-sm font-medium">Select date</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => {
              onChange("")
              setOpen(false)
            }}
          >
            Clear
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : "")
            setOpen(false)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
