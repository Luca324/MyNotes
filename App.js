import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
const defaultNotes = {
  topics: [
    {
      id: 1,
      name: 'ceducation',
      notes: [
        {
          text: 'first: common education',
          date: Date.now()
        },
        {
          text: 'second: high education',
          date: Date.now()
        }
      ]
    },
    {
      id: 1,
      name: 'work',
      notes: [
        {
          text: 'nobody likes it',
          date: Date.now()
        },
        {
          text: 'but everybody does',
          date: Date.now()
        }
      ]
    }
  ]
}

import { StatusBar } from 'expo-status-bar';
import { useTopics, useNotes, saveNotes } from './hooks/useNotes';
import { useEffect, useState } from 'react';

export default function App() {
  const { topics, setTopics, createTopic, deleteTopic, renameTopic } = useTopics()
  // const {
  //   notes,
  //   setNotes,
  //   createNote,
  //   deleteNote
  // } = useNotes()
  const [newTopicName, setNewTopicName] = useState('')
  useEffect(() => {
    saveNotes(defaultNotes)
  }, [])

  return (
    <View style={styles.container}>
      <Text></Text>
      {topics.map(topic => (<>
        <Text key={topic.id + 'id'}>id: {topic.id}</Text>
        <Text key={topic.id + 'name'}> name: {topic.name}</Text>
        <Text key={topic.id + 'notes'}> notes: {JSON.stringify(topic.notes)}</Text>
      </>
      ))}
      <TextInput
          style={styles.input}
        value={newTopicName}
        onChangeText={setNewTopicName}
        defaultValue='enter sth'></TextInput>
        <Button
        onPress={createTopic(newTopicName)}></Button>
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
