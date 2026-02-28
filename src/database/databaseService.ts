import { getDBConnection } from '@database/database.js'

import type { Note, Topic } from '@/types'

// Базовая функция для выполнения любого запроса
const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const db = await getDBConnection()

    // Для SELECT запросов используем getAllAsync
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      return await db.getAllAsync(query, params)
    }

    // Для остальных запросов (INSERT, UPDATE, DELETE) используем runAsync
    return await db.runAsync(query, params)
  } catch (error) {
    console.error(`Ошибка выполнения запроса "${query}":`, error)
    throw error
  }
}

// TOPICS
export const createTopic = async (
  parentId: number | null = null,
  name: string,
  orderIndex: number = 0
): Promise<number> => {
  console.log('name', name, parentId)
  const query = `
    INSERT INTO topics (name, parent_id, order_index)
    VALUES (?, ?, ?);
  `
  const result = await executeQuery(query, [name, parentId, orderIndex])
  return result.lastInsertRowId // В expo-sqlite используется lastInsertRowId вместо insertId
}

export const getChildTopics = async (
  parentTopicId: number
): Promise<Topic[]> => {
  const query = `
    SELECT * FROM topics
    WHERE parent_id IS ?
    ORDER BY order_index ASC;
  `
  return await executeQuery(query, [parentTopicId])
}

// NOTES
export const getNoteById = async (noteId: number): Promise<Note | null> => {
  const query = `SELECT * FROM notes WHERE id = ?;`
  const results = await executeQuery(query, [noteId])
  return results.length > 0 ? results[0] : null
}

export const createNote = async (
  topicId: number,
  content: string,
  title: string = '',
  orderIndex: number = 0
): Promise<number> => {
  const query = `
    INSERT INTO notes (content, title, topic_id, order_index)
    VALUES (?, ?, ?, ?);
  `
  // Передаем null вместо пустой строки для title, если он пустой
  const titleValue = title && title.trim() ? title.trim() : null
  const params = [content || null, titleValue, topicId, orderIndex]
  console.log('createNote - title received:', JSON.stringify(title))
  console.log('createNote - titleValue:', JSON.stringify(titleValue))
  console.log('createNote - params:', params.map(p => typeof p === 'string' ? JSON.stringify(p) : p))
  const result = await executeQuery(query, params)
  console.log('createNote - result:', result)
  return result.lastInsertRowId
}

export const getNotesForTopic = async (
  parentTopicId: number
): Promise<Note[]> => {
  const query = `
    SELECT * FROM notes
    WHERE topic_id IS ?
    ORDER BY order_index ASC;
  `
  const notes = await executeQuery(query, [parentTopicId])
  console.log('getNotesForTopic - retrieved notes:', notes.map(n => ({ id: n.id, title: n.title, titleLength: n.title?.length })))
  return notes
}

// TABS
export const addTab = async (
  topicId: number,
  orderIndex: number = 0
): Promise<number> => {
  const query = `
    INSERT OR REPLACE INTO tabs (topic_id, order_index)
    VALUES (?, ?);
  `
  const result = await executeQuery(query, [topicId, orderIndex])
  return result.lastInsertRowId
}

export const getAllTabs = async (): Promise<Topic[]> => {
  const query = `
    SELECT topics.id, topics.name, topics.parent_id, topics.order_index, topics.created_at
    FROM tabs t
    INNER JOIN topics ON t.topic_id = topics.id
    ORDER BY t.order_index ASC;
  `
  return await executeQuery(query)
}

export const removeTab = async (topicId: number): Promise<void> => {
  const query = `DELETE FROM tabs WHERE topic_id = ?;`
  await executeQuery(query, [topicId])
}

// Дополнительные функции
export const getTopicById = async (topicId: number): Promise<Topic | null> => {
  const query = `SELECT * FROM topics WHERE id = ?;`
  const results = await executeQuery(query, [topicId])
  return results.length > 0 ? results[0] : null
}

export const updateNote = async (
  noteId: number,
  content?: string,
  title?: string
): Promise<void> => {
  // Собираем поля для обновления и параметры
  const updates: string[] = [];
  const params: any[] = [];
  
  if (title !== undefined) {
    updates.push('title = ?');
    params.push(title);
  }
  
  if (content !== undefined) {
    updates.push('content = ?');
    params.push(content);
  }
  
  if (updates.length === 0)  return
  
  // Добавляем noteId в параметры
  params.push(noteId);
  
  const query = `UPDATE notes SET ${updates.join(', ')} WHERE id = ?;`;
  const result = await executeQuery(query, params);
  return result.lastInsertRowId

}

export const deleteNote = async (noteId: number): Promise<void> => {
  const query = `DELETE FROM notes WHERE id = ?;`
  const result = await executeQuery(query, [noteId])
  return result.lastInsertRowId
}

export const deleteTopic = async (topicId: number): Promise<void> => {
  const query = `DELETE FROM topics WHERE id = ?;`
  const result = await executeQuery(query, [topicId])
  return result.lastInsertRowId
}

export const getFirstAsync = async (query: string, params: any[] = []) => {
  try {
    const db = await getDBConnection()
    return await db.getFirstAsync(query, params)
  } catch (error) {
    console.error(`Ошибка выполнения запроса "${query}":`, error)
    throw error
  }
}
