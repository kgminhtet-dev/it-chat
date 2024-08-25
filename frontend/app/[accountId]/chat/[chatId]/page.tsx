import ConversationBar from '@/components/app-ui/conversation-bar';
import { getAccount, getChat, getMessages } from '@/lib/actions';
import { IChat } from '@/lib/types/IChat';
import { IProfile } from '@/lib/types/IProfile';
import MessageList from '@/components/app-ui/message-list';

export default async function ConversationPage(
  { params }: { params: { accountId: string, chatId: string } },
) {
  const account: IProfile = await getAccount(params.accountId);
  const chat: IChat = await getChat(params.accountId, params.chatId);
  const messages = await getMessages(account.id, chat.id);

  return (
    <div className="row-span-11">
      <div className={'h-full flex flex-col'}>
        <div className={'h-12'}>
          <ConversationBar chat={chat} />
        </div>
        <div className={'flex-1 overflow-auto'}>
          <MessageList
            account={account}
            chat={chat}
            messages={messages}
          />
        </div>
      </div>
    </div>
  );
}