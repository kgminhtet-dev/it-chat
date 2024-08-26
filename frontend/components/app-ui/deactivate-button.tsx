'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { deactivateAccount } from '@/lib/actions';
import useAppStore from '@/components/hooks/use-app-store';
import { IProfile } from '@/lib/types/IProfile';
import { emitDeactivate } from '@/lib/web-socket-actions';
import { Socket } from 'socket.io-client';

interface Props {
  account: IProfile;
}

export default function DeactivateButton({ account }: Props) {
  const router = useRouter();
  const socket = useAppStore((state) => state.socket) as Socket;

  return (
    <div className={'row-span-1 flex justify-between items-center p-1 shadow-sm'}>
      <p>Deactivating your account means you can recover it at any time after taking this action.</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className={'w-max'}>Deactivate</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deactivate Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={'outline'} type="submit">No</Button>
            <Button type="submit" onClick={async () => {
              emitDeactivate(socket);
              await deactivateAccount(account.id);
              router.push('/signin');
            }}>Yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}