import SignInForm from '@/app/(auth)/signin/sign-in-form';
import Link from 'next/link';

export default function SigninPage() {
  return (
    <main className="flex h-screen items-center justify-center bg-muted">
      <div
        className={'flex flex-col justify-between gap-1 border w-1/3 p-3 pr-7 pl-7 shadow rounded-md'}>
        <div className={'flex flex-col gap-7'}>
          <p className={'text-3xl text-center font-bold'}>Sign In</p>
          <SignInForm />
        </div>
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
    </main>
  );
}
