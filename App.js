import { useEffect, useState } from 'react';

import {
  StyleSheet, Text, View, Button, ScrollView,
  useWindowDimensions
} from 'react-native';



import Topic from '@components/Topic/Topic';
import { useKeyboard } from '@react-native-community/hooks';
import TextInput from '@shared/TextInput';

import { useTopics } from '@/hooks/useNotes';

import { getAllTabs } from './src/database/databaseService';


export default function App() {
  const keyboard = useKeyboard();
  const { height } = useWindowDimensions();
  const [bottomPadding, setBottomPadding] = useState(0);

  useEffect(() => {
    if (keyboard.keyboardShown) {
      setBottomPadding(keyboard.keyboardHeight);
    } else {
      setBottomPadding(0);
    }
  }, [keyboard.keyboardShown, keyboard.keyboardHeight]);

  const { topics, setTopics, createTopic, deleteTopic, renameTopic } = useTopics()
  const [newTopicName, setNewTopicName] = useState('')
  const [allTabs, setAllTabs] = useState([])
  useEffect(() => {
    getAllTabs().then(setAllTabs)
  }, []);

  function setAsTab(topic) {
    console.log('new tabs:', [...allTabs, topic])
    setAllTabs(allTabs => [...allTabs, topic])
  }

  return (
    <View style={styles.container}>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding + 80 } // 80 - высота вашего inputContainer
        ]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"

      ><Text>all tabs:</Text>{allTabs && allTabs.map(tab =>
        <Topic key={tab.id} topic={tab} deleteTopic={deleteTopic} />
      )}
        <Text>all topics:</Text>
        {topics && Array.isArray(topics) ? (
          topics.map(topic => (
            <Topic key={topic.id} topic={topic} deleteTopic={deleteTopic} setAsTab={() => setAsTab(topic)} />
          ))
        ) : (
          <Text>Загрузка...</Text>
        )}
      </ScrollView>
      <View style={[
        styles.inputContainer,
        { marginBottom: bottomPadding }
      ]}>
        <TextInput
          style={
            styles.inputContainer}
          value={newTopicName}
          onChangeText={setNewTopicName}
        />
        <Button
          title="create topic"
          onPress={() => newTopicName && createTopic(newTopicName)}
        />
      </View>
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
  },
  inputContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, // добавьте отступ снизу равный высоте inputContainer
  }
});
