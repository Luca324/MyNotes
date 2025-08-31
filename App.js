import { useEffect, useState } from 'react';

import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';


import { StatusBar } from 'expo-status-bar';

import TextInput from '@shared/TextInput';

import Topic from './src/components/Topic/Topic';
import { useTopics, useNotes } from './src/hooks/useNotes';


export default function App() {
  const { topics, setTopics, createTopic, deleteTopic, renameTopic } = useTopics()
  const [newTopicName, setNewTopicName] = useState('')


  return (
    <View style={styles.container}>
     
      <ScrollView style={styles.scroll}>
        {topics && Array.isArray(topics) ? (
          topics.map(topic => (
            <Topic key={topic.id} topic={topic} deleteTopic={deleteTopic} />
          ))
        ) : (
          <Text>Загрузка...</Text>
        )}
      </ScrollView>
      <TextInput
        value={newTopicName}
        onChangeText={setNewTopicName}></TextInput>
      <Button
        title="create topic"
        onPress={() => newTopicName && createTopic(newTopicName)}></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    marginTop: 25,
    marginBottom: 25,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    width: "100%",
  }
});
