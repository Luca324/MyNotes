import * as SQLite from 'expo-sqlite'

// Имя нашей базы данных
const databaseName = 'NotesApp.db'

// Переменная для хранения ссылки на открытую базу данных
let db = null

// Главная функция для получения доступа к БД.
// Если БД не открыта, она откроет её и создаст таблицы.
// Если открыта, просто вернет ссылку.
export const getDBConnection = async () => {
  if (db) {
    return db
  }

  try {
    console.log('Открываем новое соединение с БД...')
    // Открываем/создаем БД
    db = SQLite.openDatabaseSync(databaseName)
    console.log('База данных успешно открыта! db:', db)

    // Не забываем создать таблицы после открытия!
    await createTables(db)
    return db
  } catch (error) {
    // console.error('Ошибка при открытии/создании БД:', error)
    // throw error // Пробрасываем ошибку выше, чтобы обработать её в UI
  }
}

// Функция для закрытия БД (например, при выходе из приложения)
export const closeDBConnection = async () => {
  if (db) {
    try {
      db.closeSync()
      console.log('База данных закрыта.')
      db = null
    } catch (error) {
      console.error('Ошибка при закрытии БД:', error)
      throw error
    }
  }
}

// Функция для удаления БД (для разработки или полного сброса)
export const deleteDB = async () => {
  try {
    SQLite.deleteDatabaseSync(databaseName)
    console.log('База данных удалена.')
    db = null
  } catch (error) {
    console.error('Ошибка при удалении БД:', error)
    throw error
  }
}

const createTables = async (database) => {
  console.log('Проверяем и создаем таблицы...')

  // Внимание! Используем `IF NOT EXISTS` чтобы не было ошибок при повторном вызове.
  const queryTopics = `
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      parent_id INTEGER,
      order_index REAL NOT NULL DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );
  `

  const queryNotes = `
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL,
      title TEXT,
      content TEXT,
      order_index REAL NOT NULL DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE CASCADE
    );
  `

  const queryTabs = `
    CREATE TABLE IF NOT EXISTS tabs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL UNIQUE,
      order_index REAL NOT NULL,
      FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE CASCADE
    );
  `

  try {
    // В expo-sqlite используем транзакцию с колбэком
    database.execSync(queryTopics)
    database.execSync(queryNotes)
    database.execSync(queryTabs)
  } catch (error) {
    console.error('Ошибка при создании таблиц:', error)
    throw error
  }
}