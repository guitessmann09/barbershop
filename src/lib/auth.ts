import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./prisma"
import { NextAuthOptions } from "next-auth"
import { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Barbeiro",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const barber = await db.barber.findUnique({
          where: { email: credentials.email },
        })

        if (!barber || !barber.password) return null

        const valid = await compare(credentials.password, barber.password)

        if (!valid) return null

        return {
          id: barber.id.toString(),
          name: barber.name,
          email: barber.email,
          image: barber.imageURL ?? undefined,
          provider: "credentials",
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        token.id = user.id
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          provider: token.provider as string,
        }
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
