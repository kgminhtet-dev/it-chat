'use server';

import { IChat } from '@/lib/types/IChat';
import { StatusCodes } from 'http-status-codes';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getProfile() {
  const token = await getCookie('access_token');
  const response = await fetch(`http://localhost:8080/api/accounts?kind=profile`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    if (data.access_token) {
      cookies().set('access_token', data.access_token);
    }
    return {
      profile: data.profile,
      chats: data.chats,
    };
  }
  return { error: data.message };
}

export async function startApp() {
  const token = await getCookie('access_token');
  if (token) {
    redirect('/chat');
  }
  redirect(`/signin`);
}

export async function getCookie(name: string) {
  return cookies().get(name);
}

export async function signin(formdata: any) {
  const response = await fetch('http://localhost:8080/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formdata),
  });
  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    cookies().set('access_token', data.access_token);
    return {
      profile: data.profile,
      chats: data.chats,
    };
  }
  return { error: data.message };
}

export async function signup(formdata: any) {
  const response = await fetch('http://localhost:8080/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formdata),
  });
  const data = await response.json();
  if (response.status === StatusCodes.CREATED) {
    cookies().set('access_token', data.access_token);
    return {
      profile: data.profile,
      chats: data.chats,
    };
  }
  return { error: data.message };
}

export async function getMessages(accountId: string, chatId: string) {
  const token = await getCookie('access_token');
  const response = await fetch(
    `http://localhost:8080/api/accounts/${accountId}/chats/${chatId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    },
  );
  const data = await response.json();
  console.log('messages ', data);
  if (response.status === StatusCodes.OK) {
    return data;
  }
  return { error: data.message };
}

export async function searchChatByName(chats: IChat[], fullname: string) {
  return chats.filter(chat => chat.contact.fullname.toLowerCase().includes(fullname));
}

export async function searchUsername(username: string) {
  const token = await getCookie('access_token');
  const response = await fetch(
    `http://localhost:8080/api/accounts?username=${username}`,
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

export async function searchChatFormHistory(chats: IChat[], chatId: string) {
  if (chats.length > 0) {
    return chats.filter((chat) => chat.id === chatId)[0];
  }
  return null;
}

export async function updateAccount(type: string, accountId: string, accountInfo: string) {
  let requestData;

  switch (type) {
    case 'Fullname':
      requestData = JSON.stringify({ fullname: accountInfo });
      break;
    case 'Email':
      requestData = JSON.stringify({ email: accountInfo });
      break;
    case 'Username':
      requestData = JSON.stringify({ username: accountInfo });
      break;
  }
  const token = await getCookie('access_token');
  const response = await fetch(`http://localhost:8080/api/accounts/${accountId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
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
  const token = await getCookie('access_token');
  const response = await fetch(`http://localhost:8080/api/accounts/${accountId}/actions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token?.value}`,
    },
    body: JSON.stringify({
      action: 'deactivate',
    }),
  });
  const data = await response.json();
  if (response.status === StatusCodes.OK) {
    return { message: data.message };
  }
  return { error: data.message };
}

export async function signout() {
  return cookies().delete('access_token');
}

export async function changePassword(accountId: string, formdata: any) {
  console.log('passwords', formdata);
  const token = await getCookie('access_token');
  const response = await fetch(`http://localhost:8080/api/accounts/${accountId}`, {
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