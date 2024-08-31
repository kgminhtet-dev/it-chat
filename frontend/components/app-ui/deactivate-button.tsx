'use client';

import { IAccount } from '@/lib/types/IAccount';
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
import { deactivateAccount } from '@/lib/actions/server-actions';
import useAppStore from '@/components/hooks/use-app-store';

interface Props {
  account: IAccount;
}

export default function DeactivateButton({ account }: Props): JSX.Element {
  const setAccount = useAppStore((state) => state.setAccount);
  const setChats = useAppStore((state) => state.setChats);
  const setMessages = useAppStore((state) => state.setMessages);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Deactivate</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Deactivating your account means you can recover it at any time after taking this action
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90'}
            onClick={async () => {
              setAccount(undefined);
              setMessages([]);
              setChats([]);
              await deactivateAccount(account.id);
            }}
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}