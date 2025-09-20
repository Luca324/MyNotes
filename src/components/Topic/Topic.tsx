import { useContext, useState } from 'react'

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
import TopicContent from '@/components/TopicContent/TopicContent'
import type { Topic as TopicType } from '@/types'

import { addTab } from '../../database/databaseService'
import { AppContext } from '../AppProvider'
import { ChevronDown } from '../Icons/ChevronDown'
import { ChevronUp } from '../Icons/ChevronUp'

import { styles } from './Topic.styles'

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
          <Text style={styles.idText}>id: {id}</Text>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <TopicContent topic={topic} deleteTopic={deleteTopic} depth={depth} />
      )}
      <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
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
      </Modal>
    </View>
  )
}
