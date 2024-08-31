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
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { EditIcon } from 'lucide-react';
import { useState } from 'react';
import { IAccount } from '@/lib/types/IAccount';

interface PersonalInfo {
  type: 'fullname' | 'email' | 'username';
  account: IAccount;
  fn: Function;
}

export default function PersonalInto({ type, account, fn }: PersonalInfo) {
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState(account[type]);

  return (
    <div
      className={
        'bg-gray-100 flex flex-row p-2 w-full border-b justify-between items-center rounded-md shadow-sm'
      }
    >
      <p>{account[type]}</p>
      <Dialog>
        <DialogTrigger asChild>
          <EditIcon className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change {type}</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&amp;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="info"
              value={userInfo}
              onChange={(e) => setUserInfo(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                const newInfo = userInfo.trim();
                console.log('changed ', newInfo);
                if (type === 'fullname' && account.fullname === newInfo) {
                  toast({
                    variant: 'destructive',
                    title:
                      'Can\'t change because name you changed is matched with current name.',
                  });
                  return;
                }
                if (type === 'email' && account.email === newInfo) {
                  toast({
                    variant: 'destructive',
                    title:
                      'Can\'t change because email you changed is matched with current email.',
                  });
                  return;
                }
                if (type === 'username' && account.username === newInfo) {
                  toast({
                    variant: 'destructive',
                    title:
                      'Can\'t change because username you changed is matched with current username.',
                  });
                  return;
                }
                if (newInfo) {
                  const data = await fn(type, account.id, newInfo);
                  if (!data.error) {
                    toast({
                      title: data.message,
                    });
                  } else {
                    toast({
                      variant: 'destructive',
                      title: data.error,
                    });
                  }
                }
              }}
              type="submit"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
