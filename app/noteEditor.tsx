// app/noteEditor.tsx
import { useState, useEffect, useRef, useMemo } from 'react'

import { StyleSheet, View, Text, Pressable } from 'react-native'

import { useLocalSearchParams, useRouter } from 'expo-router'

import { formatDate } from '@utils/sharedUtils'

import { MoreVertical } from '@/components/Icons/MoreVertical'
import Modal from '@/components/Modal/Modal'
import { createNote, deleteNote, getNoteById, updateNote } from '@/database/databaseService'
import TextInput from '@/shared/TextInput'
import { Note } from '@/types'

export default function NoteEditor({creating = true}) {
  const params = useLocalSearchParams()
  const router = useRouter()
  const topicId = params.topicId ? Number(params.topicId) : undefined
  const paramsNoteId = params.noteId ? Number(params.noteId) : undefined
  // Проверяем параметр isTask из роутера (может быть строкой 'true' или массивом)
  const paramsIsTask = params.isTask === 'true' || (Array.isArray(params.isTask) && params.isTask[0] === 'true')
  const [noteId, setNoteId] = useState<number | undefined>(paramsNoteId )

  const [exists, setExists] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [isTask, setIsTask] = useState<boolean>(paramsIsTask)
  const [createdAt, setCreatedAt] = useState<number | undefined>(undefined)
  const [isDone, setIsDone] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
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
          setCreatedAt(note.created_at)
          // @ts-expect-error - SQLite может возвращать 0/1 вместо boolean
          setIsDone(note.done === true || note.done === 1)
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
        // Получаем созданную заметку для получения created_at
        getNoteById(res).then((note: Note | null) => {
          if (note) {
            setCreatedAt(note.created_at)
          }
        })
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

  function handleDelete() {
    if (noteId) {
      deleteNote(noteId).then(() => {
        router.back()
      })
    }
  }

  const noteTypeText = isTask ? 'Задача' : 'Заметка'

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.noteType, isTask && isDone && styles.noteTypeDone]}>
            {noteTypeText}
          </Text>
          {createdAt && (
            <Text style={styles.date}>{formatDate(createdAt)}</Text>
          )}
        </View>
        {exists && (
          <Pressable onPress={() => setModalVisible(true)}>
            <MoreVertical />
          </Pressable>
        )}
      </View>
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
      <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <Pressable
          onPress={handleDelete}
          style={styles.modalButton}
        >
          <Text>Удалить</Text>
        </Pressable>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  headerLeft: {
    flex: 1,
  },
  noteType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  noteTypeDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  titleInput: {
    backgroundColor: '#fff',
  },
  contentInput: {
    backgroundColor: '#fff',
    flex: 1,
    verticalAlign: 'top',
  },
  modalButton: {
    backgroundColor: 'white',
    width: 250,
    alignItems: 'center',
    color: 'black',
    padding: 4,
  },
})




