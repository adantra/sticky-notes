export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface StickyNoteType {
  id: number;
  name: string;
  color: string;
  todos: Todo[];
  position: {
    x: number;
    y: number;
  };
}

export interface Board {
  id: number;
  name: string;
  notes: StickyNoteType[];
}