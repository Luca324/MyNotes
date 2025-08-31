import { useEffect, useState } from 'react';

import { StyleSheet, Text, View, Button, Pressable, Image } from 'react-native';

import { getChildrenForTopic } from '@database/databaseService';
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';


import { useNotes } from '../../hooks/useNotes';
import TextInput from '../../shared/TextInput';
import { Accordion, AccordionItem, App } from '../Accordion/Accordion';
import { AddCircle } from '../Icons/AddCircle';
import { Trash } from '../Icons/Trash';
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

            <Pressable onPress={onPress} style={styles.topicHeader}>
                <Text style={styles.nameText}>{name}</Text>
                <View style={styles.horizontal}>
                    <Text style={styles.idText}>id: {id}</Text>
                    <Pressable onPress={() => deleteTopic(id)} style={styles.btn}>
                        <Trash />
                    </Pressable>
                </View>
            </Pressable>

            <AccordionItem isExpanded={open} viewKey="Accordion">
                {notes && notes.map(note => (
                    <Note note={note} deleteNote={deleteNote} key={note.id} />
                ))}
                <View style={styles.inputContainer}>
                    <TextInput
                        value={newNoteText}
                        onChangeText={setNewNoteText}
                        styles={styles.input}
                    ></TextInput>
                    <Pressable onPress={() => createNote(newNoteText, id)} style={styles.addNote}>
                        <AddCircle />
                    </Pressable>

                </View>
            </AccordionItem>
        </View>
    );
}

const styles = StyleSheet.create({
    topic: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginVertical: 2,
        marginHorizontal: 2,
        padding: 10,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
        gap: 8,
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
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        gap: 0,
    },
    addNote: {
        width: 10,
        color: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        margin: 12,
        padding: 10,
        width: '85%',
        backgroundColor: '#F4F4F4',
        borderWidth: 0,
        borderRadius: 4,
        height: 35,
    },
    horizontal: {
        flexDirection: 'row',
        gap: 8,
    }
});