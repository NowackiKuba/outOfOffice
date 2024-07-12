'use server';

import axios from 'axios';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export const logIn = async (email: string, password: string) => {
  const res = await axios('http://localhost:8080/sign-in', {
    method: 'POST',
    data: {
      email,
      password,
    },
  });

  if (res.data.token) {
    cookies().set('token', res.data.token, {
      secure: true,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return res.data.message;
};

export const getTokenValues = async () => {
  const token = cookies().get('token');

  const secretKey = 'supersecert';

  const decoded = jwt.verify(token?.value!, secretKey);

  // @ts-ignore
  const { userId, role, email } = decoded;

  return { userId, role, email };
};
