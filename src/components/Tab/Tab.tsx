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
      console.log('active tab', tab.id)
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [currentTopic])

  return (
    <Pressable style={styles.container} onPress={() => setCurrentTopic(tab.id)}>
      <Text style={[isActive && styles.active]}>{tab.name}</Text>
    </Pressable>
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
