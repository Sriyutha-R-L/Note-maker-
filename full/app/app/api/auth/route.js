import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

const client = new MongoClient(process.env.MONGODB_URI)

async function getDB() {
      if (!client.topology?.isConnected()) {
            await client.connect()
      }
      return client.db('notesApp')
}

export const authOptions = {
      session: {
            strategy: 'jwt',
      },
      providers: [
            CredentialsProvider({
                  name: 'Credentials',
                  credentials: {
                        email: { label: 'Email', type: 'email' },
                        password: { label: 'Password', type: 'password' },
                  },

                  async authorize(credentials) {
                        const db = await getDB()

                        const user = await db
                              .collection('users')
                              .findOne({ email: credentials.email })

                        if (!user) {
                              throw new Error('User not found')
                        }

                        const isValid = await bcrypt.compare(
                              credentials.password,
                              user.password
                        )

                        if (!isValid) {
                              throw new Error('Invalid password')
                        }

                        return {
                              id: user._id.toString(),
                              name: user.name,
                              email: user.email,
                        }
                  },
            }),
      ],

      callbacks: {
            async jwt({ token, user }) {
                  if (user) {
                        token.id = user.id
                  }
                  return token
            },

            async session({ session, token }) {
                  session.user.id = token.id
                  return session
            },
      },

      secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
