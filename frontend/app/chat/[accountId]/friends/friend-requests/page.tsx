import ReceivedFriendRequest from "@/components/app-ui/received-friend-request";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFriendRequests } from "@/lib/actions";
import { IFriendRequest } from "@/lib/types/IFriendRequest";

export default async function FriendRequests({
  params,
}: {
  params: { accountId: string };
}) {
  const friendRequests: IFriendRequest[] = await getFriendRequests(
    params.accountId,
  );

  return (
    <div className={"w-full h-full pl-2 pr-2 overflow-auto"}>
      {friendRequests.length > 0 ? (
        <ScrollArea className="flex flex-col gap-1">
          {friendRequests.map((friendRequest, index) => (
            <ReceivedFriendRequest key={index} friendRequest={friendRequest} />
          ))}
        </ScrollArea>
      ) : (
        <div className={"h-full flex justify-center items-center"}>
          <p className="shadow bg-gray-300 text-gray-500 rounded-full p-1 pr-5 pl-5 text-sm">
            There&apos;s no friend requests yet.
          </p>
        </div>
      )}
    </div>
  );
}
