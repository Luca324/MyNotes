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

  // Загружаем данные заметки при открытии редактора
  useEffect(() => {
    if (!paramsNoteId) {
      // если NoteEditor был вызван для создания заметки, а не редактирования
      isCreatingRef.current = true
      setTitle('')
      setContent('')
      setNoteId(undefined)
      setExists(false)
    } else {
      isCreatingRef.current = false
      setNoteId(paramsNoteId)
      getNoteById(paramsNoteId).then((note: Note | null) => {
        if (note) {
          setTitle(note.title || '')
          setContent(note.content || '')
          setExists(true)
        }
      })
    }
  }, [paramsNoteId])

  useEffect(() => {
    // Пропускаем выполнение, если данные еще загружаются
    if (!paramsNoteId && !noteId && !title && !content) {
      return
    }

    // Используем таймер для debounce, чтобы не создавать/обновлять заметку при каждом изменении
    const timeoutId = setTimeout(() => {
      if (!exists && topicId && (title || content) && !paramsNoteId) {
        // Создаем новую заметку только если это не редактирование существующей
        console.log('noteEditor - before createNote:', { topicId, title, content, titleLength: title?.length, contentLength: content?.length })
        createNote(topicId, content || '', title || '').then((res) => {
          setExists(true)
          setNoteId(res)
        })
      } else if (!title && !content && noteId && isCreatingRef.current) {
        // если NoteEditor был вызван для создания заметки, а не редактирования, то когда поля пустые - она удалчется. это гарантирует то что если человек передумал писать заметку, то не создастся пустая. тут еще есть над чем подмать: надо ли удалять если заметка редактировалась?
        deleteNote(noteId).then((res) => setExists(false))
      } else if (noteId && exists && paramsNoteId) {
        // Обновляем существующую заметку только если она уже загружена
        updateNote(noteId, content, title)
      }
    }, 500) // Задержка 500мс для debounce

    return () => clearTimeout(timeoutId)
  }, [title, content, topicId, noteId, exists, paramsNoteId])

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
