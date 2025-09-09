import { useEffect, useState, useContext } from 'react';

import {
    StyleSheet, Text, View, ScrollView,
    useWindowDimensions
} from 'react-native';


// import TextInput from '@shared/TextInput';
import Topic from '@components/Topic/Topic';
import { getAllTabs } from '@database/databaseService';
import { useKeyboard } from '@react-native-community/hooks';

import { AppContext } from '@/components/AppProvider';
import Tab from '@/components/Tab/Tab';

export default function AppContent() {
    const keyboard = useKeyboard();
    const { height } = useWindowDimensions();
    const [bottomPadding, setBottomPadding] = useState(0);


    // useEffect(() => {
    //   if (keyboard.keyboardShown) {
    //     setBottomPadding(keyboard.keyboardHeight);
    //   } else {
    //     setBottomPadding(0);
    //   }
    // }, [keyboard.keyboardShown, keyboard.keyboardHeight]);

    const { topics, deleteTopic, allTabs, setAllTabs } = useContext(AppContext)
    const [newTopicName, setNewTopicName] = useState('')

    useEffect(() => {
        getAllTabs().then(setAllTabs)
    }, [setAllTabs, topics]);

    function setAsTab(topic) {
        console.log('new tabs:', [...allTabs, topic])
        setAllTabs(allTabs => [...allTabs, topic])
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.tabsScroll}
                contentContainerStyle={styles.tabsContainer}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {allTabs && allTabs.map(tab =>
                    <Tab key={`tab-${tab.id}`} tab={tab} />
                )}
            </ScrollView>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[
                    styles.scrollContent,
                    { 
                        paddingBottom: bottomPadding + 80
                    }
                ]}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
            >
                <Text>all topics:</Text>
                {topics && Array.isArray(topics) ? (
                    topics.map(topic => (
                        <Topic key={topic.id} topic={topic} deleteTopic={deleteTopic} setAsTab={() => setAsTab(topic)} />
                    ))
                ) : (
                    <Text>Загрузка...</Text>
                )}
            </ScrollView>
            {/* <View style={[
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
      </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tabsScroll: {
        maxHeight: 50,
        marginTop: 25,
    },
    tabsContainer: {
        flexDirection: 'row',
        gap: 15,
        paddingHorizontal: 16,
    },
    scroll: {
        flex: 1,
        width: "100%",
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 10, // Добавляем отступ сверху
        alignItems: 'flex-start', // Выравниваем по левому краю
    }
});