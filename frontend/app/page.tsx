import { Button } from "@/components/ui/button";
import { startApp } from "@/lib/actions";

export default async function App() {
  await startApp();
  return (
    <main className={"h-screen w-full flex items-center justify-center"}>
      <Button variant={"outline"}>
        Welcome to ITChat: Real Time Messaging Application
      </Button>
    </main>
  );
}
