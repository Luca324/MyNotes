import { StyleSheet, Text, View, Button, TextInput, Pressable } from 'react-native';

import { formatDate } from '@utils/sharedUtils';

import { Trash } from '../Icons/Trash';

export default function Note({ note, deleteNote }) {
    // console.log('note', note)
    return (
        <View style={styles.note}>
            <View style={styles.header}>
                <Text style={styles.id}>id: {note.id}</Text>
                <Text style={styles.id}>{formatDate(note.created_at)}</Text>
                <Pressable onPress={() => deleteNote(note.id)} style={styles.btn}>
                    <Trash />
                </Pressable>
            </View>
            <Text>{note.name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    note: {
        width: "100%",
        backgroundColor: '#ffffff',
        borderRadius: 5,
        marginVertical: 2,
        marginHorizontal: 2,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    id: {
        fontSize: 14,
        color: '#666',
    }
});