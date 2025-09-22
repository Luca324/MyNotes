import { useState, useEffect } from 'react'

import {
  createTopic as createTopicDB,
  deleteTopic as deleteTopicDB,
  createNote as createNoteDB,
  updateNote as updateNoteDB,
  deleteNote as deleteNoteDB,
  getNotesForTopic,
  getChildTopics,
} from '../database/databaseService'
import { Note, Topic } from '../types'

export function useTopics(parentTopicId: number = 0, init: Topic[] = []) {
  const [topics, setTopics] = useState<Topic[]>(init)

  useEffect(() => {
    getChildTopics(parentTopicId).then((n) => {
      setTopics(n)
    })
  }, [parentTopicId])

  async function createTopic(
    parentId: number | null = null,
    topicName: string,
    orderIndex: number = 0
  ) {
    const newTopic = {
      name: topicName,
      notes: [],
    }
    return createTopicDB(parentId, topicName, orderIndex).then((res) => {
      setTopics(topics.concat({ ...newTopic, id: res } as unknown as Topic))
    })
  }

  function deleteTopic(topicId: number) {
    console.log('deleting id:', topicId)
    deleteTopicDB(topicId).then((res) => {
      console.log('res of deleting topic', res)
      setTopics(
        topics.filter((topic) => {
          return topic.id !== topicId
        })
      )
    })
  }

  function renameTopic(topicId: number, newName: string) {
    const newTopics = topics.map((topic) =>
      topic.id === topicId ? { ...topic, name: newName } : topic
    )
    setTopics(newTopics)
  }

  return { topics, setTopics, createTopic, deleteTopic, renameTopic }
}

export function useNotes(topicId = 0) {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    getNotesForTopic(topicId).then((res: Note[]) => {
      setNotes(res)
    })
  }, [topicId])

  function createNote(topicId: number, text: string) {
    const newNote: Note = {
      content: text,
      created_at: Date.now(),
    }
    createNoteDB(topicId, text).then((res) => {
      console.log('res of creating note for', topicId, res)
      setNotes(notes.concat({ ...newNote, id: res }))
    })
  }

  function updateNote(noteId: number, content?: string, title?: string) {
    const oldNote: Note | undefined = notes.find((note) => note.id === noteId)
    if (!oldNote) return null

    const newNote: Note = { ...oldNote }
    if (content) newNote.content = content
    if (title) newNote.title = title

    updateNoteDB(noteId, content, title).then((res) => {
      console.log('res of updating note', res)
      setNotes(notes.concat(newNote))
    })
  }

  function deleteNote(noteId: number) {
    deleteNoteDB(noteId).then((res) => {
      console.log('res of deleting note', res)
      setNotes(notes.filter((note) => note.id !== noteId))
    })
  }

  return {
    notes,
    setNotes,
    createNote,
    updateNote,
    deleteNote,
  }
}