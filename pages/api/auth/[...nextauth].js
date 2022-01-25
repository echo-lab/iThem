import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import { FirebaseAdapter } from "@next-auth/firebase-adapter"
import GithubProvider from "next-auth/providers/github"

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
  ],
  // adapter: FirebaseAdapter(firestore),
  secret:"RBKUCw5QfrkasYmxqjbM6tzDa2JkGlLfaiXG6hLEefs="
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