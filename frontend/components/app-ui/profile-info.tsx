import { IProfile } from "@/lib/types/IProfile";
import PersonalInto from "@/components/app-ui/personal-info";
import PasswordButton from "@/components/app-ui/password-button";
import DeactivateButton from "@/components/app-ui/deactivate-button";
import { Separator } from "@/components/ui/separator";

interface Props {
  profile: IProfile;
}

export default function ProfileInfo({ profile }: Props) {
  return (
    <div className="flex-1 flex flex-col gap-2">
      <PersonalInto type={"Fullname"} info={profile.fullname} />
      <PersonalInto type={"Email"} info={profile.email} />
      <PersonalInto type={"Username"} info={profile.username} />
      <Separator />
      <div className={"flex flex-1 flex-col justify-start gap-1"}>
        <PasswordButton />
        <Separator />
        <DeactivateButton />
      </div>
    </div>
  );
}
