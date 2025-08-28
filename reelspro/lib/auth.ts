// No type imports from next-auth
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if(!credentials?.email || !credentials?.password){
            throw new Error("Missing Email or Password");
        }
        try{
            await connectToDatabase()
            const user = await User.findOne({ email: credentials.email }).exec(); // exec here helps with query execution

            if(!user){
                throw new Error("No User Found")
            }

            const isValid = await bcrypt.compare(
                credentials.password,
                user.password
            )

            if(!isValid){
                throw new Error("Invalid Password")
            }

            return { 
                id: user._id.toString(),
                email: user.email
            }

        } catch(e){
            throw new Error("Invalid Email or Password")
        }
      },
    }),
  ],
  callbacks: {
  async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
