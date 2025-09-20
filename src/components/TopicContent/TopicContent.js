
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
        width: '100%',
    },
})