'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { signup } from '@/lib/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import useAppStore from '@/components/hooks/use-app-store';
import { useState } from 'react';

const signupSchema = z.object({
  fullname: z.string().min(1, 'Fullname is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export default function Signup() {
  const router = useRouter();
  const { toast } = useToast();
  const setProfile = useAppStore((state) => state.setProfile);
  const setChats = useAppStore((state) => state.setChats);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (formdata: any) => {
    const data = await signup(formdata);
    if (!data.error && data.profile) {
      setProfile(data.profile);
      setChats(data.chats);
      router.push('/chat');
    } else {
      toast({
        variant: 'destructive',
        title: data.error,
      });
    }
  };

  return (
    <main className="flex h-screen items-center justify-center bg-muted">
      <Card className="mx-auto w-1/3 space-y-6">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">
            Create an Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Fullname</Label>
              <Input
                id="fullname"
                placeholder="John Doe"
                {...register('fullname')}
              />
              <div className="h-2">
                {errors.fullname && (
                  <p className="text-red-600">
                    {errors.fullname.message?.toString()}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="johndoe"
                {...register('username')}
              />
              <div className="h-2">
                {errors.username && (
                  <p className="text-red-600">
                    {errors.username.message?.toString()}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
              />
              <div className="h-2">
                {errors.email && (
                  <p className="text-red-600">
                    {errors.email.message?.toString()}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} />
              <div className="h-2">
                {errors.password && (
                  <p className="text-red-600">
                    {errors.password.message?.toString()}
                  </p>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
