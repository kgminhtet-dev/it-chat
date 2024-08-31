import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDateToTimeString, shortName } from '@/lib/utils';
import { IMessage } from '@/lib/types/IMessage';
import { IMember } from '@/lib/types/IMember';

interface Props {
  sender: IMember;
  message: IMessage;
}

export default function ReceiveMessage({ sender, message }: Props) {
  return (
    <div className="flex items-start gap-1">
      <Avatar className="w-10 h-10 shrink-0 border-2 border-background">
        <AvatarImage src="" />
        <AvatarFallback>{shortName(sender.fullname)}</AvatarFallback>
      </Avatar>
      <div className="relative grid gap-1">
        <div
          className="flex bg-muted px-4 py-2 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl max-w-screen-sm whitespace-pre-wrap text-sm">
          {message.content}
          <div className="w-14" />
        </div>
        <div className="absolute right-2 bottom-1 text-xs text-muted-foreground">
          {formatDateToTimeString(new Date(message.createdAt))}
        </div>
      </div>
    </div>
  );
}
