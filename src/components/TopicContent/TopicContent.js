
import { StyleSheet, View } from 'react-native'


import Note from '@/components/Note/Note'
import Topic from '@/components/Topic/Topic'
import { useNotes } from '@/hooks/useNotes'


export default function TopicContent({ topic, depth, subtopics, deleteSubtopic }) {
    const { id } = topic
    const { notes, deleteNote } = useNotes(id)

    return (
        <View style={styles.topicContent}>
            {subtopics && subtopics.map(subtopic => (
                <Topic topic={subtopic} deleteTopic={deleteSubtopic} key={subtopic.id} depth={depth + 1} />
            ))}
            {notes && notes.map(note => (
                <Note key={note.id} note={note} topic={id} deleteNote={deleteNote} />
            ))
            }
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