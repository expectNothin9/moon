import Dynamic from 'next/dynamic'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AddNoteForm from '../components/add-note'
import { deleteNote, loadNotes, selectNotes } from '../lib/slices/notesSlice'

const EditNoteForm = Dynamic(import('../components/edit-note'), { ssr: false })
const Notes = () => {
  const [selectedNote, setSelectedNote] = useState()
  const dispatch = useDispatch()
  const { notes } = useSelector(selectNotes)

  useEffect(() => {
    async function dispatchLoadNotes() {
      await dispatch(loadNotes())
    }
    dispatchLoadNotes()
  }, [dispatch])

  const renderNote = (note) => (
    <li key={note.id}>
      <strong>{note.title}</strong>
      <br />
      <span>{note.content}</span>
      <br />
      <button onClick={() => dispatch(deleteNote(note.id))}>
        <span role="img" aria-label={`Delete note with title: ${note.title}`}>
          🗑️
        </span>
      </button>
      <button onClick={() => setSelectedNote(note)}>
        <span role="img" aria-label={`Edit note with title: ${note.title}`}>
          ✏️
        </span>
      </button>
    </li>
  )

  return (
    <>
      <Head>
        <title>Next.js with Redux Toolkit | Notes App</title>
      </Head>
      <AddNoteForm />
      <hr />
      <h3>All Notes</h3>
      <ul>{notes.map(renderNote)}</ul>
      <EditNoteForm note={selectedNote} />
    </>
  )
}

export default Notes
