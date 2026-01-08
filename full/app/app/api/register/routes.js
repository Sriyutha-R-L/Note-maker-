import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

const client = new MongoClient(process.env.MONGODB_URI)

async function getDB() {
      if (!client.topology?.isConnected()) {
            await client.connect()
      }
      return client.db('notesApp')
}

export async function POST(req) {
      const { name, email, password } = await req.json()
      const db = await getDB()

      // Check if user already exists
      const existingUser = await db.collection('users').findOne({ email })
      if (existingUser) {
            return NextResponse.json(
                  { error: 'User already exists' },
                  { status: 400 }
            )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      await db.collection('users').insertOne({
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
      })

      return NextResponse.json({ message: 'User registered successfully' })
}
