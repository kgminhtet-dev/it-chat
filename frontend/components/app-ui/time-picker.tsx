import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ITime } from '@/lib/types/ITime';

interface Props {
  time: ITime,
  setTime: Function,
}

export default function TimePicker({ time, setTime }: Props) {
  const handleTimeChange = (field: string, value: number) => {
    setTime((prevTime: ITime) => ({
      ...prevTime,
      [field]: value,
    }));
  };
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center">
        <Label htmlFor="hour" className="text-sm font-medium">
          Hour
        </Label>
        <Input
          id="hour"
          type="number"
          min="0"
          max="23"
          value={time.hour}
          onChange={(e) => handleTimeChange('hour', Number(e.target.value))}
          className="w-16 text-center"
        />
      </div>
      <div className="flex flex-col items-center">
        <Label htmlFor="minute" className="text-sm font-medium">
          Minute
        </Label>
        <Input
          id="minute"
          type="number"
          min="0"
          max="59"
          value={time.minute}
          onChange={(e) => handleTimeChange('minute', Number(e.target.value))}
          className="w-16 text-center"
        />
      </div>
      <div className="flex flex-col items-center">
        <Label htmlFor="second" className="text-sm font-medium">
          Second
        </Label>
        <Input
          id="second"
          type="number"
          min="0"
          max="59"
          value={time.second}
          onChange={(e) => handleTimeChange('second', Number(e.target.value))}
          className="w-16 text-center"
        />
      </div>
    </div>
  );
}

// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
// import { CalendarDaysIcon } from 'lucide-react';
//
// export default function TimePicker() {
//   return (
//     <div className="flex items-center gap-4">
//       <div className="flex items-center gap-2">
//         <Input
//           type="number"
//           min="1"
//           max="12"
//           className="w-16 h-10 rounded-md border border-input bg-background px-3 py-2 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//         />
//       </div>
//       <span className="text-muted-foreground">:</span>
//       <div className="flex items-center gap-2">
//         <Input
//           type="number"
//           min="0"
//           max="59"
//           className="w-16 h-10 rounded-md border border-input bg-background px-3 py-2 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//         />
//       </div>
//       <span className="text-muted-foreground">:</span>
//       <div className="flex items-center gap-2">
//         <Input
//           type="number"
//           min="0"
//           max="59"
//           className="w-16 h-10 rounded-md border border-input bg-background px-3 py-2 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//         />
//       </div>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             type="button"
//             className="h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
//           >
//             <CalendarDaysIcon className="mr-2 h-4 w-4" />
//             Pick a date
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar mode="single" initialFocus />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
