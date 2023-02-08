import NextAuth from "next-auth";
import { MoralisNextAuthProvider } from "@moralisweb3/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/services/UserService";

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "username-login", // <- add this line

      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials;

        return login(username, password)
          .then((res) => {
            const {user} = res;

            if (user) {
              user.access_token = res.access_token;
              return user;
            }

            throw new Error("Login failed, unable to get user object.");
          })
          .catch((err) => {
            throw err;
          });
      },
    }),
    MoralisNextAuthProvider(),
  ],
  // adding user info to the user session object
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
