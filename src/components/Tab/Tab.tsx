import { useContext, useEffect, useState } from 'react'

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
  Pressable,
} from 'react-native'

import type { Topic } from '@/types'

import { AppContext } from '../AppProvider'

interface TabProps {
  tab: Topic
}

export default function Tab({ tab }: TabProps) {
  const { currentTopic, setCurrentTopic } = useContext(AppContext)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (currentTopic === tab.id) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [currentTopic])

  return (
    <Pressable style={[styles.container, isActive && styles.active]} onPress={() => setCurrentTopic(tab.id)}>
      <Text>{tab.name}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 30,
    padding: 5,
    margin: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  active: {
    borderBottomWidth: 3,

  }
})
