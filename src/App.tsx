import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './components/Auth';
import BoardSelector from './components/BoardSelector';
import StickyNote from './components/StickyNote';
import AddNoteButton from './components/AddNoteButton';
import { Board, StickyNoteType } from './types';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoardId, setCurrentBoardId] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchBoards(currentUser.uid);
      } else {
        setBoards([]);
        setCurrentBoardId(0);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchBoards = async (userId: string) => {
    const boardsCollection = collection(db, `users/${userId}/boards`);
    const boardsSnapshot = await getDocs(boardsCollection);
    const fetchedBoards: Board[] = [];
    boardsSnapshot.forEach((doc) => {
      fetchedBoards.push({ id: Number(doc.id), ...doc.data() } as Board);
    });
    setBoards(fetchedBoards);
    if (fetchedBoards.length > 0) {
      setCurrentBoardId(fetchedBoards[0].id);
    }
  };

  const addBoard = async () => {
    if (user) {
      const newBoard: Board = {
        id: Date.now(),
        name: 'New Board',
        notes: []
      };
      await setDoc(doc(db, `users/${user.uid}/boards/${newBoard.id}`), newBoard);
      setBoards([...boards, newBoard]);
      setCurrentBoardId(newBoard.id);
    }
  };

  const updateBoardName = async (id: number, newName: string) => {
    if (user) {
      const updatedBoards = boards.map(board =>
        board.id === id ? { ...board, name: newName } : board
      );
      await setDoc(doc(db, `users/${user.uid}/boards/${id}`), { name: newName }, { merge: true });
      setBoards(updatedBoards);
    }
  };

  const addNote = async () => {
    if (user) {
      const currentBoard = boards.find(board => board.id === currentBoardId);
      if (currentBoard) {
        const newNote: StickyNoteType = {
          id: Date.now(),
          name: 'New Note',
          color: '#ffff88',
          todos: [],
          position: { x: 50, y: 50 }
        };
        const updatedBoard = {
          ...currentBoard,
          notes: [...currentBoard.notes, newNote]
        };
        await setDoc(doc(db, `users/${user.uid}/boards/${currentBoardId}`), updatedBoard);
        setBoards(boards.map(board => board.id === currentBoardId ? updatedBoard : board));
      }
    }
  };

  const updateNote = async (updatedNote: StickyNoteType) => {
    if (user) {
      const currentBoard = boards.find(board => board.id === currentBoardId);
      if (currentBoard) {
        const updatedNotes = currentBoard.notes.map(note =>
          note.id === updatedNote.id ? updatedNote : note
        );
        const updatedBoard = { ...currentBoard, notes: updatedNotes };
        await setDoc(doc(db, `users/${user.uid}/boards/${currentBoardId}`), updatedBoard);
        setBoards(boards.map(board => board.id === currentBoardId ? updatedBoard : board));
      }
    }
  };

  const deleteNote = async (id: number) => {
    if (user) {
      const currentBoard = boards.find(board => board.id === currentBoardId);
      if (currentBoard) {
        const updatedNotes = currentBoard.notes.filter(note => note.id !== id);
        const updatedBoard = { ...currentBoard, notes: updatedNotes };
        await setDoc(doc(db, `users/${user.uid}/boards/${currentBoardId}`), updatedBoard);
        setBoards(boards.map(board => board.id === currentBoardId ? updatedBoard : board));
      }
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Sticky Notes Todo App</h1>
        <Routes>
          <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
          <Route path="/" element={
            user ? (
              <>
                <BoardSelector
                  boards={boards}
                  currentBoardId={currentBoardId}
                  onSelectBoard={setCurrentBoardId}
                  onAddBoard={addBoard}
                  onUpdateBoardName={updateBoardName}
                />
                {boards.find(board => board.id === currentBoardId)?.notes.map(note => (
                  <StickyNote
                    key={note.id}
                    note={note}
                    updateNote={updateNote}
                    deleteNote={deleteNote}
                  />
                ))}
                <AddNoteButton onClick={addNote} />
              </>
            ) : (
              <Navigate to="/auth" />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;