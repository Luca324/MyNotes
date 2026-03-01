import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react'

import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Button,
} from 'react-native'

import { Link, useFocusEffect } from 'expo-router'


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

  // Обновляем заметки при возврате на экран (например, после закрытия редактора заметок)
  useFocusEffect(
    React.useCallback(() => {
      if (isExpanded) {
        getNotesForTopic(id).then(setNotes)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isExpanded])
  )

  // Разделяем заметки на задачи и обычные заметки
  // SQLite возвращает числа (0/1) или null/undefined для новых полей, поэтому проверяем truthy значения
  const tasks = notes.filter(note => {
    // SQLite может возвращать 0/1/null/undefined вместо boolean
    const isTaskValue: any = note.is_task
    // Проверяем все возможные варианты: true, 1, '1'
    const isTask = isTaskValue === true || isTaskValue === 1 || String(isTaskValue) === '1'
    if (isTask) {
      console.log('Found task:', note.id, 'is_task:', isTaskValue, 'done:', note.done)
    }
    return Boolean(isTask)
  })
  const regularNotes = notes.filter(note => {
    // SQLite может возвращать 0/1/null/undefined вместо boolean
    const isTaskValue: any = note.is_task
    // Если is_task null/undefined/0/false - это обычная заметка
    const isTask = isTaskValue === true || isTaskValue === 1 || String(isTaskValue) === '1'
    return !isTask
  })
  
  const incompleteTasks = tasks.filter(task => {
    // SQLite может возвращать 0/1 вместо boolean
    const isDoneValue: any = task.done
    const isDone = isDoneValue === true || isDoneValue === 1 || String(isDoneValue) === '1'
    return !isDone
  })
  const completedTasks = tasks.filter(task => {
    // SQLite может возвращать 0/1 вместо boolean
    const isDoneValue: any = task.done
    const isDone = isDoneValue === true || isDoneValue === 1 || String(isDoneValue) === '1'
    return Boolean(isDone)
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

  const { id } = topic
  const { allTabs, setAllTabs } = useContext(AppContext)

  // Локальное состояние для имени темы, чтобы обновлять его при переименовании
  const [topicName, setTopicName] = useState<string>(topic.name)

  // Обновляем локальное имя при изменении пропса topic
  useEffect(() => {
    setTopicName(topic.name)
  }, [topic.name])

  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const [createSubtopicVisible, setCreateSubtopicVisible] =
    useState<boolean>(false)
  const [renameTopicVisible, setRenameTopicVisible] =
    useState<boolean>(false)
  const [newTopicName, setNewTopicName] = useState<string>(topic.name)

  // Очищаем поле при открытии формы создания подтемы
  useEffect(() => {
    if (createSubtopicVisible) {
      setNewSubtopicName('')
    }
  }, [createSubtopicVisible])

  // Устанавливаем текущее имя темы при открытии формы переименования
  useEffect(() => {
    if (renameTopicVisible) {
      setNewTopicName(topicName)
    }
  }, [renameTopicVisible, topicName])

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
    renameTopic: renameSubtopic,
    setTopics: setSubtopics,
  } = useTopics(id)
  const [newSubtopicName, setNewSubtopicName] = useState('')
  
  // Для переименования текущей темы используем родительский useTopics
  const { renameTopic: renameCurrentTopic } = useTopics(topic.parent_id || 0)
  
  // Обновляем подтемы при разворачивании темы
  useEffect(() => {
    if (isExpanded) {
      getChildTopics(id).then(setSubtopics)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, id])

  // Обновляем подтемы при возврате на экран (например, после создания подтемы)
  useFocusEffect(
    useCallback(() => {
      if (isExpanded) {
        getChildTopics(id).then(setSubtopics)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isExpanded])
  )

  // Обновляем подтемы при каждом разворачивании темы (чтобы видеть новые подтемы)
  // Это срабатывает каждый раз, когда тема разворачивается, включая после создания подтемы

  return (
    <View style={[styles.topic, { backgroundColor }]}>
      <View style={styles.topicHeader}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          style={styles.topicNameContainer}
          onLongPress={openTopicSettings}
          delayLongPress={350}
        >
          <Text style={[styles.nameText, { color }]}>{topicName}</Text>
        </TouchableOpacity>
        <View style={styles.horizontal}>
            <Link
              href={{ pathname: '/noteEditor', params: { topicId: id } }}
              asChild
            >
              <Pressable>
                <Text style={styles.createNoteIcon}>+</Text>
              </Pressable>
            </Link>
            <Link
              href={{ pathname: '/noteEditor', params: { topicId: id, isTask: 'true' } }}
              asChild
            >
              <Pressable>
                <Text style={styles.createTaskIcon}>✓</Text>
              </Pressable>
            </Link>
          <Pressable onPress={onPress} onLongPress={openTopicSettings} delayLongPress={350}>
            {/* <Text style={styles.idText}>id: {id}</Text> */}
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </Pressable>
        </View>
      </View>

      {isExpanded && (
        <TopicContentComponent
          topic={topic}
          subtopics={subtopics}
          deleteSubtopic={deleteSubtopic}
          depth={depth}
          isExpanded={isExpanded}
        />
      )}
      <Modal modalVisible={modalVisible} setModalVisible={setModalVisible} onClose={() => {
        setCreateSubtopicVisible(false)
        setRenameTopicVisible(false)
      }}>
        <Pressable onPress={deleteTopicAndTab} style={styles.modalButton}>
          <Text>Удалить</Text>
        </Pressable>
        <Pressable
          onPress={() => setRenameTopicVisible(!renameTopicVisible)}
          style={styles.modalButton}
        >
          <Text style={renameTopicVisible && styles.underline}>
            Переименовать
          </Text>
        </Pressable>
        {renameTopicVisible && (
          <View style={styles.inputContainer}>
            <TextInput
              value={newTopicName}
              setValue={setNewTopicName}
              styles={styles.input}
            />
            <Pressable
              onPress={() => {
                if (newTopicName && newTopicName.trim()) {
                  renameCurrentTopic(id, newTopicName.trim()).then(() => {
                    // Обновляем локальное имя темы сразу
                    setTopicName(newTopicName.trim())
                    // Обновляем вкладки, если тема закреплена
                    if (isTab) {
                      getAllTabs().then(setAllTabs)
                    }
                    setRenameTopicVisible(false)
                    setModalVisible(false)
                  })
                }
              }}
              style={styles.readyButton}
            >
              <Text style={{ color: 'white', fontWeight: '500' }}>Готово</Text>
            </Pressable>
          </View>
        )}
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
                    // Разворачиваем тему, чтобы показать новую подтему
                    if (!isExpanded) {
                      setIsExpanded(true)
                    }
                    // Принудительно обновляем список подтем после создания
                    getChildTopics(id).then(setSubtopics)
                    // TODO показать сообщение об успехе
                  })
                }
              }}
              style={styles.readyButton}
            >
              <Text style={{ color: 'white', fontWeight: '500' }}>Готово</Text>
            </Pressable>
          </View>
        )}
      </Modal>
    </View>
  )
}
