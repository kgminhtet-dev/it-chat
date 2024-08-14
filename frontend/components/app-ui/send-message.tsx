import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDateToTimeString, shortName } from '@/lib/utils';
import { IAccount } from '@/lib/types/IAccount';
import { IMessage } from '@/lib/types/IMessage';

interface Props {
  sender: IAccount;
  message: IMessage;
}

export default function SendMessage({ sender, message }: Props) {
  return (
    <div className="flex items-start gap-1 justify-end">
      <div className="relative grid gap-1">
        <div
          className="flex gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl text-sm max-w-screen-sm whitespace-pre-wrap">
          {message.content}
          <div className="w-12" />
        </div>
        <div className="absolute bottom-1 right-2 w-max text-nowrap text-xs text-end text-muted">
          {formatDateToTimeString(new Date(message.createdAt))}
        </div>
      </div>
      <Avatar className="w-10 h-10 shrink-0 border-2 border-background">
        <AvatarImage src="" />
        <AvatarFallback>{shortName(sender.fullname)}</AvatarFallback>
      </Avatar>
    </div>
  );
}
