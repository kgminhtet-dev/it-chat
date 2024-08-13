'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { signin } from '@/lib/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import useAppStore from '@/components/hooks/use-app-store';

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

export default function Signin() {
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
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (formdata: any) => {
    const data = await signin(formdata);
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
      <Card className="w-full max-w-md">
        <CardHeader className={'text-center'}>
          <CardTitle className="text-2xl">Sign in to Chat</CardTitle>
          <CardDescription>
            Enter your email and password to access your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register('email')}
              />
              <div className="h-2">
                {errors.email && (
                  <p className="h-max text-red-600">
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
                {errorMessage && (
                  <p className="h-max text-red-600">{errorMessage}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <div className={'w-full flex justify-between'}>
              <Link
                href="#"
                className="text-sm font-medium underline underline-offset-4 hover:text-primary"
                prefetch={false}
              >
                Forgot password?
              </Link>
              <div className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="underline underline-offset-4"
                  prefetch={false}
                >
                  Sign up
                </Link>
              </div>
            </div>
          </CardFooter>
          {/* <CardFooter className="flex items-center justify-between">
            <Link
              href="#"
              className="text-sm font-medium underline underline-offset-4 hover:text-primary"
              prefetch={false}
            >
              Forgot password?
            </Link>
            <Button type="submit">Sign in</Button>
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="#"
                className="underline underline-offset-4"
                prefetch={false}
              >
                Sign up
              </Link>
            </div>
          </CardFooter> */}
        </form>
      </Card>
    </main>
  );
}
