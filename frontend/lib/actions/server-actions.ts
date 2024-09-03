'use server';

import { IChat } from '@/lib/types/IChat';
import { StatusCodes } from 'http-status-codes';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function startApp() {
  const account_id = await getCookie('account_id');
  const token = await getCookie('access_token');
  if (token && account_id) {
    redirect(`/${account_id.value}`);
  }
  redirect(`/signin`);
}

export async function getCookie(name: string) {
  return cookies().get(name);
}

export async function signin(formdata: any) {
  try {
    const url = process.env.URL;
    const response = await fetch(`${url}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formdata),
    });
    const response_data = await response.json();
    if (response.status === StatusCodes.OK) {
      cookies().set('access_token', response_data.access_token);
      cookies().set('account_id', response_data.account.id);
      return response_data;
    }
    return { error: response_data.message };
  } catch (error) {
    return { error: 'Internal server error' };
  }
}

export async function signup(formdata: any) {
  const url = process.env.URL;
  try {
    const response = await fetch(`${url}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formdata),
    });
    const response_data = await response.json();
    if (response.status === StatusCodes.CREATED) {
      cookies().set('access_token', response_data.access_token);
      cookies().set('account_id', response_data.account.id);
      return response_data;
    }
    return { error: response_data.message };
  } catch (error) {
    redirect(`/error`);
  }
}

export async function signout() {
  cookies().delete('access_token');
  cookies().delete('account_id');
  redirect('/signin');
}

export async function getAccount(accountId: string, chats = true) {
  const token = await getCookie('access_token');
  const url = process.env.URL;
  try {
    let response;
    if (chats) {
      response = await fetch(`${url}/api/accounts/${accountId}?include=chats`, {
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
      });
    } else {
      response = await fetch(`${url}/api/accounts/${accountId}`, {
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
      });
    }
    const data = await response.json();
    if (response.status === StatusCodes.OK) {
      if (data.access_token) {
        cookies().set('access_token', data.access_token);
      }
      return data;
    } else {
      redirect('/signin');
    }
  } catch (error) {
    redirect('/signin');
  }
}

export async function getMessages(accountId: string, chatId: string) {
  const token = await getCookie('access_token');
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

export async function getFriend(accountId: string, friendId: string) {
  const token = await getCookie('access_token');
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/friends/${friendId}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token?.value}`,
      },
    },
  );

  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    return { error: null, friend: data };
  }
  return { error: data.message, friend: null };
}

export async function searchChatByName(chats: IChat[], fullname: string) {
  return chats.filter((chat) =>
    chat.contact.fullname.toLowerCase().includes(fullname),
  );
}

export async function searchUsername(username: string) {
  const token = await getCookie('access_token');
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

export async function updateAccount(
  type: string,
  accountId: string,
  accountInfo: string,
) {
  let requestData;
  const url = process.env.URL;
  switch (type) {
    case 'fullname':
      requestData = JSON.stringify({ fullname: accountInfo });
      break;
    case 'email':
      requestData = JSON.stringify({ email: accountInfo });
      break;
    case 'username':
      requestData = JSON.stringify({ username: accountInfo });
      break;
  }
  const token = await getCookie('access_token');
  const response = await fetch(`${url}/api/accounts/${accountId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token?.value}`,
    },
    body: requestData,
  });

  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    revalidatePath(`${accountId}/profile`);
    return { message: data.message };
  }
  return { error: data.message };
}

export async function deactivateAccount(accountId: string) {
  const token = await getCookie('access_token');
  const url = process.env.URL;
  const response = await fetch(`${url}/api/accounts/${accountId}?action=deactivate`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    redirect('/signin');
  }
  return redirect('/error');
}

export async function changePassword(accountId: string, formdata: any) {
  const token = await getCookie('access_token');
  const url = process.env.URL;
  const response = await fetch(`${url}/api/accounts/${accountId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
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

export default async function alreadyChats(chats: IChat[], username: string) {
  return chats.find((chat) => chat.contact.username === username);
}

export async function getFriends(accountId: string) {
  const token = await getCookie('access_token');
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
  const token = await getCookie('access_token');
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/friend-requests`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  const token = await getCookie('access_token');
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/friend-requests/pendings`,
    {
      headers: {
        Accept: 'application/json',
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
  const token = await getCookie('access_token');
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/friend-requests`,
    {
      headers: {
        Accept: 'application/json',
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
  const token = await getCookie('access_token');
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/friend-requests/${friendRequestId}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify({
        requestName: 'cancel friend request',
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
  const token = await getCookie('access_token');
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/friend-requests/${friendRequestId}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify({
        requestName: 'reject friend request',
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
  const token = await getCookie('access_token');
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/friend-requests/${friendRequestId}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify({
        requestName: 'confirm friend request',
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
  const token = await getCookie('access_token');
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/friends/${friendId}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token?.value}`,
      },
    },
  );

  if (response.status === StatusCodes.OK) {
    redirect(`/${accountId}/friends`);
  }
}

export async function getChat(accountId: string, chatId: string) {
  const token = await getCookie('access_token');
  const url = process.env.URL;
  const response = await fetch(
    `${url}/api/accounts/${accountId}/chats/${chatId}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
