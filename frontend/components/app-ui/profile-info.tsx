import PersonalInto from '@/components/app-ui/personal-info';
import { updateAccount } from '@/lib/actions/server-actions';
import { IAccount } from '@/lib/types/IAccount';

interface Props {
  account: IAccount;
}

export default function ProfileInfo({ account }: Props) {
  return (
    <div className="row-span-8 flex gap-1 flex-col p-1">
      <h4 className="font-medium tracking-tight border-b-2">Fullname</h4>
      <PersonalInto
        type={'fullname'}
        account={account}
        fn={updateAccount}
      />
      <h4 className="font-medium tracking-tight border-b-2">Email</h4>
      <PersonalInto
        type={'email'}
        account={account}
        fn={updateAccount}
      />
      <h4 className="font-medium tracking-tight border-b-2">Username</h4>
      <PersonalInto
        type={'username'}
        account={account}
        fn={updateAccount}
      />
    </div>
  );
}
