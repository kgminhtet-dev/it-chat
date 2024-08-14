import { IProfile } from '@/lib/types/IProfile';
import PersonalInto from '@/components/app-ui/personal-info';
import PasswordButton from '@/components/app-ui/password-button';
import DeactivateButton from '@/components/app-ui/deactivate-button';
import { Separator } from '@/components/ui/separator';
import { updateAccount } from '@/lib/actions';

interface Props {
  profile: IProfile;
}

export default function ProfileInfo({ profile }: Props) {
  return (
    <div className="flex-1 flex flex-col gap-2">
      <PersonalInto type={'Fullname'} info={profile.fullname} fn={updateAccount} />
      <PersonalInto type={'Email'} info={profile.email} fn={updateAccount} />
      <PersonalInto type={'Username'} info={profile.username} fn={updateAccount} />
      <Separator />
      <div className={'flex flex-1 flex-col justify-start gap-1 p-1'}>
        <PasswordButton />
        <Separator />
        <DeactivateButton />
      </div>
    </div>
  );
}
