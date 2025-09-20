// app/noteEditor.tsx
import { useState, useEffect, useRef } from 'react'

import { StyleSheet, View } from 'react-native'

import { useLocalSearchParams } from 'expo-router'

import { createNote, deleteNote, updateNote } from '@/database/databaseService'
import TextInput from '@/shared/TextInput'

export default function NoteEditor() {
  const params = useLocalSearchParams()
  const noteId = params.noteId ? Number(params.noteId) : undefined
  const topicId = params.topicId ? Number(params.topicId) : undefined

  const [exists, setExists] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const isCreatingRef = useRef<boolean>(false)

  useEffect(() => {
     
      if (!noteId) {// если NoteEditor был вызван для создания заметки, а не редактирования
        isCreatingRef.current = true
      } else {
        isCreatingRef.current = false
      }
    
  }, [])

  useEffect(() => {
    if (!exists && topicId) {
      createNote(topicId, content, title).then((res) => {setExists(true)})
    } else if (!title && !content && noteId && isCreatingRef.current) { // если NoteEditor был вызван для создания заметки, а не редактирования, то когда поля пустые - она удалчется. это гарантирует то что если человек передумал писать заметку, то не создастся пустая. тут еще есть над чем подмать: надо ли удалять если заметка редактировалась?
      deleteNote(noteId).then(res => setExists(false))
    } else if (noteId) {
      updateNote(noteId, content, title)
    }
  }, [title, content, topicId, noteId])


  return (
    <View style={styles.container}>
      <TextInput value={title} onChangeText={setTitle} />
      <TextInput value={content} onChangeText={setContent} />
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
})
