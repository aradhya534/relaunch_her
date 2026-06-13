import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'RETURNER' | 'EMPLOYER';
      accessToken: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'RETURNER' | 'EMPLOYER';
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'RETURNER' | 'EMPLOYER';
    accessToken: string;
  }
}
