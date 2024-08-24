"use client";

import ChatList from "@/components/app-ui/chat-list";
import FetchProfile from "@/components/app-ui/fetch-profile";
import FetchToken from "@/components/app-ui/fetch-token";
import ProfileBar from "@/components/app-ui/profile-bar";
import SearchBar from "@/components/app-ui/search-bar";
import WebSocket from "@/components/app-ui/websocket";
import useAppStore from "@/components/hooks/use-app-store";
import { Toaster } from "@/components/ui/toaster";
import { IProfile } from "@/lib/types/IProfile";

export default function ChatLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = useAppStore((state) => state.profile) as IProfile;
  const token = useAppStore((state) => state.token);

  if (!profile) return <FetchProfile />;

  if (!token) return <FetchToken />;

  return (
    <main className={"h-screen grid grid-flow-col grid-cols-4"}>
      <WebSocket token={token} />
      <div
        className={
          "grid grid-flow-row grid-rows-12 col-span-1 border-r-2 overflow-auto"
        }
      >
        <SearchBar />
        <ChatList />
        <ProfileBar profile={profile} />
      </div>
      {children}
      <Toaster />
    </main>
  );
}
