import { useContext, useState, useEffect } from 'react'

import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Button,
} from 'react-native'

import { Link } from 'expo-router'

import { getDepthColor, getTextColor } from 'colorSchemes'

import { AddCircle } from '@/components/Icons/AddCircle'
import { Trash } from '@/components/Icons/Trash'
import Modal from '@/components/Modal/Modal'
import { useTopics, useNotes } from '@/hooks/useNotes'
import TextInput from '@/shared/TextInput'
import type { Topic as TopicType } from '@/types'
import Note from '@/components/Note/Note'

import { addTab } from '../../database/databaseService'
import { AppContext } from '../AppProvider'
import { ChevronDown } from '../Icons/ChevronDown'
import { ChevronUp } from '../Icons/ChevronUp'

import { styles } from './Topic.styles'

// Локальный компонент TopicContent для избежания require cycle
function TopicContentComponent({ topic, depth, subtopics, deleteSubtopic }: {
  topic: TopicType
  depth: number
  subtopics: TopicType[]
  deleteSubtopic: (id: number) => void
}) {
  const { id } = topic
  const { notes, deleteNote } = useNotes(id)

  return (
    <View style={topicContentStyles.topicContent}>
      {subtopics && subtopics.map(subtopic => (
        <Topic topic={subtopic} deleteTopic={deleteSubtopic} key={subtopic.id} depth={depth + 1} />
      ))}
      {notes && notes.map(note => (
        <Note key={note.id} note={note} topic={id} deleteNote={deleteNote} />
      ))}
    </View>
  )
}

const topicContentStyles = StyleSheet.create({
  topicContent: {
    width: '100%',
  },
})

interface TopicProps {
  topic: TopicType
  deleteTopic: (id: number) => void
  depth?: number
  setAsTab?: null | ((topic: TopicType) => void)
}

export default function Topic({
  topic,
  deleteTopic,
  depth = 0,
  setAsTab = null,
}: TopicProps) {
  const [modalVisible, setModalVisible] = useState(false)

  const backgroundColor = getDepthColor(depth)
  const color = getTextColor(depth)
  console.log('depth, color', depth, color)

  const { id, name } = topic
  const { allTabs, setAllTabs } = useContext(AppContext)

  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const [createSubtopicVisible, setCreateSubtopicVisible] =
    useState<boolean>(false)

  // Очищаем поле при открытии формы создания подтемы
  useEffect(() => {
    if (createSubtopicVisible) {
      setNewSubtopicName('')
    }
  }, [createSubtopicVisible])

  const onPress = () => {
    setIsExpanded(!isExpanded)
  }

  function deleteTopicAndTab() {
    deleteTopic(id)
    if (isTab) setAllTabs(allTabs.filter((tab) => tab.id !== id))
  }

  const isTab = allTabs.filter((tab) => tab.id === id).length

  function openTopicSettings() {
    console.log(openTopicSettings)
    setModalVisible(true)
  }

  const {
    topics: subtopics,
    createTopic: createSubtopic,
    deleteTopic: deleteSubtopic,
  } = useTopics(id)
  const [newSubtopicName, setNewSubtopicName] = useState('')

  return (
    <View style={[styles.topic, { backgroundColor }]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        onLongPress={openTopicSettings}
        style={styles.topicHeader}
      >
        <Text style={[styles.nameText, { color }]}>{name}</Text>
        <View style={styles.horizontal}>
          {/* <Text style={styles.idText}>id: {id}</Text> */}
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <TopicContentComponent
          topic={topic}
          subtopics={subtopics}
          deleteSubtopic={deleteSubtopic}
          depth={depth}
        />
      )}
      <Modal modalVisible={modalVisible} setModalVisible={setModalVisible} onClose={() => setCreateSubtopicVisible(false)}>
        <Pressable onPress={deleteTopicAndTab} style={styles.modalButton}>
          <Text>Удалить</Text>
        </Pressable>
        {!isTab && (
          <Pressable
            onPress={() => {
              addTab(id).then(() => {
                if (setAsTab) setAsTab(topic)
              })
            }}
            style={styles.modalButton}
          >
            <Text>Закрепить</Text>
          </Pressable>
        )}
        <Link
          href={{ pathname: '/noteEditor', params: { topicId: id } }}
          asChild
        >
          <Pressable style={styles.modalButton}>
            <Text>Добавить заметку</Text>
          </Pressable>
        </Link>

        <Pressable
          onPress={() => setCreateSubtopicVisible(!createSubtopicVisible)}
          style={styles.modalButton}
        >
          <Text style={createSubtopicVisible && styles.underline}>
            Создать подтему
          </Text>
        </Pressable>
        {createSubtopicVisible && (
          <View style={styles.inputContainer}>
            <TextInput
              value={newSubtopicName}
              setValue={setNewSubtopicName}
              styles={styles.input}
            />

            <Pressable
              onPress={() => {
                if (newSubtopicName) {
                  createSubtopic(id, newSubtopicName).then(() => {
                    setNewSubtopicName('')
                    setCreateSubtopicVisible(false)
                    setModalVisible(false)
                    // TODO показать сообщение об успехе
                  })
                }
              }}
              style={styles.readyButton}
            >
              <Text>Готово</Text>
            </Pressable>
          </View>
        )}
      </Modal>
    </View>
  )
}
