import { useState, useEffect } from 'react';

import { createTopic as createTopicDB, getTopTopics, deleteTopic as deleteTopicDB, createNote as createNoteDB, deleteNote as deleteNoteDB, getNotesForTopic, getChildTopics } from '../database/databaseService';



export function useTopics(parentTopicId = null, init = []) {
    const [topics, setTopics] = useState(init)

    useEffect(() => {
        if (!parentTopicId) {
            getTopics().then(n => {
            setTopics(n)
        })
    } else {
        getChildTopics(parentTopicId).then(n => {
            setTopics(n)
        })
    }
    }, [parentTopicId])

    function createTopic(topicName, parentId = null, orderIndex = 0) {
        const newTopic = {
            name: topicName,
            notes: []
        }
        createTopicDB(topicName, parentId, orderIndex).then(res => {
            console.log('res of creating topic', res)
            console.log('parentId', parentId, 'newTopicsList', topics.concat({...newTopic, id: res}))
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
        getNotesForTopic(topicId).then(res => {
            setNotes(res)
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

async function getTopics() {
    try {
        let topics = await getTopTopics()
        console.log('got topics!', topics)
        return topics
    } catch (e) {
        console.error('an error occured during getting notes: ', e)
        return []
    }
}

const defaultTopics = [{"created_at": 1757265812, "id": 51, "name": "Моя новая тема2", "order_index": 0, "parent_id": null}, {"created_at": 1757266298, "id": 53, "name": "Моя новая тема4", "order_index": 0, "parent_id": null}, {"created_at": 1757269970, "id": 54, "name": "Таба", "order_index": 0, "parent_id": null}, {"created_at": 1757270286, "id": 55, "name": "Шишлл", "order_index": 0, "parent_id": null}, {"created_at": 1757270286, "id": 56, "name": "Шишлл", "order_index": 0, "parent_id": null}, {"created_at": 1757270286, "id": 57, "name": "Шишлл", "order_index": 0, "parent_id": null}, {"created_at": 1757270286, "id": 58, "name": "Шишлл", "order_index": 0, "parent_id": null}, {"created_at": 1757270286, "id": 59, "name": "Шишлл", "order_index": 0, "parent_id": null}, {"created_at": 1757270287, "id": 60, "name": "Шишлл", "order_index": 0, "parent_id": null}, {"created_at": 1757270287, "id": 61, "name": "Шишлл", "order_index": 0, "parent_id": null}]