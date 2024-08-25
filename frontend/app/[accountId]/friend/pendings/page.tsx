import SendFriendRequest from "@/components/app-ui/sent-friend-request";
import { getFriendRequestPending } from "@/lib/actions";
import { IFriendRequest } from "@/lib/types/IFriendRequest";

export default async function PendingPage({
  params,
}: {
  params: { accountId: string };
}) {
  const pendings: IFriendRequest[] = await getFriendRequestPending(
    params.accountId,
  );

  return (
    <div className={"grid-rows-11 col-span-3 flex flex-col gap-1 pl-2 pr-2"}>
      {pendings.length > 0 &&
        pendings.map((friendRequest, index) => (
          <SendFriendRequest key={index} friendRequest={friendRequest} />
        ))}
    </div>
  );
}
