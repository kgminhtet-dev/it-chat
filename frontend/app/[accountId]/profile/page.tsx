import ProfileInfo from '@/components/app-ui/profile-info';
import CoverPhoto from '@/components/app-ui/cover-photo';
import SignOutButton from '@/components/app-ui/signout-button';
import { getAccount } from '@/lib/actions';
import { Separator } from '@/components/ui/separator';
import PasswordButton from '@/components/app-ui/password-button';
import DeactivateButton from '@/components/app-ui/deactivate-button';

export default async function ProfilePage(
  { params }: { params: { accountId: string } },
) {
  const account = await getAccount(params.accountId);

  return (
    <main className={'grid-rows-12 col-span-3 grid'}>
      <CoverPhoto />
      <ProfileInfo account={account} />
      <div className={'flex justify-start items-center gap-1'}>
        <PasswordButton />
        <SignOutButton />
      </div>
      <Separator />
      <DeactivateButton />
    </main>
  );
}