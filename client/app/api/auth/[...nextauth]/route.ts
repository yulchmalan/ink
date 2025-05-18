import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";

interface DiscordProfile {
  id: string;
  email?: string;
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log("OAuth user:", user);

        if (!user.email) {
          if (account?.provider === "discord") {
            const discord = profile as { id: string };
            user.email = `discord_${discord.id}@discord.local`;
          } else {
            console.error("Email is required but missing");
            return false;
          }
        }

        const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            query: `
              mutation Login($input: LoginInput!) {
                loginUser(input: $input) {
                  token
                  user {
                    _id
                    email
                    username
                  }
                }
              }
            `,
            variables: {
              input: {
                email: user.email,
                password: "social-login",
              },
            },
          }),
        });

        const loginJson = await loginRes.json();

        if (loginJson.errors?.[0]?.message === "User not found") {
          const registerRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
            },
            body: JSON.stringify({
              query: `
                mutation Register($input: RegisterInput!) {
                  registerUser(input: $input) {
                    token
                    user {
                      _id
                      email
                      username
                    }
                  }
                }
              `,
              variables: {
                input: {
                  email: user.email,
                  username: user.name || "oauth-user",
                  password: "social-login",
                },
              },
            }),
          });

          const registerJson = await registerRes.json();

          if (registerJson.errors) {
            console.error("Register failed:", registerJson.errors);
            return false;
          }

          user.token = registerJson.data.registerUser.token;
          return true;
        }

        if (loginJson.errors) {
          console.error("Login failed:", loginJson.errors);
          return false;
        }

        user.token = loginJson.data.loginUser.token;
        return true;
      } catch (err) {
        console.error("Unexpected error in signIn:", err);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user?.token) {
        token.accessToken = user.token;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
