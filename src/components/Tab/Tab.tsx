import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
} from 'react-native'

import type { Topic } from '@/types'

interface TabProps {
  tab: Topic
}

export default function Tab({ tab }: TabProps) {
  return (
    <View style={styles.container}>
      <Text>{tab.name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 30,
    padding: 5,
    margin: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderRadius: 3,
  },
})
