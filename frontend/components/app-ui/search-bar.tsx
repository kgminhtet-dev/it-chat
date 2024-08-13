"use client";

import { SearchIcon } from "lucide-react";
import { useRef, useState } from "react";
import { IAccount } from "@/lib/types/IAccount";
import SearchListItem from "@/components/app-ui/search-list-item";
import { searchUsername } from "@/lib/actions";

export default function SearchBar() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<{
    searchResults: IAccount[];
    isSearching: boolean;
  }>({
    searchResults: [],
    isSearching: false,
  });

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center rounded-md bg-background px-4 py-2 shadow-sm">
        <SearchIcon className="h-5 w-5 text-muted-foreground" />
        <input
          ref={usernameRef}
          name="username"
          type="search"
          placeholder="Search..."
          onChange={() => {
            if (!usernameRef.current?.value)
              setSearch({
                isSearching: false,
                searchResults: [],
              });
          }}
          onKeyDown={async (event) => {
            if (event.key === "Enter" && usernameRef.current) {
              const username = usernameRef.current.value;
              const findAccount = await searchUsername(username);
              if (findAccount.id) {
                setSearch({
                  isSearching: true,
                  searchResults: [findAccount],
                });
              } else {
                setSearch({
                  isSearching: true,
                  searchResults: [],
                });
              }
            }
          }}
          className="ml-3 w-full border-none bg-transparent focus:outline-none focus:ring-0"
        />
      </div>
      {search.isSearching &&
        (search.searchResults.length > 0 ? (
          <ul className="absolute z-10 w-1/4 top-10 p-1 bg-background shadow-lg">
            {search.searchResults.map((result) => (
              <li
                key={result.id}
                onClick={() => {
                  if (usernameRef.current) usernameRef.current.value = "";
                  setSearch({ searchResults: [], isSearching: false });
                }}
                className="cursor-pointer m-1 hover:bg-muted"
              >
                <SearchListItem foundUser={result} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="absolute z-10 w-1/4 top-10 p-2 bg-background shadow-lg text-center">
            user not found
          </div>
        ))}
    </div>
  );
}
