import React from 'react';
import { Board } from '../types';
import { Plus, Edit2 } from 'lucide-react';

interface BoardSelectorProps {
  boards: Board[];
  currentBoardId: number;
  onSelectBoard: (id: number) => void;
  onAddBoard: () => void;
  onUpdateBoardName: (id: number, newName: string) => void;
}

const BoardSelector: React.FC<BoardSelectorProps> = ({ 
  boards, 
  currentBoardId, 
  onSelectBoard, 
  onAddBoard, 
  onUpdateBoardName 
}) => {
  console.log('BoardSelector rendered', boards); // Add this line for debugging
  return (
    <div className="mb-4 flex items-center space-x-2">
      <select 
        value={currentBoardId} 
        onChange={(e) => onSelectBoard(Number(e.target.value))}
        className="p-2 border rounded"
      >
        {boards.map(board => (
          <option key={board.id} value={board.id}>{board.name}</option>
        ))}
      </select>
      <button 
        onClick={() => {
          const board = boards.find(b => b.id === currentBoardId);
          if (board) {
            const newName = prompt('Enter new board name:', board.name);
            if (newName) onUpdateBoardName(currentBoardId, newName);
          }
        }}
        className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        <Edit2 size={16} />
      </button>
      <button 
        onClick={onAddBoard}
        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default BoardSelector;