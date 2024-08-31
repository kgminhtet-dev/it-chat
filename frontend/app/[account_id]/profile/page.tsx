import CoverPhoto from '@/components/app-ui/cover-photo';
import DeactivateButton from '@/components/app-ui/deactivate-button';
import PasswordButton from '@/components/app-ui/password-button';
import ProfileInfo from '@/components/app-ui/profile-info';
import SignoutButton from '@/components/app-ui/signout-button';
import { getAccount } from '@/lib/actions/server-actions';

export default async function ProfilePage({
                                            params,
                                          }: {
  params: { accountId: string };
}) {
  const { account } = await getAccount(params.accountId);

  return (
    <main className={'h-full grid grid-rows-12'}>
      <CoverPhoto />
      <ProfileInfo account={account} />
      <div className={'row-span-1 flex justify-start items-center gap-1'}>
        <PasswordButton account={account} />
        <SignoutButton />
        <DeactivateButton account={account} />
      </div>
    </main>
  );
}
