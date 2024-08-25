'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signup } from '@/lib/actions';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  fullname: z.string().min(4, 'Fullname must at least 4 characters long.'),
  username: z.string().min(4, 'Username must at least 4 characters long.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  reTypePassword: z.string().min(8, 'Password must be at least 8 characters long.'),
});

export default function SignUpForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: '',
      username: '',
      email: '',
      password: '',
      reTypePassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.password !== values.reTypePassword) {
      form.setError('reTypePassword', { type: 'manual', message: 'Password does not match.' });
      return;
    }
    const data = await signup(values);
    if (data?.message)
      toast({
        variant: 'destructive',
        title: data.message,
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fullname</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              {/*<FormDescription></FormDescription>*/}
              <div className={'h-3'}>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              {/*<FormDescription></FormDescription>*/}
              <div className={'h-3'}>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type={'email'} placeholder="" {...field} />
              </FormControl>
              {/*<FormDescription></FormDescription>*/}
              <div className={'h-3'}>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type={'password'} placeholder="" {...field} />
              </FormControl>
              {/*<FormDescription></FormDescription>*/}
              <div className={'h-3'}>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reTypePassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Re-type Password</FormLabel>
              <FormControl>
                <Input type={'password'} placeholder="" {...field} />
              </FormControl>
              {/*<FormDescription></FormDescription>*/}
              <div className={'h-3'}>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button className={'w-full'} type="submit">Sign Up</Button>
      </form>
    </Form>
  );
}
