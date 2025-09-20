import { StyleSheet, Text, View, Pressable } from 'react-native';

import { Link } from 'expo-router';

import { formatDate } from '@utils/sharedUtils';

import { MoreVertical } from '../Icons/MoreVertical';
import { Trash } from '../Icons/Trash';

export default function Note({ note, deleteNote, topicId }) {
    function openNoteSettings() {
        console.log(openNoteSettings)
    }

    return (
        <Link href={{ pathname: '/noteEditor', params: { topicId: topicId, noteId: note.id } }} asChild>
            <Pressable style={styles.noteWrapper}>
                <View style={styles.note}>
                    <View style={styles.header}>
                        <Text style={styles.id}>id: {note.id}</Text>
                        <Text style={styles.id}>{formatDate(note.created_at)}</Text>
                        <Pressable onPress={() => deleteNote(note.id)} style={styles.btn}>
                            <Trash />
                        </Pressable>
                        <Pressable onPress={openNoteSettings} style={styles.btn}>
                            <MoreVertical />
                        </Pressable>
                    </View>
                    {note.title && <Text style={styles.title}>{note.title}</Text>}
                    {note.content && <Text>{note.content}</Text>}
                </View>
            </Pressable>
        </Link>
    )
}

const styles = StyleSheet.create({
    noteWrapper: {
        width: "100%",

    },
    note: {
        width: "100%",
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginVertical: 2,
        marginHorizontal: 2,
        padding: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    id: {
        fontSize: 14,
        color: '#666',
    },
    title: {
        fontWeight: 'bold',
    }
});