import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Define authOptions with an explicit type for clarity
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      httpOptions: {
        timeout: 10000,
      },
    }),
  ],
  // Explicitly set the session strategy to JWT
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // After sign in, `user` is available. Add the email to the token.
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the email from the token to the session object
      if (session.user) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }