'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { signout } from '@/lib/actions/server-actions';
import useAppStore from '@/components/hooks/use-app-store';

export default function SignoutButton() {
  const setAccount = useAppStore((state) => state.setAccount);
  const setChats = useAppStore((state) => state.setChats);
  const setMessages = useAppStore((state) => state.setMessages);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="w-max text-red-600 hover:bg-red-500 hover:text-white"
        >
          Log Out
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure to logout?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
            onClick={async () => {
              setAccount(undefined);
              setMessages([]);
              setChats([]);
              await signout();
            }}
          >
            Log Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
