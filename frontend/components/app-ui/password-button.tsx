'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function PasswordButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" className={'w-max bg-green-500 hover:bg-green-600 self-end'}>Change Password</Button>
      </SheetTrigger>
      <SheetContent side={'top'}>
        <SheetHeader>
          <SheetTitle>Change Password</SheetTitle>
          <SheetDescription>
            Make changes to your password here. Click save when you&amp;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currentPassword" className="text-right">
              Current Password
            </Label>
            <Input id="currentPassword" type={'password'} className="col-span-3 border-gray-500" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className="text-right">
              New Password
            </Label>
            <Input id="newPassword" type={'password'} className="col-span-3 border-gray-500" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reNewPassword" className="text-right">
              Re-type new Password
            </Label>
            <Input id="reNewPassword" type={'password'} className="col-span-3 border-gray-500" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
