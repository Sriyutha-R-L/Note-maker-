import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

// MongoDB connection
let client
let db

async function connectToMongo() {
      if (!client) {
            client = new MongoClient(process.env.MONGO_URL)
            await client.connect()
            db = client.db(process.env.DB_NAME)
      }
      return db
}

// Helper function to handle CORS
function handleCORS(response) {
      response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      return response
}

// OPTIONS handler for CORS
export async function OPTIONS() {
      return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
      const { path = [] } = params
      const route = `/${path.join('/')}`
      const method = request.method

      try {
            const db = await connectToMongo()

            // Root endpoint - GET /api/
            if (route === '/' && method === 'GET') {
                  return handleCORS(NextResponse.json({ message: "Notes API is running" }))
            }

            // GET /api/notes - Get all notes
            if (route === '/notes' && method === 'GET') {
                  const notes = await db.collection('notes')
                        .find({})
                        .sort({ createdAt: -1 })
                        .toArray()

                  // Remove MongoDB's _id field from response
                  const cleanedNotes = notes.map(({ _id, ...rest }) => rest)

                  return handleCORS(NextResponse.json(cleanedNotes))
            }

            // POST /api/notes - Create a new note
            if (route === '/notes' && method === 'POST') {
                  const body = await request.json()

                  if (!body.title || !body.content) {
                        return handleCORS(NextResponse.json(
                              { error: "Title and content are required" },
                              { status: 400 }
                        ))
                  }

                  const note = {
                        id: uuidv4(),
                        title: body.title,
                        content: body.content,
                        createdAt: new Date().toISOString()
                  }

                  await db.collection('notes').insertOne(note)

                  // Return without _id
                  const { _id, ...cleanNote } = note
                  return handleCORS(NextResponse.json(cleanNote, { status: 201 }))
            }

            // PUT /api/notes/:id - Update a note
            if (route.startsWith('/notes/') && method === 'PUT') {
                  const noteId = path[1]
                  const body = await request.json()

                  if (!body.title || !body.content) {
                        return handleCORS(NextResponse.json(
                              { error: "Title and content are required" },
                              { status: 400 }
                        ))
                  }

                  const result = await db.collection('notes').updateOne(
                        { id: noteId },
                        {
                              $set: {
                                    title: body.title,
                                    content: body.content
                              }
                        }
                  )

                  if (result.matchedCount === 0) {
                        return handleCORS(NextResponse.json(
                              { error: "Note not found" },
                              { status: 404 }
                        ))
                  }

                  const updatedNote = await db.collection('notes').findOne({ id: noteId })
                  const { _id, ...cleanNote } = updatedNote

                  return handleCORS(NextResponse.json(cleanNote))
            }

            // DELETE /api/notes/:id - Delete a note
            if (route.startsWith('/notes/') && method === 'DELETE') {
                  const noteId = path[1]

                  const result = await db.collection('notes').deleteOne({ id: noteId })

                  if (result.deletedCount === 0) {
                        return handleCORS(NextResponse.json(
                              { error: "Note not found" },
                              { status: 404 }
                        ))
                  }

                  return handleCORS(NextResponse.json({
                        message: "Note deleted successfully",
                        id: noteId
                  }))
            }

            // Route not found
            return handleCORS(NextResponse.json(
                  { error: `Route ${route} not found` },
                  { status: 404 }
            ))

      } catch (error) {
            console.error('API Error:', error)
            return handleCORS(NextResponse.json(
                  { error: "Internal server error", details: error.message },
                  { status: 500 }
            ))
      }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute