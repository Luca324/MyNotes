import { useState } from 'react'

import { StyleSheet, Text, View, Pressable } from 'react-native'

import { Link } from 'expo-router'

import { formatDate } from '@utils/sharedUtils'

import { MoreVertical } from '@/components/Icons/MoreVertical'
import Modal from '@/components/Modal/Modal'
import type { Note as NoteType } from '@/types'

interface TaskProps {
  task: NoteType
  deleteTask: (id: number) => void
  topicId: number
  toggleTaskDone: (taskId: number, done: boolean) => void
}

export default function Task({ task, deleteTask, topicId, toggleTaskDone }: TaskProps) {
  const [modalVisible, setModalVisible] = useState(false)
  // @ts-expect-error - SQLite может возвращать 0/1 вместо boolean
  const isDone = task.done === true || task.done === 1

  function openTaskSettings() {
    console.log(openTaskSettings)
    setModalVisible(true)
  }

  function handleCheckboxPress() {
    toggleTaskDone(task.id as number, !isDone)
  }

  const displayText = task.title || task.content || 'Без названия'

  return (
    <View style={styles.width100}>
      <View style={styles.task}>
        <Pressable onPress={handleCheckboxPress} style={styles.checkboxContainer}>
          <View style={[styles.checkbox, isDone && styles.checkboxChecked]}>
            {isDone && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </Pressable>
        <Link
          style={styles.taskContent}
          href={{
            pathname: '/noteEditor',
            params: { topicId: topicId, noteId: task.id },
          }}
          asChild
        >
          <Pressable style={styles.taskTextContainer}>
            <View style={styles.header}>
              <Text style={[styles.taskText, isDone && styles.taskTextDone]}>
                {displayText}
              </Text>
              <Pressable onPress={openTaskSettings}>
                <MoreVertical />
              </Pressable>
            </View>
            <Text style={styles.date}>{formatDate(task.created_at)}</Text>
          </Pressable>
        </Link>
      </View>
      <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <Pressable
          onPress={() => deleteTask(task.id as number)}
          style={styles.modalButton}
        >
          <Text>Удалить</Text>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  width100: {
    width: '100%',
  },
  task: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 2,
    marginHorizontal: 2,
    padding: 10,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxContainer: {
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#818cf8',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#818cf8',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTextContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  modalButton: {
    backgroundColor: 'white',
    width: 250,
    alignItems: 'center',
    color: 'black',
    padding: 4,
  },
})

