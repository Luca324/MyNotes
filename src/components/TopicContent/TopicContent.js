import { useState } from 'react'

import { StyleSheet, View, Pressable } from 'react-native'

import { useRouter, Link } from 'expo-router';

import { AddCircle } from '@/components/Icons/AddCircle'
import Note from '@/components/Note/Note'
import Topic from '@/components/Topic/Topic'
import { useTopics, useNotes } from '@/hooks/useNotes'
import TextInput from '@/shared/TextInput'

import { WriteANote } from '../Icons/WriteANote'

export default function TopicContent({ topic, deleteTopic }) {
    const router = useRouter();
    const { id, name } = topic
    const [newNoteText, setNewNoteText] = useState('')
    const { notes, setNotes, createNote, deleteNote } = useNotes(id)
    const { topics: subtopics, setTopics: setSubtopics, createTopic: createSubtopic, deleteTopic: deleteSubtopic, renameTopic: renameSubtopic } = useTopics(id)

    return (
        <View style={styles.topicContent}>
            {subtopics && subtopics.map(subtopic => (
                <Topic topic={subtopic} deleteTopic={deleteSubtopic} key={subtopic.id} />
            ))}
            {notes && notes.map(note => (
                <Note key={note.id} note={note} topic={id} deleteNote={deleteNote} />
            ))
            }
            <View style={styles.inputContainer}>
                <TextInput
                    value={newNoteText}
                    onChangeText={setNewNoteText}
                    styles={styles.input}
                ></TextInput>

                <Link href={{ pathname: '/noteEditor', params: { topicId: id } }} asChild>
                    <Pressable style={styles.addNote}>
                        <WriteANote />
                    </Pressable>
                </Link>
                <Pressable onPress={() => createSubtopic(id, newNoteText)} style={styles.addNote}>
                    <AddCircle />
                </Pressable>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    topicContent: {
        width: '98%',
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
})