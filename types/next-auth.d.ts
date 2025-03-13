import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role: "admin" | "startup_owner" | "user";
    fullName: string;
    profilePicture: string | null;
  }

  interface Session {
    user: DefaultSession["user"] & {
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
