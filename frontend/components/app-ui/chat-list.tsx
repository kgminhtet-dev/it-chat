import ChatListItem from '@/components/app-ui/chat-list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { IChat } from '@/lib/types/IChat';

interface Props {
  accountId: string;
  chats: IChat[];
}

export default function ChatList({ accountId, chats }: Props) {
  return (
    <div className={'row-span-10 border-b pl-2'}>
      {chats.length > 0 && (
        <ScrollArea className={'h-full pr-2'}>
          {
            chats.map((chat, index) => <div key={index}>
              <ChatListItem chat={chat} accountId={accountId} />
              <Separator className={'my-1'} />
            </div>)
          }
        </ScrollArea>
      )}
    </div>
  );
}
