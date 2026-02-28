import { useEffect, useState, useContext } from 'react';

import { StyleSheet, Text, View, ScrollView, Pressable, Button} from 'react-native';

import {Link} from 'expo-router'

import Topic from '@components/Topic/Topic';
import { useKeyboard } from '@react-native-community/hooks';

import { AppContext } from '@/components/AppProvider';
import { FilePlus } from '@/components/Icons/FilePlus';
import Modal from '@/components/Modal/Modal';
import Note from '@/components/Note/Note';
import Tab from '@/components/Tab/Tab';
import { getChildTopics, getNotesForTopic } from '@/database/databaseService';
import { useNotes, useTopics } from '@/hooks/useNotes';
import TextInput from '@/shared/TextInput';

export default function AppContent() {
    const keyboard = useKeyboard();
    const [bottomPadding, setBottomPadding] = useState(0);

    useEffect(() => {
        if (keyboard.keyboardShown) {
            setBottomPadding(keyboard.keyboardHeight);
        } else {
            setBottomPadding(0);
        }
    }, [keyboard.keyboardShown, keyboard.keyboardHeight]);

    const { currentTopic, allTabs, setAllTabs } = useContext(AppContext)
    const { topics, setTopics, createTopic, deleteTopic, renameTopic } = useTopics(currentTopic)

    const [newTopicName, setNewTopicName] = useState('')
    const { notes, setNotes, createNote, deleteNote } = useNotes(currentTopic)

    const [createTopicModalVisible, setCreateTopicModalVisible] = useState(false)

    useEffect(() => {
        getChildTopics(currentTopic).then(setTopics)
        if (currentTopic !== 0) getNotesForTopic(currentTopic).then(setNotes)
    }, [currentTopic])

    // Очищаем поле при открытии модального окна
    useEffect(() => {
        if (createTopicModalVisible) {
            setNewTopicName('')
        }
    }, [createTopicModalVisible])

    function setAsTab(topic) {
        console.log('new tab:', topic)
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
                <Tab key='tab-0' tab={{ id: 0, name: 'All', order_index: 0, topic_id: null }} deleteTopic={() => {}} />

                {allTabs && allTabs.map(tab =>
                    <Tab key={`tab-${tab.id}`} tab={tab} deleteTopic={deleteTopic} />
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
                {topics && Array.isArray(topics) ? (
                    topics.map(topic => (
                        <Topic key={topic.id} topic={topic} deleteTopic={deleteTopic} setAsTab={() => setAsTab(topic)} />
                    ))
                ) : (
                    <Text>Загрузка...</Text>
                )}
                {notes && notes.map(note => (
                    <Note note={note} deleteNote={deleteNote} key={note.id} />
                ))}
            </ScrollView>
            
            <Pressable style={styles.createTopic} onPress={() => setCreateTopicModalVisible(true)}>
                <FilePlus/>
            </Pressable>

            { currentTopic === 0 ? <></> : 
            <Link style={styles.createNote}
                      href={{ pathname: '/noteEditor', params: { topicId: currentTopic } }}
                      asChild
                    >
            <Pressable>
                <Text style={styles.createNoteText}>+</Text>
            </Pressable>
            </Link>}

            {createTopicModalVisible && <Modal modalVisible={createTopicModalVisible} setModalVisible={setCreateTopicModalVisible}>
                <TextInput
                    style={styles.inputContainer}
                    value={newTopicName}
                    setValue={setNewTopicName}
                />
                <Button
                    title="create topic"
                    onPress={() => {
                        if (newTopicName) {
                            createTopic(currentTopic, newTopicName).then(() => {
                                setNewTopicName('')
                                setCreateTopicModalVisible(false)
                            })
                        }
                    }}
                />
            </Modal>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        marginTop: 36,
    },
    tabsScroll: {
        maxHeight: 36,
        marginBottom: 8,
    },
    tabsContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
    },
    scroll: {
        flex: 1,
        width: "100%",
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        alignItems: 'flex-start', // Выравниваем по левому краю
    },
    createNote: {
        width: 50,
        height: 50,
        borderRadius: '50%',
        position: 'absolute',
        bottom: 40,
        right: 20,
        backgroundColor: '#818cf8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createNoteText: {
        color: 'white',
        fontSize: 32
    },
    createTopic: {
        width: 50,
        height: 50,
        borderRadius: '50%',
        position: 'absolute',
        bottom: 40,
        left: 20,
        backgroundColor: '#818cf8',
        justifyContent: 'center',
        alignItems: 'center',
    },
});