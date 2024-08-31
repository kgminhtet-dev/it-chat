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
import { deactivateAccount } from '@/lib/actions/server-actions';
import { IAccount } from '@/lib/types/IAccount';

interface Props {
  account: IAccount;
}

export default function DeactivateButton({ account }: Props): JSX.Element {
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
              await deactivateAccount(account.id);
            }}>Yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}