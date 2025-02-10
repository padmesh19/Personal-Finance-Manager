import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ value, setValue }) {
  const [date, setDate] = React.useState(new Date());
  const [isOpen, setIsOpen] = React.useState(false);
  React.useEffect(() => {
    if (value) {
      setDate(new Date(value));
    }
    if (value=="") {
      setDate();
    }
  }, [value]);

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen} modal={isOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            setDate(date);
            setValue(date);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
