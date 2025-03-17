import NextAuth, { DefaultSession, DefaultUser, AdapterUser } from "next-auth";

declare module "next-auth" {
  interface User extends AdapterUser {
    id: string;
    email: string;
    role: "admin" | "startup_owner" | "user";
    fullName: string;
    profilePicture: string | null;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      role: "admin" | "startup_owner" | "user";
      profilePicture: string | null;
      fullName: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: "admin" | "startup_owner" | "user";
    profilePicture: string | null;
    fullName: string;
  }
}
