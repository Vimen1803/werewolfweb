'use client';
import { signIn } from 'next-auth/react';

export default function SignInButton({ children, className }) {
  return (
    <button className={className} onClick={() => signIn('discord')}>
      {children}
    </button>
  );
}
