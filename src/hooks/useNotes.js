import { useState, useEffect } from 'react';

import { createTopic as createTopicDB, getTopTopics, deleteTopic as deleteTopicDB, createNote as createNoteDB, deleteNote as deleteNoteDB, getChildrenForTopic } from '../database/databaseService';



export function useTopics(init = []) {
    const [topics, setTopics] = useState(init)

    useEffect(() => {
        getNotes().then(n => {
            console.log('n', n)
            console.log('n', typeof n)
            n.map(el => console.log(el))
            setTopics(n)
        })
    }, [])

    function createTopic(topicName) {
        const newTopic = {
            name: topicName,
            notes: []
        }
        createTopicDB(topicName).then(res => {
            console.log('res of creating topic', res)
            setTopics(topics.concat({...newTopic, id: res}))
        })

    }

    function deleteTopic(topicId) {
        console.log('deleting id:', topicId)
        deleteTopicDB(topicId).then(res => {
            console.log('res of deleting topic', res)
            setTopics(topics.filter(topic => {
                return topic.id !== topicId
            }))
        })

    }

    function renameTopic(topicId, newName) {
        setTopics(topics.reduce(topic => topic.id == topicId ? { ...topic, name: newName } : topic, []))
    }


    return { topics, setTopics, createTopic, deleteTopic, renameTopic }
}

export function useNotes(topicId = 0) {
    const [notes, setNotes] = useState([])

    useEffect(() => {
        getChildrenForTopic(topicId).then(res => {
            setNotes(res) // тут должен быть запрос к бд на получение всех дочерних элементов темы

        })
    }, [topicId])


    function createNote(text, topicId) {
        const newNote = {
            name: text,
            created_at: Date.now(),
        }
        createNoteDB(text, topicId).then(res => {
            console.log('res of creating note', res)
            setNotes(notes.concat({...newNote, id: res}))
        })
    }

    function deleteNote(noteId) {
        deleteNoteDB(noteId).then(res => {
            console.log('res of deleting note', res)
            setNotes(notes.filter(note => note.id !== noteId))

        })
    }

    return {
        notes,
        setNotes,
        createNote,
        deleteNote
    }
}

async function getNotes() {
    try {
        let notes = await getTopTopics()
        console.log('got notes!')
        return notes
    } catch (e) {
        console.error('an error occured during getting notes: ', e)
        return []
    }
}
// export async function saveNotes(notes) {
//     try {
//         const json = JSON.stringify(notes)
//         AsyncStorage.removeItem('notes').then(() => {
//             AsyncStorage.setItem('notes', json)
//         }
//         )

//     } catch (e) {
//         console.error('an error occured during saving notes: ', e)
//     }
// }

const defaultNotes = {
    topics: [
        {
            id: 1,
            name: 'education',
            notes: [
                {
                    text: 'first: common education',
                    date: Date.now()
                },
                {
                    text: 'second: high education',
                    date: Date.now()
                }
            ]
        },
        {
            id: 2,
            name: 'work',
            notes: [
                {
                    text: 'nobody likes it',
                    date: Date.now()
                },
                {
                    text: 'but everybody does',
                    date: Date.now()
                }
            ]
        }
    ]
}