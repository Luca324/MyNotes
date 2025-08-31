import { useEffect, useState } from 'react';

import { StyleSheet, Text, View, Button, Pressable } from 'react-native';

import { getChildrenForTopic } from '@database/databaseService';
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';


import { useNotes } from '../../hooks/useNotes';
import TextInput from '../../shared/TextInput';
import { Accordion, AccordionItem, App } from '../Accordion/Accordion';
import Note from '../Note/Note';

export default function Topic({ topic, deleteTopic }) {
    const { id, name } = topic
    const [children, setChildren] = useState([])
    const [newNoteText, setNewNoteText] = useState('')
    const { notes, setNotes, createNote, deleteNote } = useNotes(id)
    const open = useSharedValue(false);
    const onPress = () => {
        open.value = !open.value;
    };

    // useEffect(() => {
    // try {
    // getChildrenForTopic(id).then(setChildren)
    // сейчас это делается в useNotes. это пока нет subtopics. потом надо будет что-то думать
    // } catch (e) {}

    // }, [])

    return (
        <View style={styles.topic}>

            <View style={styles.topicHeader}>
                <Pressable onPress={onPress}>
                    <Text style={styles.idText}>id: {id}</Text>
                    <Text style={styles.nameText}>name: {name}</Text>
                </Pressable>

                <AccordionItem isExpanded={open} viewKey="Accordion">
                    {notes && notes.map(note => (
                        <Note note={note} key={note.id} />
                    ))}
                    <View style={styles.buttonContainer}>
                    <Button
                        style={styles.btn}
                        variant="negative"
                        title="delete topic"
                        onPress={() => deleteTopic(id)}
                    />
                    <Button
                        style={styles.btn}
                        title="add note"
                        onPress={() => createNote(newNoteText, id)}
                        color="#007AFF"
                    />
                </View>
                <TextInput
                    value={newNoteText}
                    onChangeText={setNewNoteText}
                ></TextInput>
                </AccordionItem>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topic: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginVertical: 2,
        marginHorizontal: 2,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    topicHeader: {
        marginBottom: 2,
    },
    idText: {
        fontSize: 14,
        color: '#666',
    },
    nameText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    btn: {
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: '#007AFF',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        gap: 8,
    },
});