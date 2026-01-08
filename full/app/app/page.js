'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { PlusCircle, Edit2, Trash2, FileText } from 'lucide-react'
import { format } from 'date-fns'

const Home = () => {
      const [notes, setNotes] = useState([])
      const [isDialogOpen, setIsDialogOpen] = useState(false)
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
      const [currentNote, setCurrentNote] = useState(null)
      const [noteToDelete, setNoteToDelete] = useState(null)
      const [formData, setFormData] = useState({ title: '', content: '' })
      const [isLoading, setIsLoading] = useState(false)

      // Fetch notes on component mount
      useEffect(() => {
            fetchNotes()
      }, [])

      const fetchNotes = async () => {
            try {
                  const response = await fetch('/api/notes')
                  if (response.ok) {
                        const data = await response.json()
                        setNotes(data)
                  }
            } catch (error) {
                  console.error('Error fetching notes:', error)
            }
      }

      const handleCreateNote = () => {
            setCurrentNote(null)
            setFormData({ title: '', content: '' })
            setIsDialogOpen(true)
      }

      const handleEditNote = (note) => {
            setCurrentNote(note)
            setFormData({ title: note.title, content: note.content })
            setIsDialogOpen(true)
      }

      const handleDeleteClick = (note) => {
            setNoteToDelete(note)
            setIsDeleteDialogOpen(true)
      }

      const handleSaveNote = async () => {
            if (!formData.title.trim() || !formData.content.trim()) {
                  alert('Please fill in both title and content')
                  return
            }

            setIsLoading(true)
            try {
                  if (currentNote) {
                        // Update existing note
                        const response = await fetch(`/api/notes/${currentNote.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(formData)
                        })
                        if (response.ok) {
                              await fetchNotes()
                              setIsDialogOpen(false)
                        }
                  } else {
                        // Create new note
                        const response = await fetch('/api/notes', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(formData)
                        })
                        if (response.ok) {
                              await fetchNotes()
                              setIsDialogOpen(false)
                        }
                  }
            } catch (error) {
                  console.error('Error saving note:', error)
                  alert('Failed to save note')
            } finally {
                  setIsLoading(false)
            }
      }

      const handleDeleteNote = async () => {
            if (!noteToDelete) return

            setIsLoading(true)
            try {
                  const response = await fetch(`/api/notes/${noteToDelete.id}`, {
                        method: 'DELETE'
                  })
                  if (response.ok) {
                        await fetchNotes()
                        setIsDeleteDialogOpen(false)
                        setNoteToDelete(null)
                  }
            } catch (error) {
                  console.error('Error deleting note:', error)
                  alert('Failed to delete note')
            } finally {
                  setIsLoading(false)
            }
      }

      return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                  <div className="container mx-auto px-4 py-8 max-w-6xl">
                        {/* Header */}
                        <div className="mb-8">
                              <div className="flex items-center justify-between">
                                    <div>
                                          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Notes</h1>
                                          <p className="text-slate-600">Create and manage your notes efficiently</p>
                                    </div>
                                    <Button
                                          onClick={handleCreateNote}
                                          size="lg"
                                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                                    >
                                          <PlusCircle className="mr-2 h-5 w-5" />
                                          New Note
                                    </Button>
                              </div>
                        </div>

                        {/* Notes Grid */}
                        {notes.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-20">
                                    <FileText className="h-24 w-24 text-slate-300 mb-4" />
                                    <h2 className="text-2xl font-semibold text-slate-400 mb-2">No notes yet</h2>
                                    <p className="text-slate-500 mb-6">Create your first note to get started</p>
                                    <Button
                                          onClick={handleCreateNote}
                                          className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                          <PlusCircle className="mr-2 h-4 w-4" />
                                          Create Note
                                    </Button>
                              </div>
                        ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {notes.map((note) => (
                                          <Card key={note.id} className="hover:shadow-lg transition-shadow duration-200 bg-white border-slate-200">
                                                <CardHeader>
                                                      <CardTitle className="text-xl font-semibold text-slate-900 line-clamp-1">
                                                            {note.title}
                                                      </CardTitle>
                                                      <CardDescription className="text-sm text-slate-500">
                                                            {format(new Date(note.createdAt), 'MMM dd, yyyy • h:mm a')}
                                                      </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                      <p className="text-slate-700 line-clamp-4">{note.content}</p>
                                                </CardContent>
                                                <CardFooter className="flex justify-end gap-2">
                                                      <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditNote(note)}
                                                            className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                                                      >
                                                            <Edit2 className="h-4 w-4 mr-1" />
                                                            Edit
                                                      </Button>
                                                      <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(note)}
                                                            className="hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                                      >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Delete
                                                      </Button>
                                                </CardFooter>
                                          </Card>
                                    ))}
                              </div>
                        )}

                        {/* Create/Edit Dialog */}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                              <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                          <DialogTitle className="text-2xl">
                                                {currentNote ? 'Edit Note' : 'Create New Note'}
                                          </DialogTitle>
                                          <DialogDescription>
                                                {currentNote ? 'Update your note details below' : 'Fill in the details to create a new note'}
                                          </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                          <div>
                                                <label className="text-sm font-medium text-slate-700 mb-2 block">
                                                      Title
                                                </label>
                                                <Input
                                                      placeholder="Enter note title"
                                                      value={formData.title}
                                                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                      className="w-full"
                                                />
                                          </div>
                                          <div>
                                                <label className="text-sm font-medium text-slate-700 mb-2 block">
                                                      Content
                                                </label>
                                                <Textarea
                                                      placeholder="Enter note content"
                                                      value={formData.content}
                                                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                      className="w-full min-h-[200px]"
                                                />
                                          </div>
                                    </div>
                                    <DialogFooter>
                                          <Button
                                                variant="outline"
                                                onClick={() => setIsDialogOpen(false)}
                                                disabled={isLoading}
                                          >
                                                Cancel
                                          </Button>
                                          <Button
                                                onClick={handleSaveNote}
                                                disabled={isLoading}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                          >
                                                {isLoading ? 'Saving...' : (currentNote ? 'Update' : 'Create')}
                                          </Button>
                                    </DialogFooter>
                              </DialogContent>
                        </Dialog>

                        {/* Delete Confirmation Dialog */}
                        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                              <AlertDialogContent>
                                    <AlertDialogHeader>
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                                This will permanently delete the note "{noteToDelete?.title}". This action cannot be undone.
                                          </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                                onClick={handleDeleteNote}
                                                disabled={isLoading}
                                                className="bg-red-600 hover:bg-red-700"
                                          >
                                                {isLoading ? 'Deleting...' : 'Delete'}
                                          </AlertDialogAction>
                                    </AlertDialogFooter>
                              </AlertDialogContent>
                        </AlertDialog>
                  </div>
            </div>
      )
}

function App() {
      return (
            <div className="App">
                  <Home />
            </div>
      )
}

export default App

