import SearchBar from '@/components/app-ui/search-bar';
import ChatList from '@/components/app-ui/chat-list';
import ProfileBar from '@/components/app-ui/profile-bar';
import { getAccount, getChats } from '@/lib/actions';

interface Props {
  accountId: string;
}

export default async function AppNav({ accountId }: Props) {
  const account = await getAccount(accountId);
  const { error, chats } = await getChats(accountId);

  return (
    <div
      className={
        'grid grid-flow-row grid-rows-12 col-span-1 border-r-2 overflow-auto'
      }
    >
      <SearchBar chats={chats} account={account} />
      <ChatList chats={chats} accountId={account.id} />
      <ProfileBar account={account} />
    </div>
  );
}