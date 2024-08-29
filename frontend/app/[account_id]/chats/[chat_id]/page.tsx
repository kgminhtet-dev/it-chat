import ConversationBar from '@/components/app-ui/conversation-bar';
import MessageList from '@/components/app-ui/message-list';
import MessageInput from '@/components/app-ui/message-input';
import { getAccount, getChat } from '@/lib/actions/server-actions';

export default async function ConversationPage(
  { params }: { params: { account_id: string, chat_id: string } },
) {
  const account = await getAccount(params.account_id);
  const chat = await getChat(params.account_id, params.chat_id);

  return (
    <div className="h-full row-span-12 flex flex-col">
      <div className={'h-12'}>
        <ConversationBar chat={chat} />
      </div>
      <div className={'flex-1 overflow-auto'}>
        <MessageList account={account} chat={chat} />
      </div>
      <MessageInput account={account} chat={chat} />
    </div>
  );
}