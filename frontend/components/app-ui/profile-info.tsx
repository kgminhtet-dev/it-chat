import PersonalInto from '@/components/app-ui/personal-info';
import { updateAccount } from '@/lib/actions';
import { IProfile } from '@/lib/types/IProfile';

interface Props {
  account: IProfile;
}

export default function ProfileInfo({ account }: Props) {
  return (
    <div className="row-span-5">
      <PersonalInto
        type={'Fullname'}
        info={account.fullname}
        fn={updateAccount}
      />
      <PersonalInto
        type={'Email'}
        info={account.email}
        fn={updateAccount}
      />
      <PersonalInto
        type={'Username'}
        info={account.username}
        fn={updateAccount}
      />
    </div>
  );
}
