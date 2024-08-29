"use client";

import AppNav from "@/components/app-ui/app-nav";
import FetchProfile from "@/components/app-ui/fetch-profile";
import useAppStore from "@/components/hooks/use-app-store";
import { usePathname } from "next/navigation";

export default function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const account_id = pathname.split("/")[1];
  const account = useAppStore((state) => state.account);

  if (!account) return <FetchProfile accountId={account_id} />;

  return (
    <main className={"w-screen h-screen grid grid-flow-col grid-cols-4"}>
      <AppNav account={account} />
      <div className={"h-screen col-span-3 overflow-auto"}>{children}</div>
    </main>
  );
}
