import { useEffect, useState } from 'react';
import { Button, ButtonText } from '@/components/ui/button';

import { StyleSheet, Text, View } from 'react-native';

import { getChildrenForTopic } from '@database/databaseService';

import { useNotes } from '../../hooks/useNotes';
import TextInput from '../../shared/TextInput';
import Note from '../Note/Note';

export default function Topic({ topic, deleteTopic }) {
    const { id, name } = topic
    const [children, setChildren] = useState([])
    const [newNoteText, setNewNoteText] = useState('')
    const { notes, setNotes, createNote, deleteNote } = useNotes(id)

    // useEffect(() => {
    // try {
    // getChildrenForTopic(id).then(setChildren)
    // сейчас это делается в useNotes. это пока нет subtopics. потом надо будет что-то думать
    // } catch (e) {}

    // }, [])

    return (
        <View style={styles.topic}>
            <View style={styles.topicHeader}>
                <Text style={styles.idText}>id: {id}</Text>
                <Text style={styles.nameText}>name: {name}</Text>
                {notes && notes.map(note => (
                    <Note note={note} key={note.id} />
                ))}
                <View style={styles.buttonContainer}>
                    <Button variant="solid" size="md" action="negative" onPress={() => deleteTopic(id)}>
                        <ButtonText>delete topic</ButtonText>
                    </Button>
                    <Button variant="solid" size="md" action="positive" onPress={() => createNote(newNoteText, id)}>
                        <ButtonText>add note</ButtonText>
                    </Button>
                </View>
                <TextInput
                    value={newNoteText}
                    onChangeText={setNewNoteText}
                ></TextInput>
            </View>
            <View>{children}</View>
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
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 12,
    },
    idText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    nameText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
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