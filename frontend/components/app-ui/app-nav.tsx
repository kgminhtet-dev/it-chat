import ChatList from "@/components/app-ui/chat-list";
import ProfileBar from "@/components/app-ui/profile-bar";
import SearchBar from "@/components/app-ui/search-bar";
import { IAccount } from "@/lib/types/IAccount";

interface Props {
  account: IAccount;
}

export default function AppNav({ account }: Props) {
  return (
    <div
      className={
        "grid grid-flow-row grid-rows-12 col-span-1 border-r-2 overflow-auto"
      }
    >
      <SearchBar />
      <ChatList />
      <ProfileBar account={account} />
    </div>
  );
}
