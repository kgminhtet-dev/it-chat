import SignUpForm from '@/app/(auth)/signup/signup-form';

export default function SignupPage() {
  return (
    <main className="flex h-screen items-center justify-center bg-muted">
      <div
        className={'flex flex-col justify-between gap-10 border w-1/3 p-3 pr-7 pl-7 shadow rounded-md'}>
        <p className={'text-3xl text-center font-bold'}>Create an Account</p>
        <SignUpForm />
      </div>
    </main>
  );
}
