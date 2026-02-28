import React, { useContext, useState, useEffect, useMemo } from 'react'

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
import Note from '@/components/Note/Note'
import Task from '@/components/Task/Task'
import { useTopics, useNotes } from '@/hooks/useNotes'
import TextInput from '@/shared/TextInput'
import type { Topic as TopicType, Note as NoteType } from '@/types'

import { addTab, removeTab, getAllTabs, getChildTopics, getNotesForTopic } from '../../database/databaseService'
import { AppContext } from '../AppProvider'
import { ChevronDown } from '../Icons/ChevronDown'
import { ChevronUp } from '../Icons/ChevronUp'

import { styles } from './Topic.styles'

// Компонент для отображения выполненных задач
function CompletedTasksGroup({ 
  completedTasks, 
  topicId, 
  deleteTask, 
  toggleTaskDone 
}: {
  completedTasks: NoteType[]
  topicId: number
  deleteTask: (id: number) => void
  toggleTaskDone: (taskId: number, done: boolean) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (completedTasks.length === 0) return null

  return (
    <View style={completedTasksStyles.container}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.8}
        style={completedTasksStyles.header}
      >
        <Text style={completedTasksStyles.headerText}>Выполненные задачи</Text>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </TouchableOpacity>
      {isExpanded && (
        <View style={completedTasksStyles.content}>
          {completedTasks.map(task => (
            <Task
              key={task.id}
              task={task}
              topicId={topicId}
              deleteTask={deleteTask}
              toggleTaskDone={toggleTaskDone}
            />
          ))}
        </View>
      )}
    </View>
  )
}

// Локальный компонент TopicContent для избежания require cycle
function TopicContentComponent({ topic, depth, subtopics, deleteSubtopic, isExpanded }: {
  topic: TopicType
  depth: number
  subtopics: TopicType[]
  deleteSubtopic: (id: number) => void
  isExpanded: boolean
}) {
  const { id } = topic
  const { notes, deleteNote, setNotes, toggleTaskDone } = useNotes(id)

  // Обновляем заметки при монтировании компонента и при каждом разворачивании темы
  // Это гарантирует, что новые заметки будут видны сразу после создания
  useEffect(() => {
    if (isExpanded) {
      getNotesForTopic(id).then(setNotes)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isExpanded])

  // Разделяем заметки на задачи и обычные заметки
  // SQLite возвращает числа (0/1), поэтому проверяем truthy значения
  const tasks = notes.filter(note => {
    // @ts-expect-error - SQLite может возвращать 0/1 вместо boolean
    return note.is_task === true || note.is_task === 1
  })
  const regularNotes = notes.filter(note => {
    // @ts-expect-error - SQLite может возвращать 0/1 вместо boolean
    return !note.is_task || note.is_task === 0 || note.is_task === false
  })
  
  const incompleteTasks = tasks.filter(task => {
    // @ts-expect-error - SQLite может возвращать 0/1 вместо boolean
    return !task.done || task.done === 0 || task.done === false
  })
  const completedTasks = tasks.filter(task => {
    // @ts-expect-error - SQLite может возвращать 0/1 вместо boolean
    return task.done === true || task.done === 1
  })

  return (
    <View style={topicContentStyles.topicContent}>
      {subtopics && subtopics.map(subtopic => (
        <Topic topic={subtopic} deleteTopic={deleteSubtopic} key={subtopic.id} depth={depth + 1} />
      ))}
      {/* Невыполненные задачи */}
      {incompleteTasks && incompleteTasks.map(task => (
        <Task 
          key={task.id} 
          task={task} 
          topicId={id} 
          deleteTask={deleteNote} 
          toggleTaskDone={toggleTaskDone}
        />
      ))}
      {/* Обычные заметки */}
      {regularNotes && regularNotes.map(note => (
        <Note key={note.id} note={note} topicId={id} deleteNote={deleteNote} />
      ))}
      {/* Выполненные задачи */}
      <CompletedTasksGroup
        completedTasks={completedTasks}
        topicId={id}
        deleteTask={deleteNote}
        toggleTaskDone={toggleTaskDone}
      />
    </View>
  )
}

const topicContentStyles = StyleSheet.create({
  topicContent: {
    width: '100%',
  },
})

const completedTasksStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 4,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  content: {
    width: '100%',
    marginTop: 4,
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
    if (isTab) {
      removeTab(id).then(() => {
        getAllTabs().then(setAllTabs)
      })
    }
  }

  // Пересчитываем isTab при изменении allTabs
  const isTab = useMemo(() => {
    return allTabs.some((tab) => tab.id === id)
  }, [allTabs, id])

  function openTopicSettings() {
    console.log(openTopicSettings)
    setModalVisible(true)
  }

  const {
    topics: subtopics,
    createTopic: createSubtopic,
    deleteTopic: deleteSubtopic,
    setTopics: setSubtopics,
  } = useTopics(id)
  const [newSubtopicName, setNewSubtopicName] = useState('')
  
  // Обновляем подтемы при разворачивании темы
  useEffect(() => {
    if (isExpanded) {
      getChildTopics(id).then(setSubtopics)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, id])

  // Обновляем подтемы при каждом разворачивании темы (чтобы видеть новые подтемы)
  // Это срабатывает каждый раз, когда тема разворачивается, включая после создания подтемы

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
          isExpanded={isExpanded}
        />
      )}
      <Modal modalVisible={modalVisible} setModalVisible={setModalVisible} onClose={() => setCreateSubtopicVisible(false)}>
        <Pressable onPress={deleteTopicAndTab} style={styles.modalButton}>
          <Text>Удалить</Text>
        </Pressable>
        {isTab ? (
          <Pressable
            onPress={() => {
              removeTab(id).then(() => {
                getAllTabs().then(setAllTabs)
                setModalVisible(false)
              })
            }}
            style={styles.modalButton}
          >
            <Text>Открепить</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              addTab(id).then(() => {
                getAllTabs().then(setAllTabs)
                if (setAsTab) setAsTab(topic)
                setModalVisible(false)
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
        <Link
          href={{ pathname: '/noteEditor', params: { topicId: id, isTask: 'true' } }}
          asChild
        >
          <Pressable style={styles.modalButton}>
            <Text>Добавить задачу</Text>
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
                    // Принудительно обновляем список подтем после создания
                    getChildTopics(id).then(setSubtopics)
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
