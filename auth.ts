import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

import db from "./database/drizzle";
import { users } from "./database/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }

        const { email, password } = credentials;

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email as string))
          .limit(1);

        if (!user || user.length === 0) {
          return null;
        }

        const isPasswordMatch = await bcryptjs.compare(
          password as string,
          user[0].password
        );

        if (!isPasswordMatch) {
          return null;
        }

        return {
          id: user[0].id,
          email: user[0].email,
          role: user[0].role,
          fullName: user[0].fullname,
          profilePicture: user[0].profilePicture,
          emailVerified: null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.email) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          profilePicture: token.profilePicture as string,
          role: token.role as "admin" | "startup_owner" | "user",
          fullName: token.fullName as string,
          // emailVerified: null,
        };
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.role = user.role as "admin" | "startup_owner" | "user";
        token.fullName = user.fullName;
        token.profilePicture = user.profilePicture;
      }

      return token;
    },
  },
});
