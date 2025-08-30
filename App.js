import { useEffect, useState } from 'react';

import { StyleSheet, Text, View, ScrollView } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';
import { StatusBar } from 'expo-status-bar';

import TextInput from '@shared/TextInput';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

import Topic from '@src/components/Topic/Topic';
import { useTopics, useNotes } from '@src/hooks/useNotes';


import './global.css';

export default function App() {
  const { topics, setTopics, createTopic, deleteTopic, renameTopic } = useTopics()
  const [newTopicName, setNewTopicName] = useState('')


  return (

    <GluestackUIProvider mode="light">
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={newTopicName}
          onChangeText={setNewTopicName}></TextInput>

        <Button variant="outline" size="md" action="primary" onPress={() => newTopicName && createTopic(newTopicName)}>
          <ButtonText>create topic</ButtonText>
        </Button>
        <ScrollView style={styles.scroll}>
          {topics && Array.isArray(topics) ? (
            topics.map(topic => (
              <Topic key={topic.id} topic={topic} deleteTopic={deleteTopic} />
            ))
          ) : (
            <Text>Загрузка...</Text>
          )}
        </ScrollView>

        <StatusBar style="auto" />
      </View>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {

    marginTop: 25,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    width: "95%",

  }
});
