import { useState, useEffect } from 'react'

import {
  createTopic as createTopicDB,
  deleteTopic as deleteTopicDB,
  updateTopic as updateTopicDB,
  createNote as createNoteDB,
  updateNote as updateNoteDB,
  deleteNote as deleteNoteDB,
  getNotesForTopic,
  getChildTopics,
  toggleTaskDone as toggleTaskDoneDB,
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
    return createTopicDB(parentId, topicName, orderIndex).then(async (res) => {
      // Перезагружаем список подтем из БД для актуальности данных
      const updatedTopics = await getChildTopics(parentTopicId)
      setTopics(updatedTopics)
      return res
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

  async function renameTopic(topicId: number, newName: string) {
    return updateTopicDB(topicId, newName).then(async () => {
      // Перезагружаем список подтем из БД для актуальности данных
      const updatedTopics = await getChildTopics(parentTopicId)
      setTopics(updatedTopics)
    })
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
    return createNoteDB(topicId, text).then(async (res) => {
      console.log('res of creating note for', topicId, res)
      // Перезагружаем список заметок из БД для актуальности данных
      const updatedNotes = await getNotesForTopic(topicId)
      setNotes(updatedNotes)
      return res
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

  function toggleTaskDone(taskId: number, done: boolean) {
    toggleTaskDoneDB(taskId, done).then(async () => {
      // Перезагружаем список заметок из БД для актуальности данных
      const updatedNotes = await getNotesForTopic(topicId)
      setNotes(updatedNotes)
    })
  }

  return {
    notes,
    setNotes,
    createNote,
    updateNote,
    deleteNote,
    toggleTaskDone,
  }
}