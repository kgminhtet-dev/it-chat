import { ITime } from '../../types/time';

export function convertTimeToMilliseconds(time: ITime) {
  return (
    time.hour * 60 * 60 * 1000 + time.minute * 60 * 1000 + time.second * 1000
  );
}
