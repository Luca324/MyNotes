import { getDBConnection } from "@database/database.js";

// Базовая функция для выполнения любого запроса
const executeQuery = async (query, params = []) => {
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
export const createTopic = async (name, parentId = null, orderIndex = 0) => {
  const query = `
    INSERT INTO topics (name, parent_id, order_index)
    VALUES (?, ?, ?);
  `;
  const result = await executeQuery(query, [name, parentId, orderIndex]);
  return result.lastInsertRowId; // В expo-sqlite используется lastInsertRowId вместо insertId
};

export const getChildTopics = async (parentTopicId) => {
  const query = `
    SELECT * FROM topics
    WHERE parent_id IS ?
    ORDER BY order_index ASC;
  `;
  return await executeQuery(query, [parentTopicId]);
};

// NOTES
export const createNote = async (topicId, title, content, orderIndex = 0) => {
  const query = `
    INSERT INTO notes (topic_id, title, content, order_index)
    VALUES (?, ?, ?, ?);
  `;
  const result = await executeQuery(query, [topicId, title, content, orderIndex]);
  return result.lastInsertRowId;
};

// Получаем ВСЕ записи для темы (и подтемы, и заметки) и сортируем по order_index
export const getChildrenForTopic = async (topicId) => {
  const query = `
    SELECT id, name, 'topic' as type, order_index, created_at
    FROM topics
    WHERE parent_id = ?
    UNION ALL
    SELECT id, title as name, content, 'note' as type, order_index, created_at
    FROM notes
    WHERE topic_id = ?
    ORDER BY order_index ASC;
  `;
  return await executeQuery(query, [topicId, topicId]);
};

// TABS
export const addTab = async (topicId, orderIndex) => {
  const query = `
    INSERT OR REPLACE INTO tabs (topic_id, order_index)
    VALUES (?, ?);
  `;
  await executeQuery(query, [topicId, orderIndex]);
};

export const getAllTabs = async () => {
  const query = `
    SELECT t.*, topics.name
    FROM tabs t
    INNER JOIN topics ON t.topic_id = topics.id
    ORDER BY t.order_index ASC;
  `;
  return await executeQuery(query);
};

// Дополнительные функции
export const getTopicById = async (topicId) => {
  const query = `SELECT * FROM topics WHERE id = ?;`;
  const results = await executeQuery(query, [topicId]);
  return results.length > 0 ? results[0] : null;
};

export const updateNote = async (noteId, title, content) => {
  const query = `UPDATE notes SET title = ?, content = ? WHERE id = ?;`;
  await executeQuery(query, [title, content, noteId]);
};

export const deleteNote = async (noteId) => {
  const query = `DELETE FROM notes WHERE id = ?;`;
  await executeQuery(query, [noteId]);
};

export const deleteTopic = async (topicId) => {
  const query = `DELETE FROM topics WHERE id = ?;`;
  await executeQuery(query, [topicId]);
};

// Функция для получения одной записи
export const getFirstAsync = async (query, params = []) => {
  try {
    const db = await getDBConnection();
    return await db.getFirstAsync(query, params);
  } catch (error) {
    console.error(`Ошибка выполнения запроса "${query}":`, error);
    throw error;
  }
};