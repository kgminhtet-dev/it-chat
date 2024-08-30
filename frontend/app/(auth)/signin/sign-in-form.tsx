"use client";

import useAppStore from "@/components/hooks/use-app-store";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signin } from "@/lib/actions/server-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export default function SignInForm() {
  const { toast } = useToast();
  const router = useRouter();
  const setAccount = useAppStore((state) => state.setAccount);
  const setChats = useAppStore((state) => state.setChats);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = await signin(values);
    if (data?.error)
      return toast({
        variant: "destructive",
        title: data.error,
      });
    setAccount(data.account);
    setChats(data.chats);
    router.push(`/${data.account.id}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type={"email"} placeholder="" {...field} />
              </FormControl>
              {/*<FormDescription></FormDescription>*/}
              <div className={"h-3"}>
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
                <Input type={"password"} placeholder="" {...field} />
              </FormControl>
              {/*<FormDescription></FormDescription>*/}
              <div className={"h-3"}>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button className={"w-full"} type="submit">
          Sign In
        </Button>
      </form>
    </Form>
  );
}
