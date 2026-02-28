// app/noteEditor.tsx
import { useState, useEffect, useRef, useMemo } from 'react'

import { StyleSheet, View, Text } from 'react-native'

import { useLocalSearchParams } from 'expo-router'


import { createNote, deleteNote, getNoteById, updateNote } from '@/database/databaseService'
import TextInput from '@/shared/TextInput'
import { Note } from '@/types'

export default function NoteEditor({creating = true}) {
  const params = useLocalSearchParams()
  const topicId = params.topicId ? Number(params.topicId) : undefined
  const paramsNoteId = params.noteId ? Number(params.noteId) : undefined
  // Проверяем параметр isTask из роутера (может быть строкой 'true' или boolean)
  const paramsIsTask = params.isTask === 'true' || params.isTask === true || (Array.isArray(params.isTask) && params.isTask[0] === 'true')
  const [noteId, setNoteId] = useState<number | undefined>(paramsNoteId )

  const [exists, setExists] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [isTask, setIsTask] = useState<boolean>(paramsIsTask)
  const isCreatingRef = useRef<boolean>(false)

  useEffect(() => {
    if (!paramsNoteId) {
      // если NoteEditor был вызван для создания заметки, а не редактирования
      isCreatingRef.current = true
      setIsTask(paramsIsTask)
    } else {
      isCreatingRef.current = false
      setNoteId(paramsNoteId)
      getNoteById(paramsNoteId).then((note: Note | null) => {
        if (note) {
          setTitle(note.title || '')
          setContent(note.content || '')
          // @ts-expect-error - SQLite может возвращать 0/1 вместо boolean
          const noteIsTask = note.is_task === true || note.is_task === 1
          setIsTask(noteIsTask)
          setExists(true)
        }
      })
    }
  }, [paramsNoteId, paramsIsTask])

  useEffect(() => {
    if (!exists && topicId && (title || content) && !paramsNoteId) {
      // Создаем новую заметку или задачу при первом вводе
      createNote(topicId, content, title, 0, isTask, false).then((res) => {
        setExists(true)
        setNoteId(res)
      })
    } else if (!title && !content && noteId && isCreatingRef.current) {
      // если NoteEditor был вызван для создания заметки, а не редактирования, то когда поля пустые - она удалчется. это гарантирует то что если человек передумал писать заметку, то не создастся пустая. тут еще есть над чем подмать: надо ли удалять если заметка редактировалась?
      deleteNote(noteId).then((res) => setExists(false))
    } else if (noteId) {
      // Обновляем заметку при каждом изменении (и для новых, и для существующих)
      updateNote(noteId, content, title)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, topicId, noteId, isTask])

  return (
    <View style={styles.container}>
      <TextInput
        value={title}
        setValue={setTitle}
        styles={styles.titleInput}
        placeholder="Заголовок"
      />
      <TextInput
        value={content}
        setValue={setContent}
        styles={styles.contentInput}
        placeholder="Текст"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 36,
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 5,
  },
  titleInput: {
    backgroundColor: '#fff',
  },
  contentInput: {
    backgroundColor: '#fff',
    flex: 1,
    verticalAlign: 'top',
  },
})




