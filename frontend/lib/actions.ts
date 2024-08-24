"use server";

import { IChat } from "@/lib/types/IChat";
import { StatusCodes } from "http-status-codes";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAccount(accountId: string) {
  const token = await getCookie("access_token");
  const url = process.env.URL;
  const response = await fetch(`${url}/api/accounts/${accountId}`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    if (data.access_token) {
      cookies().set("access_token", data.access_token);
    }
    return data;
  }
  return { error: data.message };
}

export async function getProfile() {
  const token = await getCookie("access_token");
  const url = process.env.URL;
  const response = await fetch(`${url}/api/accounts?kind=profile`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    if (data.access_token) {
      cookies().set("access_token", data.access_token);
    }
    return {
      profile: data.profile,
      chats: data.chats,
    };
  }
  return { error: data.message };
}

export async function startApp() {
  const token = await getCookie("access_token");
  if (token) {
    redirect("/chat");
  }
  redirect(`/signin`);
}

export async function getCookie(name: string) {
  return cookies().get(name);
}

export async function signin(formdata: any) {
  const url = process.env.URL;
  const response = await fetch(`${url}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formdata),
  });
  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    cookies().set("access_token", data.access_token);
    return {
      profile: data.profile,
      chats: data.chats,
    };
  }
  return { error: data.message };
}

export async function signup(formdata: any) {
  const url = process.env.URL;
  const response = await fetch(`${url}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formdata),
  });
  const data = await response.json();
  if (response.status === StatusCodes.CREATED) {
    cookies().set("access_token", data.access_token);
    return {
      profile: data.profile,
      chats: data.chats,
    };
  }
  return { error: data.message };
}

export async function getMessages(accountId: string, chatId: string) {
  const token = await getCookie("access_token");
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/chats/${chatId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    },
  );
  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    return data;
  }
  return { error: data.message };
}

export async function searchChatByName(chats: IChat[], fullname: string) {
  return chats.filter((chat) =>
    chat.contact.fullname.toLowerCase().includes(fullname),
  );
}

export async function searchUsername(username: string) {
  const token = await getCookie("access_token");
  const url = process.env.URL;
  const response = await fetch(`${url}/api/accounts?username=${username}`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    return data;
  }
  return { error: data.message };
}

export async function searchChatFormHistory(chats: IChat[], chatId: string) {
  if (chats.length > 0) {
    return chats.filter((chat) => chat.id === chatId)[0];
  }
  return null;
}

export async function updateAccount(
  type: string,
  accountId: string,
  accountInfo: string,
) {
  let requestData;
  const url = process.env.URL;
  switch (type) {
    case "Fullname":
      requestData = JSON.stringify({ fullname: accountInfo });
      break;
    case "Email":
      requestData = JSON.stringify({ email: accountInfo });
      break;
    case "Username":
      requestData = JSON.stringify({ username: accountInfo });
      break;
  }
  const token = await getCookie("access_token");
  const response = await fetch(`${url}/api/accounts/${accountId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token?.value}`,
    },
    body: requestData,
  });

  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    return { message: data.message };
  }
  return { error: data.message };
}

export async function deactivateAccount(accountId: string) {
  const token = await getCookie("access_token");
  const url = process.env.URL;
  const response = await fetch(`${url}/api/accounts/${accountId}/actions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token?.value}`,
    },
    body: JSON.stringify({
      action: "deactivate",
    }),
  });
  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    return { message: data.message };
  }
  return { error: data.message };
}

export async function signout() {
  cookies().delete("access_token");
  redirect("/signin");
}

export async function changePassword(accountId: string, formdata: any) {
  const token = await getCookie("access_token");
  const url = process.env.URL;
  const response = await fetch(`${url}/api/accounts/${accountId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token?.value}`,
    },
    body: JSON.stringify(formdata),
  });

  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    return { message: data.message };
  }
  return { error: data.message };
}

export async function alreadyChats(chats: IChat[], username: string) {
  return chats.filter((chat) =>
    chat.contact.username.toLowerCase().includes(username),
  )[0];
}

export async function getFriends(accountId: string) {
  const token = await getCookie("access_token");
  const url = process.env.URL;
  const response = await fetch(`${url}/api/accounts/${accountId}/friends`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    return data;
  }
  return { error: data.message };
}

export async function sendFriendRequest(accountId: string, friendName: string) {
  const token = await getCookie("access_token");
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/friend-requests`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify({
        friendName,
      }),
    },
  );

  const data = await response.json();
  if (response.status === StatusCodes.CREATED) {
    revalidatePath(`/chat/${accountId}/friends/pendings`);
    return { message: data.message };
  }
  return { error: data.message };
}

export async function getFriendRequestPending(accountId: string) {
  const token = await getCookie("access_token");
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/friend-requests/pendings`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    },
  );

  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    return data;
  }
  return { error: data.message };
}

export async function getFriendRequests(accountId: string) {
  const token = await getCookie("access_token");
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/friend-requests`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    },
  );

  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    return data;
  }
  return { error: data.message };
}

export async function cancelFriendRequest(
  accountId: string,
  friendRequestId: string,
) {
  const token = await getCookie("access_token");
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/friend-requests/${friendRequestId}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify({
        requestName: "cancel friend request",
      }),
    },
  );

  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    revalidatePath(`/chat/${accountId}/friends/pendings`);
    return data;
  }
  return { error: data.message };
}

export async function rejectFriendRequest(
  accountId: string,
  friendRequestId: string,
) {
  const token = await getCookie("access_token");
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/friend-requests/${friendRequestId}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify({
        requestName: "reject friend request",
      }),
    },
  );

  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    revalidatePath(`/chat/${accountId}/friend-requests`);
    return data;
  }
  return { error: data.message };
}

export async function confirmFriendRequest(
  accountId: string,
  friendRequestId: string,
) {
  const token = await getCookie("access_token");
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/friend-requests/${friendRequestId}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify({
        requestName: "confirm friend request",
      }),
    },
  );

  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    revalidatePath(`/chat/${accountId}/friends`);
    return data;
  }
  return { error: data.message };
}

export async function unFriend(accountId: string, friendId: string) {
  const token = await getCookie("access_token");
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/friends/${friendId}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    },
  );

  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    revalidatePath(`/chat/${accountId}/friends`);
    return data;
  }
  return { error: data.message };
}
