import React, { useState } from 'react'
import { StickyNoteType } from '../types'
import { X, Plus, Trash2 } from 'lucide-react'

interface StickyNoteProps {
  note: StickyNoteType
  updateNote: (note: StickyNoteType) => void
  deleteNote: (id: number) => void
}

const StickyNote: React.FC<StickyNoteProps> = ({ note, updateNote, deleteNote }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - note.position.x,
      y: e.clientY - note.position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateNote({
        ...note,
        position: {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        },
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const addTodo = () => {
    updateNote({
      ...note,
      todos: [...note.todos, { id: Date.now(), text: '', completed: false }],
    })
  }

  const updateTodo = (id: number, text: string, completed: boolean) => {
    updateNote({
      ...note,
      todos: note.todos.map(todo =>
        todo.id === id ? { ...todo, text, completed } : todo
      ),
    })
  }

  const deleteTodo = (id: number) => {
    updateNote({
      ...note,
      todos: note.todos.filter(todo => todo.id !== id),
    })
  }

  return (
    <div
      className="absolute p-4 rounded shadow-lg w-64"
      style={{
        backgroundColor: note.color,
        left: note.position.x,
        top: note.position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="flex justify-between items-center mb-2">
        <input
          type="text"
          value={note.name}
          onChange={(e) => updateNote({ ...note, name: e.target.value })}
          className="bg-transparent font-bold text-lg"
        />
        <button onClick={() => deleteNote(note.id)} className="text-gray-600 hover:text-gray-800">
          <X size={16} />
        </button>
      </div>
      <input
        type="color"
        value={note.color}
        onChange={(e) => updateNote({ ...note, color: e.target.value })}
        className="mb-2"
      />
      <ul className="space-y-2">
        {note.todos.map(todo => (
          <li key={todo.id} className="flex items-center">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) => updateTodo(todo.id, todo.text, e.target.checked)}
              className="mr-2"
            />
            <input
              type="text"
              value={todo.text}
              onChange={(e) => updateTodo(todo.id, e.target.value, todo.completed)}
              className="flex-grow bg-transparent"
            />
            <button onClick={() => deleteTodo(todo.id)} className="text-gray-600 hover:text-gray-800 ml-2">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
      <button onClick={addTodo} className="mt-2 text-gray-600 hover:text-gray-800">
        <Plus size={16} />
      </button>
    </div>
  )
}

export default StickyNote