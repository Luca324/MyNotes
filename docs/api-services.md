# API и сервисы MyNotes

## databaseService.ts

Основной сервис для работы с базой данных. Все функции асинхронные и возвращают Promises.

### Общая функция выполнения запросов

```typescript
executeQuery(query: string, params: any[] = [])
```
- Автоматически определяет тип запроса (SELECT vs остальные)
- Для SELECT использует `getAllAsync`
- Для остальных использует `runAsync`
- Обрабатывает ошибки

---

## API для работы с темами (Topics)

### createTopic
```typescript
createTopic(
  parentId: number | null = null,
  name: string,
  orderIndex: number = 0
): Promise<number>
```
**Описание**: Создает новую тему  
**Возвращает**: ID созданной темы  
**Пример**:
```typescript
const topicId = await createTopic(null, "Новая тема", 0);
const subtopicId = await createTopic(topicId, "Подтема", 0);
```

---

### getChildTopics
```typescript
getChildTopics(parentTopicId: number): Promise<Topic[]>
```
**Описание**: Получает все прямые дочерние темы указанной темы  
**Возвращает**: Массив тем, отсортированных по `order_index`  
**Примечание**: Не рекурсивно - только прямые дети

---

### getTopicById
```typescript
getTopicById(topicId: number): Promise<Topic | null>
```
**Описание**: Получает тему по ID  
**Возвращает**: Объект темы или `null` если не найдена

---

### deleteTopic
```typescript
deleteTopic(topicId: number): Promise<void>
```
**Описание**: Удаляет тему и все связанные данные (каскадное удаление)  
**Примечание**: Автоматически удаляет все заметки и вкладки этой темы

---

## API для работы с заметками (Notes)

### createNote
```typescript
createNote(
  topicId: number,
  content: string,
  title: string = '',
  orderIndex: number = 0,
  isTask: boolean = false,
  done: boolean = false
): Promise<number>
```
**Описание**: Создает новую заметку или задачу в указанной теме  
**Возвращает**: ID созданной заметки/задачи  
**Параметры**:
- `isTask` - если `true`, создается задача, иначе заметка
- `done` - статус выполнения задачи (актуально только для задач)
**Особенности**:
- Пустые строки для `title` и `content` автоматически преобразуются в `null`
- Если `title` пустой или содержит только пробелы, сохраняется как `null`
**Пример**:
```typescript
const noteId = await createNote(1, "Содержимое заметки", "Заголовок", 0);
const taskId = await createNote(1, "Выполнить задачу", "Задача", 0, true, false);
```

---

### getNotesForTopic
```typescript
getNotesForTopic(parentTopicId: number): Promise<Note[]>
```
**Описание**: Получает все заметки указанной темы  
**Возвращает**: Массив заметок, отсортированных по `order_index`

---

### getNoteById
```typescript
getNoteById(noteId: number): Promise<Note | null>
```
**Описание**: Получает заметку по ID  
**Возвращает**: Объект заметки или `null` если не найдена

---

### updateNote
```typescript
updateNote(
  noteId: number,
  content?: string,
  title?: string,
  done?: boolean
): Promise<void>
```
**Описание**: Обновляет заметку или задачу (только указанные поля)  
**Параметры**: Все опциональны, обновляются только переданные  
- `done` - статус выполнения задачи (актуально только для задач)
**Пример**:
```typescript
await updateNote(1, "Новое содержимое");
await updateNote(1, undefined, "Новый заголовок");
await updateNote(1, "Новое содержимое", "Новый заголовок");
await updateNote(1, undefined, undefined, true); // Отметить задачу как выполненную
```

---

### toggleTaskDone
```typescript
toggleTaskDone(
  taskId: number,
  done: boolean
): Promise<void>
```
**Описание**: Переключает статус выполнения задачи  
**Параметры**:
- `taskId` - ID задачи
- `done` - новый статус выполнения (`true` = выполнена, `false` = не выполнена)

---

### deleteNote
```typescript
deleteNote(noteId: number): Promise<void>
```
**Описание**: Удаляет заметку или задачу

---

## API для работы с вкладками (Tabs)

### addTab
```typescript
addTab(
  topicId: number,
  orderIndex: number = 0
): Promise<number>
```
**Описание**: Добавляет тему как вкладку (или обновляет существующую)  
**Возвращает**: ID записи вкладки  
**Примечание**: Использует `INSERT OR REPLACE`, поэтому безопасно вызывать повторно

---

### removeTab
```typescript
removeTab(topicId: number): Promise<void>
```
**Описание**: Удаляет тему из вкладок (открепляет)  
**Параметры**: `topicId` - ID темы для открепления

---

### getAllTabs
```typescript
getAllTabs(): Promise<Topic[]>
```
**Описание**: Получает все закрепленные вкладки  
**Возвращает**: Массив тем-вкладок с JOIN к таблице topics, отсортированных по `order_index`  
**Примечание**: Возвращает полные объекты Topic с полями: id, name, parent_id, order_index, created_at

---

## database.js

### getDBConnection
```typescript
getDBConnection(): Promise<SQLiteDatabase>
```
**Описание**: Получает соединение с БД (singleton pattern)  
**Функциональность**:
- Если БД уже открыта, возвращает существующее соединение
- Если нет - открывает новую и создает таблицы
- Автоматически вызывает `createTables()` при первом открытии

---

### closeDBConnection
```typescript
closeDBConnection(): Promise<void>
```
**Описание**: Закрывает соединение с БД

---

### deleteDB
```typescript
deleteDB(): Promise<void>
```
**Описание**: Удаляет файл базы данных (для разработки/сброса)

---

## Типы данных

Все типы определены в `src/types/index.ts`:

- `Topic` - тема с полями: id, name, parent_id, order_index, created_at
- `Note` - заметка с полями: id, topic_id, title, content, order_index, created_at
- `Tab` - вкладка с полями: id, topic_id, order_index

---

## Обработка ошибок

Все функции сервиса:
- Логируют ошибки в консоль через `console.error`
- Пробрасывают ошибки выше для обработки в UI
- Используют try-catch блоки

**Рекомендация**: Обернуть вызовы API в try-catch на уровне компонентов для показа пользователю ошибок

---

## Примеры использования

### Создание иерархии тем
```typescript
// Создаем корневую тему
const rootId = await createTopic(null, "Работа", 0);

// Создаем подтему
const projectId = await createTopic(rootId, "Проект X", 0);

// Создаем подтему второго уровня
const taskId = await createTopic(projectId, "Задача 1", 0);
```

### Работа с заметками
```typescript
// Создаем заметку
const noteId = await createNote(projectId, "Описание проекта", "Проект X", 0);

// Получаем все заметки темы
const notes = await getNotesForTopic(projectId);

// Обновляем заметку
await updateNote(noteId, "Обновленное описание", "Новый заголовок");
```

### Работа с вкладками
```typescript
// Закрепляем тему как вкладку
await addTab(rootId, 0);

// Получаем все вкладки
const tabs = await getAllTabs();

// Открепляем вкладку
await removeTab(rootId);
```

