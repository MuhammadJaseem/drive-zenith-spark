import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  pickupDate?: Date;
  returnDate?: Date;
  onPickupDateChange: (date: Date | undefined) => void;
  onReturnDateChange: (date: Date | undefined) => void;
  unavailableDates?: Date[];
  minRentalDays?: number;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  pickupDate,
  returnDate,
  onPickupDateChange,
  onReturnDateChange,
  unavailableDates = [],
  minRentalDays = 1,
  className
}) => {
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailableDate => 
      date.getDate() === unavailableDate.getDate() &&
      date.getMonth() === unavailableDate.getMonth() &&
      date.getFullYear() === unavailableDate.getFullYear()
    );
  };

  const handlePickupDateSelect = (date: Date | undefined) => {
    onPickupDateChange(date);
    if (date && returnDate && date >= returnDate) {
      onReturnDateChange(addDays(date, minRentalDays));
    }
    setIsPickupOpen(false);
  };

  const handleReturnDateSelect = (date: Date | undefined) => {
    onReturnDateChange(date);
    setIsReturnOpen(false);
  };

  const rentalDays = pickupDate && returnDate ? differenceInDays(returnDate, pickupDate) : 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Pickup Date */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Pickup Date
        </label>
        <Popover open={isPickupOpen} onOpenChange={setIsPickupOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !pickupDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {pickupDate ? format(pickupDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={pickupDate}
              onSelect={handlePickupDateSelect}
              disabled={(date) => 
                date < new Date() || isDateUnavailable(date)
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Return Date */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Return Date
        </label>
        <Popover open={isReturnOpen} onOpenChange={setIsReturnOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !returnDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {returnDate ? format(returnDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={returnDate}
              onSelect={handleReturnDateSelect}
              disabled={(date) => 
                !pickupDate || 
                date <= addDays(pickupDate, minRentalDays - 1) || 
                isDateUnavailable(date)
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Rental Summary */}
      {rentalDays > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Rental Period</span>
            <span className="font-medium">
              {rentalDays} day{rentalDays > 1 ? 's' : ''}
            </span>
          </div>
          {minRentalDays > 1 && rentalDays < minRentalDays && (
            <div className="mt-2 text-sm text-amber-600">
              Minimum rental period is {minRentalDays} days
            </div>
          )}
        </div>
      )}
    </div>
  );
};
