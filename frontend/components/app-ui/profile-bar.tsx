import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { shortName } from "@/lib/utils";
import { IProfile } from "@/lib/types/IProfile";

interface Props {
  profile: IProfile;
}

export default function ProfileBar({ profile }: Props) {
  return (
    <div className={"row-span-1 p-1 pr-2 pl-"}>
      <div className="flex justify-center h-full items-center rounded-md gap-4 bg-primary text-primary-foreground cursor-pointer transition-colors">
        <Avatar className="h-8 w-8 text-foreground">
          <AvatarImage src="" />
          <AvatarFallback>{shortName(profile.fullname)}</AvatarFallback>
        </Avatar>
        <div className="flex items-center justify-between">
          <div className="font-medium">{profile.fullname}</div>
        </div>
      </div>
    </div>
  );
}
