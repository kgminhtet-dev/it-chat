import { Clock3Icon } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import TimePicker from '@/components/app-ui/time-picker';
import { ITime } from '@/lib/types/ITime';

interface Props {
  time: ITime,
  setTime: Function,
}

export default function DisappearMessageTimePicker({ time, setTime }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Clock3Icon className={'w-5 h-5 cursor-pointer'} />
      </DialogTrigger>
      <DialogContent className="w-max ">
        <DialogHeader>
          <DialogTitle>Disappeared Message Send</DialogTitle>
          <DialogDescription>
            This message will be disappeared as time you provided.
          </DialogDescription>
        </DialogHeader>
        <div className={'w-max'}>
          <TimePicker
            time={time}
            setTime={setTime}
          />
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setTime({
                  hour: 0,
                  minute: 0,
                  second: 0,
                });
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Set
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}