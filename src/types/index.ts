// Базовый интерфейс для сущностей с временными метками
interface Timestamped {
  created_at: number;
}

// Тип для темы
export interface Topic extends Timestamped {
  id: number;
  name: string;
  parent_id: number | null;
  order_index: number;
}

// Тип для заметки
export interface Note extends Timestamped {
  id?: number;
  topic_id?: number;
  title?: string | null
  content?: string | null;
  order_index?: number;
  is_task?: boolean;
  done?: boolean;
}

// Тип для вкладки
export interface Tab {
  id: number;
  topic_id: number;
  order_index: number;
}
