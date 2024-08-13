"use client";

import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={"w-screen h-screen"}>
      {children}
      <Toaster />
    </main>
  );
}
