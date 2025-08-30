import { StyleSheet, Text, View, Button, TextInput } from 'react-native';


import { StatusBar } from 'expo-status-bar';
import { useTopics, useNotes } from './src/hooks/useNotes';
import { useEffect, useState } from 'react';
import Topic from './src/components/Topic/Topic';

export default function App() {
  const { topics, setTopics, createTopic, deleteTopic, renameTopic } = useTopics()
  const [newTopicName, setNewTopicName] = useState('')

  return (
    <View style={styles.container}>
      <Text></Text>
      {topics.map(topic => (<>
      <Topic topic={topic}/>
        
      </>
      ))}
      <TextInput
          style={styles.input}
        value={newTopicName}
        onChangeText={setNewTopicName}
        defaultValue='enter sth'></TextInput>
        <Button
        title="create topic"
        onPress={() => newTopicName && createTopic(newTopicName)}></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    width: '100%',
    borderWidth: 1,
    padding: 10,
  },
});
