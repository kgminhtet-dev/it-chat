'use client';

import SearchListItem from '@/components/app-ui/search-list-item';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { searchChatByName, searchUsername } from '@/lib/actions/server-actions';
import { IAccount } from '@/lib/types/IAccount';
import { useState } from 'react';
import useAppStore from '../hooks/use-app-store';
import { IMember } from '@/lib/types/IMember';
import { IChat } from '@/lib/types/IChat';
import { SearchIcon } from 'lucide-react';

export default function SearchBar(): JSX.Element {
  const { toast } = useToast();
  const account = useAppStore((state) => state.account) as IAccount;
  const chats = useAppStore((state) => state.chats);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<
    {
      account: IMember;
      chat?: IChat;
    }[]
  >([]);

  return (
    <>
      <div className="relative row-span-1 flex items-center p-1 border-r-2">
        <Input
          type="search"
          placeholder="Search chats or start conversation..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className={'pr-7'}
          onKeyDown={async (e) => {
            const search = searchTerm.trim();
            if (e.key === 'Enter' && search) {

              if (search[0] === '@') {
                const username = await searchUsername(search);
                if (username.error) {
                  toast({
                    variant: 'destructive',
                    title: username.error,
                  });
                  return;
                }
                if (username) setSearchResults([{ account: username }]);
                return;
              }

              const foundChats = await searchChatByName(
                chats,
                search.toLowerCase(),
              );
              if (foundChats)
                setSearchResults(
                  foundChats.map((chat) => ({
                    account: chat.contact,
                    chat: chat,
                  })),
                );
              return;
            }
            setSearchResults([]);
          }}
        />
        <SearchIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>
      {searchTerm.length > 0 && (
        <div className="m-1 z-50 absolute w-1/4 h-max top-11 rounded-md border bg-background shadow-sm">
          {searchResults.length > 0 ? (
            <ScrollArea>
              <ul className="max-h-[300px] rounded shadow-md border p-1">
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className="cursor-pointer px-2 py-2 border-b hover:bg-muted"
                  >
                    <SearchListItem
                      account={account}
                      foundUser={result.account}
                      chat={result.chat}
                      clearSearchTerm={setSearchTerm}
                    />
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <div className="px-4 py-2 text-muted-foreground">
              No results found.
            </div>
          )}
        </div>
      )}
    </>
  );
}
