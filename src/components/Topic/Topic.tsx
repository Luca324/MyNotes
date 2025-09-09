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

interface TopicProps {
  topic: TopicType
  deleteTopic: (id: number) => void
  setAsTab?: null | ((topic: TopicType) => void)
}

export default function Topic({ topic, deleteTopic, setAsTab = null }: TopicProps) {
  const { id, name } = topic
  const { allTabs } = useContext(AppContext)
  const open = useSharedValue(false)
  const onPress = () => {
    open.value = !open.value
  }

  const isTab = allTabs.filter(tab => tab.id === id).length

  return (
    <View style={styles.topic}>
      <Pressable onPress={onPress} style={styles.topicHeader}>
        <Text style={styles.nameText}>{name}</Text>
        <View style={styles.horizontal}>
          <Text style={styles.idText}>id: {id}</Text>
          <Pressable onPress={() => deleteTopic(id)} style={styles.btn}>
            <Trash />
          </Pressable>
          {!isTab && <Pressable
            onPress={() => {
              if (setAsTab) setAsTab(topic)
              addTab(id)
            }}
            style={styles.btn}
          >
            <AddCircle />
          </Pressable>}
        </View>
      </Pressable>

      <AccordionItem isExpanded={open} viewKey="Accordion">
        <TopicContent topic={topic} deleteTopic={deleteTopic} />
      </AccordionItem>
    </View>
  )
}

const styles = StyleSheet.create({
  topic: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 2,
    marginHorizontal: 2,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    gap: 8,
  },
  idText: {
    fontSize: 14,
    color: '#666',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  btn: {
    width: 24,
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    margin: 12,
    padding: 10,
    width: '70%',
    backgroundColor: '#F4F4F4',
    borderWidth: 0,
    borderRadius: 4,
    height: 35,
  },
  horizontal: {
    flexDirection: 'row',
    gap: 8,
  },
})
