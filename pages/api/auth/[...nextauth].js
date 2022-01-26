import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import { FirebaseAdapter } from "@next-auth/firebase-adapter"
import GithubProvider from "next-auth/providers/github"
import Auth0Provider from "next-auth/providers/auth0";
// import firebase from "firebase/app"
// import "firebase/firestore"

// const firestore = (
//   firebase.apps[0] ?? firebase.initializeApp(firebaseConfig)
// ).firestore()

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: "1005122392716-o0pnlo50hhr9oit5e48rjmaqhv8rbt42.apps.googleusercontent.com",
        // process.env.GOOGLE_CLIENT_ID,
      clientSecret: "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"
      // process.env.GOOGLE_CLIENT_SECRET,
    }),
    Auth0Provider({
      clientId: "4AODEw3JUoL2vGh2pYbDRgvb2erGSTDG",
      clientSecret: "MTlcPpy4EoNc6PJkg6XgQryBF19mguzOzxWq64gaTBjXJLaADV4STLSyjW1Sg8D8",
      issuer: "dev-ma20u47s.us.auth0.com"
    })
  ],
  // adapter: FirebaseAdapter(firestore),
  secret:"RBKUCw5QfrkasYmxqjbM6tzDa2JkGlLfaiXG6hLEefs=",
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
    }
  }
});


// const firebaseConfig = {
//   apiKey: "AIzaSyB7NvDTA7vp2A_A-Mom9Nl5PlLneAFICrU",
//   authDomain: "ithem-76422.firebaseapp.com",
//   projectId: "ithem-76422",
//   storageBucket: "ithem-76422.appspot.com",
//   messagingSenderId: "677650186063",
//   appId: "1:677650186063:web:19e33aaa8a3dd658fd8f3a",
//   measurementId: "G-R2TQLXGF3Z"
// };