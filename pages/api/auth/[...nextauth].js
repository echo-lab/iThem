import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId:
        "1005122392716-o0pnlo50hhr9oit5e48rjmaqhv8rbt42.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
});
