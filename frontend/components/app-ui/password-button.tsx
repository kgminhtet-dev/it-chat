'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import { changePassword } from '@/lib/actions/server-actions';
import { IProfile } from '@/lib/types/IProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  reNewPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

interface Props {
  account: IProfile;
}

export default function PasswordButton({ account }: Props) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (formdata: any) => {
    if (formdata.newPassword !== formdata.reNewPassword) {
      toast({
        variant: 'destructive',
        title: 'New password and re-type new password are not match.',
      });
      return;
    }
    const data = await changePassword(account.id, formdata);
    reset({
      currentPassword: '',
      newPassword: '',
      reNewPassword: '',
    });
    if (data.error) {
      toast({
        variant: 'destructive',
        title: data.error,
      });
      return;
    }
    toast({
      variant: 'default',
      title: data.message,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className={'w-max bg-green-600 hover:bg-white hover:text-green-500'}
        >
          Change Password
        </Button>
      </SheetTrigger>
      <SheetContent side={'top'}>
        <SheetHeader>
          <SheetTitle>Change Password</SheetTitle>
          <SheetDescription>
            Make changes to your password here. Click save when you&amp;re done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="currentPassword" className="text-right">
                Current Password
              </Label>
              <div className={'col-span-3'}>
                <Input
                  id="currentPassword"
                  type={'password'}
                  className="border-gray-500"
                  {...register('currentPassword')}
                />
                <div className="h-4">
                  {errors.currentPassword && (
                    <p className="text-red-600">
                      {errors.currentPassword.message?.toString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="newPassword" className="text-right">
                New Password
              </Label>
              <div className={'col-span-3'}>
                <Input
                  id="newPassword"
                  type={'password'}
                  className="border-gray-500"
                  {...register('newPassword')}
                />
                <div className="h-4">
                  {errors.newPassword && (
                    <p className="text-red-600">
                      {errors.newPassword.message?.toString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="reNewPassword" className="text-right">
                Re-type new Password
              </Label>
              <div className={'col-span-3'}>
                <Input
                  id="reNewPassword"
                  type={'password'}
                  className="border-gray-500"
                  {...register('reNewPassword')}
                />
                <div className="h-2">
                  {errors.reNewPassword && (
                    <p className="text-red-600">
                      {errors.reNewPassword.message?.toString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
