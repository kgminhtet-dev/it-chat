import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortName(name: string) {
  let nameSplit = name.split(' ');
  if (nameSplit.length > 1) {
    let firstWord = nameSplit[0];
    let lastWord = nameSplit[nameSplit.length - 1];
    return firstWord[0].toUpperCase() + lastWord[0].toUpperCase();
  }
  return name[0].toUpperCase() + name[1].toUpperCase();
}

export function formatDateToTimeString(date: Date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');

  return h + ':' + m + ' ' + ampm;
}

