'use client';

import { IProfile } from '@/lib/types/IProfile';
import useAppStore from '@/components/hooks/use-app-store';

interface Props {
  profile: IProfile;
}

export default function SetAccount({ profile }: Props) {
  const setProfile = useAppStore((state) => state.setProfile);
  setProfile(profile);
  return <div className={'absolute hidden'} />;
}
