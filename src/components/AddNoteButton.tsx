import React from 'react'
import { Plus } from 'lucide-react'

interface AddNoteButtonProps {
  onClick: () => void
}

const AddNoteButton: React.FC<AddNoteButtonProps> = ({ onClick }) => {
  console.log('AddNoteButton rendered'); // Add this line for debugging
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
    >
      <Plus size={24} />
    </button>
  )
}

export default AddNoteButton