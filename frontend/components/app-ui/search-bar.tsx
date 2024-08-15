'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import SearchListItem from '@/components/app-ui/search-list-item';
import { SearchIcon } from 'lucide-react';
import { alreadyChats, searchChatByName, searchUsername } from '@/lib/actions';
import useAppStore from '@/components/hooks/use-app-store';
import { IAccount } from '@/lib/types/IAccount';
import { useToast } from '@/components/ui/use-toast';

export default function SearchBar() {
  const { toast } = useToast();
  const chats = useAppStore((state) => state.chats);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{
    account: IAccount;
    chatId?: string;
  }[]>([]);

  return (
    <>
      <div className="relative flex items-center rounded-md bg-background px-4 py-2 shadow-sm">
        <Input
          type="search"
          placeholder="Search chats or start conversation..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          onKeyDown={async (e) => {
            if (e.key === 'Enter' && searchTerm.length > 0) {
              const name = searchTerm.toLowerCase();
              if (name[0] === '@') {
                const chat = await alreadyChats(chats, name);
                if (chat) {
                  setSearchResults([{
                    account: chat.contact,
                    chatId: chat.id,
                  }]);
                  return;
                }
                const username = await searchUsername(name);
                if (username.error) {
                  toast({
                    variant: 'destructive',
                    title: username.error,
                  });
                  setSearchResults([]);
                  return;
                }
                if (username)
                  setSearchResults([{ account: username }]);
                return;
              }
              const foundChats = await searchChatByName(chats, name);
              if (foundChats)
                setSearchResults(foundChats.map(
                  (chat) => ({ account: chat.contact, chatId: chat.id })),
                );
              return;
            }
            setSearchResults([]);
          }}
          className="pr-8"
        />
        <SearchIcon className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>
      {searchTerm.length > 0 && (
        <div
          className="m-1 z-50 absolute w-1/4 h-max top-11 rounded-md border-2 border-blue-400 bg-background shadow-sm">
          {searchResults.length > 0 ? (
            <ScrollArea>
              <ul className="max-h-[300px]">
                {searchResults.map((result, index) => (
                  <li key={index} className="cursor-pointer px-2 py-2 hover:bg-muted">
                    <SearchListItem
                      foundUser={result.account}
                      chatId={result.chatId}
                      clearSearchTerm={setSearchTerm}
                    />
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <div className="px-4 py-2 text-muted-foreground">No results found.</div>
          )}
        </div>
      )}
    </>
  );
}
