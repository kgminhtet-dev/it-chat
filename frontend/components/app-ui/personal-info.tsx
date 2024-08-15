'use cilent';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import useAppStore from '@/components/hooks/use-app-store';
import { useToast } from '@/components/ui/use-toast';

interface PersonalInfo {
  type: 'Fullname' | 'Email' | 'Username';
  info: string;
  fn?: any;
}

export default function PersonalInto({ type, info, fn }: PersonalInfo) {
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState(info);
  const profile = useAppStore((state) => state.profile);
  const setProfile = useAppStore((state) => state.setProfile);

  return (
    <div className={'relative h-max flex flex-col p-1'}>
      <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
        {type}
      </h4>
      <div className={'w-full border-b flex justify-between p-1 rounded-md shadow-sm'}>
        <p className="leading-7 [&:not(:first-child)]:mt-6">{info}</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Edit</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change {type}</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&amp;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="info" className="text-right">
                  {type}
                </Label>
                <Input
                  id="info"
                  value={userInfo}
                  onChange={(e) => setUserInfo(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={async () => {
                  const newInfo = userInfo.trim();
                  if (type === 'Fullname' && profile?.fullname === newInfo) {
                    toast({
                      variant: 'destructive',
                      title: 'Can\'t change because name you changed is matched with current name.',
                    });
                    return;
                  }
                  if (type === 'Email' && profile?.email === newInfo) {
                    toast({
                      variant: 'destructive',
                      title: 'Can\'t change because email you changed is matched with current email.',
                    });
                    return;
                  }
                  if (type === 'Username' && profile?.username === newInfo) {
                    toast({
                      variant: 'destructive',
                      title: 'Can\'t change because username you changed is matched with current username.',
                    });
                    return;
                  }
                  if (profile && newInfo) {
                    const data = await fn(type, profile.id, newInfo);
                    if (!data.error) {
                      toast({
                        title: data.message,
                      });
                      switch (type) {
                        case 'Fullname':
                          setProfile({ ...profile, fullname: newInfo });
                          break;
                        case 'Email':
                          setProfile({ ...profile, email: newInfo });
                          break;
                        case 'Username':
                          setProfile({ ...profile, username: newInfo });
                          break;
                      }
                    } else {
                      toast({
                        variant: 'destructive',
                        title: data.error,
                      });
                    }
                  }
                }}
                type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}