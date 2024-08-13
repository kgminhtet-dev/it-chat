"use client";

import useAppStore from '@/components/hooks/use-app-store';
import NotProfile from '@/components/app-ui/not-profile';
import ProfileInfo from '@/components/app-ui/profile-info';
import CoverPhoto from '@/components/app-ui/cover-photo';
import SignOutButton from '@/components/app-ui/signout-button';

export default function ProfilePage() {
  const profile = useAppStore((state) => state.profile);

  if(!profile) {
    return <NotProfile />
  }

  return (
    <main className={"grid-rows-12 col-span-3 flex flex-col"}>
      <SignOutButton />
      <CoverPhoto />
      <ProfileInfo profile={profile}/>
    </main>
  )
}