import { betterAuth } from "better-auth"
import { db } from "./prisma"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "sqlite" }),
  secret: process.env.BETTER_AUTH_SECRET as string,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
})
