import { getDBConnection } from "@database/database.js";

import type { Note, Topic } from "@/types";
// Базовая функция для выполнения любого запроса
const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const db = await getDBConnection();
    
    // Для SELECT запросов используем getAllAsync
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      return await db.getAllAsync(query, params);
    }
    
    // Для остальных запросов (INSERT, UPDATE, DELETE) используем runAsync
    return await db.runAsync(query, params);
  } catch (error) {
    console.error(`Ошибка выполнения запроса "${query}":`, error);
    throw error;
  }
};

// TOPICS
export const createTopic = async (name: string, parentId: number | null = null, orderIndex: number = 0): Promise<number> => {
  const query = `
    INSERT INTO topics (name, parent_id, order_index)
    VALUES (?, ?, ?);
  `;
  const result = await executeQuery(query, [name, parentId, orderIndex]);
  return result.lastInsertRowId; // В expo-sqlite используется lastInsertRowId вместо insertId
};

export const getTopTopics = async (): Promise<Topic[]> => {
  const query = `
    SELECT * FROM topics
    WHERE parent_id IS ?
    ORDER BY order_index ASC;
  `;
  return await executeQuery(query, [null]);
};

export const getChildTopics = async (parentTopicId: number): Promise<Topic[]> => {
  const query = `
    SELECT * FROM topics
    WHERE parent_id IS ?
    ORDER BY order_index ASC;
  `;
  return await executeQuery(query, [parentTopicId]);
};

// NOTES
export const createNote = async (content: string, topicId: number, orderIndex: number = 0): Promise<number> => {
  const query = `
    INSERT INTO notes (content, topic_id, order_index)
    VALUES (?, ?, ?);
  `;
  const result = await executeQuery(query, [content, topicId, orderIndex]);
  return result.lastInsertRowId;
};

export const getNotesForTopic = async (parentTopicId: number): Promise<Note[]> => {
  const query = `
    SELECT * FROM notes
    WHERE topic_id IS ?
    ORDER BY order_index ASC;
  `;
  return await executeQuery(query, [parentTopicId]);
}

// TABS
export const addTab = async (topicId: number, orderIndex: number = 0): Promise<number> => {
  const query = `
    INSERT OR REPLACE INTO tabs (topic_id, order_index)
    VALUES (?, ?);
  `;
  const result = await executeQuery(query, [topicId, orderIndex]);
  return result.lastInsertRowId;
};

export const getAllTabs = async (): Promise<Topic[]>=> {
  const query = `
    SELECT t.*, topics.name
    FROM tabs t
    INNER JOIN topics ON t.topic_id = topics.id
    ORDER BY t.order_index ASC;
  `;
  return await executeQuery(query);
};

// Дополнительные функции
export const getTopicById = async (topicId: number): Promise<Topic | null> => {
  const query = `SELECT * FROM topics WHERE id = ?;`;
  const results = await executeQuery(query, [topicId]);
  return results.length > 0 ? results[0] : null;
};

export const updateNote = async (noteId: number, title: string, content: string): Promise<void> => {
  const query = `UPDATE notes SET title = ?, content = ? WHERE id = ?;`;
  await executeQuery(query, [title, content, noteId]);
};

export const deleteNote = async (noteId: number): Promise<void> => {
  const query = `DELETE FROM notes WHERE id = ?;`;
  await executeQuery(query, [noteId]);
};

export const deleteTopic = async (topicId: number): Promise<void> => {
  const query = `DELETE FROM topics WHERE id = ?;`;
  await executeQuery(query, [topicId]);
};

export const getFirstAsync = async (query: string, params: any[] = []) => {
  try {
    const db = await getDBConnection();
    return await db.getFirstAsync(query, params);
  } catch (error) {
    console.error(`Ошибка выполнения запроса "${query}":`, error);
    throw error;
  }
};