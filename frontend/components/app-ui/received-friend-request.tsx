"use client";

import useAppStore from "@/components/hooks/use-app-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { confirmFriendRequest, rejectFriendRequest } from "@/lib/actions";
import { IFriendRequest } from "@/lib/types/IFriendRequest";
import { IProfile } from "@/lib/types/IProfile";
import { shortName } from "@/lib/utils";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

interface Props {
  setFriendRequests: Function;
  friendRequest: IFriendRequest;
}

export default function ReceivedFriendRequest({
  setFriendRequests,
  friendRequest,
}: Props): JSX.Element {
  const { toast } = useToast();
  const profile = useAppStore((state) => state.profile) as IProfile;

  return (
    <div
      className={"flex bg-gray-200 rounded justify-between items-center p-2"}
    >
      <div className={"flex gap-1 items-center"}>
        <Avatar className="h-10 w-10 text-blue-500">
          <AvatarImage src="" />
          <AvatarFallback>
            {shortName(friendRequest.sender.fullname)}
          </AvatarFallback>
        </Avatar>
        <p>{friendRequest.sender.fullname}</p>
      </div>
      <div className={"flex gap-1"}>
        <Button
          size={"icon"}
          variant={"outline"}
          className={"rounded-full p-2"}
          onClick={async () => {
            const data = await rejectFriendRequest(
              profile.id,
              friendRequest.id,
            );
            if (data.error)
              toast({
                variant: "destructive",
                title: data.error,
              });
            else {
              setFriendRequests((reqs: IFriendRequest[]) =>
                reqs.filter((req) => req.id !== friendRequest.id),
              );
              toast({
                variant: "default",
                title: data.message,
              });
            }
          }}
        >
          <Cross2Icon className={"w-full h-full text-red-600"} />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          className={"rounded-full p-2"}
          onClick={async () => {
            const data = await confirmFriendRequest(
              profile.id,
              friendRequest.id,
            );
            if (data.error)
              toast({
                variant: "destructive",
                title: data.error,
              });
            else {
              setFriendRequests((reqs: IFriendRequest[]) =>
                reqs.filter((req) => req.id !== friendRequest.id),
              );
              toast({
                variant: "default",
                title: data.message,
              });
            }
          }}
        >
          <CheckIcon className={"w-full h-full text-green-600"} />
        </Button>
      </div>
    </div>
  );
}
