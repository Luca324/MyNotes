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
  const [noteId, setNoteId] = useState<number | undefined>(paramsNoteId )

  const [exists, setExists] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const isCreatingRef = useRef<boolean>(false)

  useMemo(() => {
    if (!paramsNoteId) {
      // если NoteEditor был вызван для создания заметки, а не редактирования
      isCreatingRef.current = true
    } else {
      isCreatingRef.current = false
      getNoteById(paramsNoteId).then((note: Note | null) => {
        setTitle(note?.title || '')
        setContent(note?.content || '')
      })
    }
  }, [noteId])

  useEffect(() => {
    if (!exists && topicId && (title || content)) {
      createNote(topicId, content, title).then((res) => {
        setExists(true)
        setNoteId(res)
      })
    } else if (!title && !content && noteId && isCreatingRef.current) {
      // если NoteEditor был вызван для создания заметки, а не редактирования, то когда поля пустые - она удалчется. это гарантирует то что если человек передумал писать заметку, то не создастся пустая. тут еще есть над чем подмать: надо ли удалять если заметка редактировалась?
      deleteNote(noteId).then((res) => setExists(false))
    } else if (noteId) {
      updateNote(noteId, content, title)
    }
  }, [title, content, topicId, noteId])

  return (
    <View style={styles.container}>
      <TextInput
        value={title}
        onChangeText={setTitle}
        styles={styles.titleInput}
        placeholder="Заголовок"
      />
      <TextInput
        value={content}
        onChangeText={setContent}
        styles={styles.contentInput}
        placeholder="Текст"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
