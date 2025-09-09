import { useContext } from 'react'

import { StyleSheet, Text, View, Pressable } from 'react-native'

import { useSharedValue } from 'react-native-reanimated'

import { AccordionItem } from '@/components/Accordion/Accordion'
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
  setAsTab?: null | ((topic: TopicType) => void)
}

export default function Topic({
  topic,
  deleteTopic,
  setAsTab = null,
}: TopicProps) {
  const { id, name } = topic
  const { allTabs } = useContext(AppContext)
  const open = useSharedValue(false)
  const onPress = () => {
    open.value = !open.value
  }

  const isTab = allTabs.filter((tab) => tab.id === id).length

  return (
    <View style={styles.topic}>
      <Pressable onPress={onPress} style={styles.topicHeader}>
        <Text style={styles.nameText}>{name}</Text>
        <View style={styles.horizontal}>
          <Text style={styles.idText}>id: {id}</Text>
          <Pressable onPress={() => deleteTopic(id)} style={styles.btn}>
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

      <AccordionItem isExpanded={open} viewKey="Accordion">
        <TopicContent topic={topic} deleteTopic={deleteTopic} />
      </AccordionItem>
    </View>
  )
}
