import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

const client = new MongoClient(process.env.MONGODB_URI)

async function getDB() {
      if (!client.topology?.isConnected()) {
            await client.connect()
      }
      return client.db('notesApp')
}

// ---------------- GET NOTES ----------------
export async function GET(req) {
      const session = await getServerSession(authOptions)
      if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const db = await getDB()
      const notes = await db
            .collection('notes')
            .find({ userId: session.user.id })
            .toArray()

      return NextResponse.json(notes)
}

// ---------------- CREATE NOTE ----------------
export async function POST(req) {
      const session = await getServerSession(authOptions)
      if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { title, content } = await req.json()
      const db = await getDB()

      await db.collection('notes').insertOne({
            id: uuidv4(),
            title,
            content,
            userId: session.user.id,
            createdAt: new Date(),
      })

      return NextResponse.json({ message: 'Note created' })
}
