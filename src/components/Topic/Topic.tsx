import { useContext, useState } from 'react'

import { StyleSheet, Text, View, Pressable } from 'react-native'

import { getDepthColor, getTextColor } from 'colorSchemes'

import { AddCircle } from '@/components/Icons/AddCircle'
import { Trash } from '@/components/Icons/Trash'
import TopicContent from '@/components/TopicContent/TopicContent'
import type { Topic as TopicType } from '@/types'

import { addTab } from '../../database/databaseService'
import { AppContext } from '../AppProvider'

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
  const backgroundColor = getDepthColor(depth);
  const color = getTextColor(depth);
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

  return (
    <View style={[styles.topic, { backgroundColor }]}>
      <Pressable onPress={onPress} style={styles.topicHeader}>
        <Text style={[styles.nameText, { color }]}>{name}</Text>
        <View style={styles.horizontal}>
          <Text style={styles.idText}>id: {id}</Text>
          <Pressable onPress={deleteTopicAndTab} style={styles.btn}>
            <Trash />
          </Pressable>
          {!isTab && (
            <Pressable
              onPress={() => {
                addTab(id).then(() => {
                  if (setAsTab) setAsTab(topic)
                })
              }}
              style={styles.btn}
            >
              <AddCircle />
            </Pressable>
          )}
        </View>
      </Pressable>

      {isExpanded && <TopicContent topic={topic} deleteTopic={deleteTopic} depth={depth}/>}
    </View>
  )
}
