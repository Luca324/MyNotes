# База данных MyNotes

## Общая информация

- **Тип БД**: SQLite
- **Имя файла**: `NotesApp.db`
- **Библиотека**: expo-sqlite
- **Расположение**: Локально на устройстве

## Схема базы данных

### Таблица `topics` (Темы)

Хранит иерархическую структуру тем/папок.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | INTEGER PRIMARY KEY | Уникальный идентификатор |
| `name` | TEXT NOT NULL | Название темы |
| `parent_id` | INTEGER | ID родительской темы (NULL для корневых) |
| `order_index` | REAL NOT NULL DEFAULT 0 | Порядок сортировки |
| `created_at` | INTEGER | Unix timestamp создания |

**Особенности**:
- `parent_id = NULL` означает корневую тему
- Рекурсивная структура через `parent_id`
- Поддержка каскадного удаления через FOREIGN KEY

### Таблица `notes` (Заметки)

Хранит заметки, привязанные к темам.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | INTEGER PRIMARY KEY | Уникальный идентификатор |
| `topic_id` | INTEGER NOT NULL | ID темы, к которой привязана заметка |
| `title` | TEXT | Заголовок заметки (опционально) |
| `content` | TEXT | Содержимое заметки |
| `order_index` | REAL NOT NULL DEFAULT 0 | Порядок сортировки |
| `created_at` | INTEGER | Unix timestamp создания |
| `is_task` | BOOLEAN DEFAULT 0 | Флаг, является ли запись задачей (0 = заметка, 1 = задача) |
| `done` | BOOLEAN DEFAULT 0 | Флаг выполнения задачи (0 = не выполнена, 1 = выполнена, актуально только для задач) |

**Особенности**:
- FOREIGN KEY на `topics(id)` с ON DELETE CASCADE
- При удалении темы удаляются все её заметки

### Таблица `tabs` (Вкладки)

Хранит закрепленные темы для быстрого доступа.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | INTEGER PRIMARY KEY | Уникальный идентификатор |
| `topic_id` | INTEGER NOT NULL UNIQUE | ID закрепленной темы |
| `order_index` | REAL NOT NULL | Порядок сортировки вкладок |

**Особенности**:
- `topic_id` UNIQUE - одна тема может быть только одной вкладкой
- FOREIGN KEY на `topics(id)` с ON DELETE CASCADE
- При удалении темы удаляется соответствующая вкладка

## SQL запросы создания таблиц

```sql
CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  parent_id INTEGER,
  order_index REAL NOT NULL DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  title TEXT,
  content TEXT,
  order_index REAL NOT NULL DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  is_task BOOLEAN DEFAULT 0,
  done BOOLEAN DEFAULT 0,
  FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tabs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL UNIQUE,
  order_index REAL NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE CASCADE
);
```

## Основные операции

### Работа с темами
- `createTopic(parentId, name, orderIndex)` - создание темы
- `getChildTopics(parentTopicId)` - получение дочерних тем
- `getTopicById(topicId)` - получение темы по ID
- `deleteTopic(topicId)` - удаление темы

### Работа с заметками
- `createNote(topicId, content, title, orderIndex, isTask?, done?)` - создание заметки или задачи
- `getNotesForTopic(parentTopicId)` - получение заметок темы
- `getNoteById(noteId)` - получение заметки по ID
- `updateNote(noteId, content?, title?, done?)` - обновление заметки
- `toggleTaskDone(taskId, done)` - переключение статуса выполнения задачи
- `deleteNote(noteId)` - удаление заметки

### Работа с вкладками
- `addTab(topicId, orderIndex)` - добавление вкладки
- `getAllTabs()` - получение всех вкладок

## Важные замечания

1. **Каскадное удаление**: При удалении темы автоматически удаляются все связанные заметки и вкладки
2. **Рекурсивность**: Для получения всех подтем на всех уровнях требуется рекурсивный запрос (сейчас реализовано только получение прямых дочерних тем)
3. **Индексы**: В текущей версии индексы не созданы явно, но PRIMARY KEY автоматически создает индекс

