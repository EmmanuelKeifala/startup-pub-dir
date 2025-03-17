// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "admin" | "startup_owner" | "user";
      profilePicture: string | null;
      fullName: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "admin" | "startup_owner" | "user";
    profilePicture: string | null;
    fullName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "admin" | "startup_owner" | "user";
    profilePicture: string | null;
    fullName: string;
  }
}
