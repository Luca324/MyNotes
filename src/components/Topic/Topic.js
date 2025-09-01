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


import { Accordion, AccordionItem, App } from '@/components/Accordion/Accordion';
import { AddCircle } from '@/components/Icons/AddCircle';
import { Trash } from '@/components/Icons/Trash';
import Note from '@/components/Note/Note';
import { useTopics, useNotes } from '@/hooks/useNotes';
import TextInput from '@/shared/TextInput';

import { WriteANote } from '../Icons/WriteANote';


export default function Topic({ topic, deleteTopic }) {
    const { id, name } = topic
    const [newNoteText, setNewNoteText] = useState('')
    const { notes, setNotes, createNote, deleteNote } = useNotes(id)
    const { topics: subtopics, setTopics: setSubtopics, createTopic: createSubtopic, deleteTopic: deleteSubtopic, renameTopic: renameSubtopic } = useTopics(id)

    const open = useSharedValue(false);
    const onPress = () => {
        open.value = !open.value;
    };

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
                {subtopics && subtopics.map(subtopic => (
                    <Topic topic={subtopic} deleteTopic={deleteSubtopic} key={subtopic.id} />
                ))}
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
                        <WriteANote />
                    </Pressable>
                    <Pressable onPress={() => createSubtopic(newNoteText, id)} style={styles.addNote}>
                        <AddCircle />
                    </Pressable>
                </View>
            </AccordionItem>
        </View>
    );
}

const styles = StyleSheet.create({
    topic: {
        width: '100%',
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
        gap: 8,
    },
    addNote: {
        width: 24,
        color: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        margin: 12,
        padding: 10,
        width: '70%',
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