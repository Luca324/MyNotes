import { useState } from 'react'

import { StyleSheet, Text, View, Pressable, Button } from 'react-native'

import { Link } from 'expo-router'

import { formatDate } from '@utils/sharedUtils'

import { MoreVertical } from '@/components/Icons/MoreVertical'
import { Trash } from '@/components/Icons/Trash'
import Modal from '@/components/Modal/Modal'
import type { Note as NoteType } from '@/types'

interface NoteProps {
  note: NoteType
  deleteNote: (id: number) => void
  topicId: number
}

export default function Note({ note, deleteNote, topicId }: NoteProps) {
  const [modalVisible, setModalVisible] = useState(false)

  function openNoteSettings() {
    console.log(openNoteSettings)
    setModalVisible(true)
  }

  return (
    <View style={styles.noteWrapper}>
      <Link
        style={styles.noteLink}
        href={{
          pathname: '/noteEditor',
          params: { topicId: topicId, noteId: note.id },
        }}
        asChild
      >
        <View style={styles.note}>
          <View style={styles.header}>
            <Text style={styles.id}>id: {note.id}</Text>
            <Text style={styles.id}>{formatDate(note.created_at)}</Text>
            <Pressable onPress={openNoteSettings}>
              <MoreVertical />
            </Pressable>
          </View>
          {note.title && <Text style={styles.title}>{note.title}</Text>}
          {note.content && <Text>{note.content}</Text>}
        </View>
      </Link>
      <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <Pressable
          onPress={() => deleteNote(note.id as number)}
          style={styles.modalButton}
        >
          <Text>Удалить</Text>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  noteWrapper: {
    width: '100%',
  },
  noteLink: {
    width: '100%',
  },
  note: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 2,
    marginHorizontal: 2,
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  id: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: 'white',
    width: 250,
    alignItems: 'center',
    color: 'black',
    padding: 4,
  },
})
