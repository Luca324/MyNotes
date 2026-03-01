import { useContext, useEffect, useState } from 'react'

import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native'

import { Link } from 'expo-router'

import type { Topic } from '@/types'

import Modal from '@/components/Modal/Modal'
import { useTopics } from '@/hooks/useNotes'
import TextInput from '@/shared/TextInput'
import { removeTab, getAllTabs } from '@/database/databaseService'

import { AppContext } from '../AppProvider'
import { styles as topicStyles } from '../Topic/Topic.styles'

interface TabProps {
  tab: Topic
  deleteTopic: (id: number) => void
}

export default function Tab({ tab, deleteTopic: deleteTopicProp }: TabProps) {
  const { currentTopic, setCurrentTopic, allTabs, setAllTabs } = useContext(AppContext)
  const [isActive, setIsActive] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [createSubtopicVisible, setCreateSubtopicVisible] = useState(false)
  const [newSubtopicName, setNewSubtopicName] = useState('')

  const {
    topics: subtopics,
    createTopic: createSubtopic,
    deleteTopic: deleteSubtopic,
  } = useTopics(tab.id)

  useEffect(() => {
    if (currentTopic === tab.id) {
      console.log('active tab', tab.id)
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [currentTopic])

  // Очищаем поле при открытии формы создания подтемы
  useEffect(() => {
    if (createSubtopicVisible) {
      setNewSubtopicName('')
    }
  }, [createSubtopicVisible])

  function deleteTopicAndTab() {
    deleteTopicProp(tab.id)
    removeTab(tab.id).then(() => {
      getAllTabs().then(setAllTabs)
    })
  }

  function openTabSettings() {
    // Не показываем модальное окно для специальной вкладки "All"
    if (tab.id === 0) return
    setModalVisible(true)
  }

  return (
    <>
      <Pressable
        style={styles.container}
        onPress={() => setCurrentTopic(tab.id)}
        onLongPress={openTabSettings}
        delayLongPress={350}
      >
        <Text style={[isActive && styles.active]}>{tab.name}</Text>
      </Pressable>

      {tab.id !== 0 && (
        <Modal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onClose={() => setCreateSubtopicVisible(false)}
        >
        <Pressable onPress={deleteTopicAndTab} style={topicStyles.modalButton}>
          <Text>Удалить</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            removeTab(tab.id).then(() => {
              getAllTabs().then(setAllTabs)
              setModalVisible(false)
            })
          }}
          style={topicStyles.modalButton}
        >
          <Text>Открепить</Text>
        </Pressable>
        <Link
          href={{ pathname: '/noteEditor', params: { topicId: tab.id } }}
          asChild
        >
          <Pressable style={topicStyles.modalButton}>
            <Text>Добавить заметку</Text>
          </Pressable>
        </Link>
        <Pressable
          onPress={() => setCreateSubtopicVisible(!createSubtopicVisible)}
          style={topicStyles.modalButton}
        >
          <Text style={createSubtopicVisible && topicStyles.underline}>
            Создать подтему
          </Text>
        </Pressable>
        {createSubtopicVisible && (
          <View style={topicStyles.inputContainer}>
            <TextInput
              value={newSubtopicName}
              setValue={setNewSubtopicName}
              styles={topicStyles.input}
            />
            <Pressable
              onPress={() => {
                if (newSubtopicName) {
                  createSubtopic(tab.id, newSubtopicName).then(() => {
                    setNewSubtopicName('')
                    setCreateSubtopicVisible(false)
                    setModalVisible(false)
                  })
                }
              }}
              style={topicStyles.readyButton}
            >
              <Text>Готово</Text>
            </Pressable>
          </View>
        )}
        </Modal>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 36,
    paddingVertical: 8,
    paddingHorizontal: 8,
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 8
  },
  active: {
    fontWeight: 'bold'
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'normal'
  }
})
