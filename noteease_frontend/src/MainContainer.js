import React, { useState } from "react";
import "./MainContainer.css";

// Category options (predefined)
const CATEGORIES = [
  "All",
  "Personal",
  "Work",
  "Ideas",
  "Archive"
];

// PUBLIC_INTERFACE
function MainContainer() {
  // Notes state: list of { id, title, content, category }
  const [notes, setNotes] = useState([]);
  // Search/filter/category state
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  // Modal state for creating/editing
  const [modalOpen, setModalOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null); // null for new; note object for edit

  // PUBLIC_INTERFACE
  function handleAddNoteClick() {
    setActiveNote(null);
    setModalOpen(true);
  }

  // PUBLIC_INTERFACE
  function handleCardClick(note) {
    setActiveNote(note);
    setModalOpen(true);
  }

  // PUBLIC_INTERFACE
  function handleDeleteNote(id) {
    setNotes(notes.filter(n => n.id !== id));
  }

  // PUBLIC_INTERFACE
  function handleModalSave(noteData) {
    if (noteData.id) {
      setNotes(notes.map(n => n.id === noteData.id ? noteData : n));
    } else {
      setNotes([
        ...notes,
        { ...noteData, id: Date.now() }
      ]);
    }
    setModalOpen(false);
    setActiveNote(null);
  }

  // Filter notes based on category and search
  const filteredNotes = notes.filter(n => {
    const categoryMatch = (category === "All" || n.category === category);
    const searchMatch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && (!searchTerm || searchMatch);
  });

  return (
    <div className="main-container">
      {/* Top Menu: Search & Category */}
      <div className="top-menu">
        <div className="logo-main">
          <span role="img" aria-label="notebook" className="logo-emoji">📝</span>
          <span>NoteEase</span>
        </div>
        <input
          className="search-input"
          type="search"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map(cat =>
            <option value={cat} key={cat}>{cat}</option>
          )}
        </select>
      </div>

      {/* Notes Grid */}
      <div className="notes-grid">
        {filteredNotes.length === 0 && (
          <div className="no-notes">No notes found.</div>
        )}
        {filteredNotes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => handleCardClick(note)}
            onDelete={() => handleDeleteNote(note.id)}
          />
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="fab" title="Add Note" onClick={handleAddNoteClick}>+</button>

      {/* Modal for Create/Edit */}
      {modalOpen && (
        <NoteModal
          note={activeNote}
          onClose={() => setModalOpen(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}

// Note Card Component
function NoteCard({ note, onClick, onDelete }) {
  return (
    <div className="note-card" onClick={onClick}>
      <div className="note-card-header">
        <div className="note-title">{note.title || <em>Untitled</em>}</div>
        <button className="delete-btn" title="Delete" onClick={e => { e.stopPropagation(); onDelete(); }}>
          &times;
        </button>
      </div>
      <div className="note-content">
        {note.content.length > 90
          ? note.content.slice(0, 90) + "..."
          : note.content}
      </div>
      <div className="note-category">{note.category}</div>
    </div>
  );
}

// Simple Modal for Add/Edit Note
function NoteModal({ note, onClose, onSave }) {
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");
  const [category, setCategory] = useState(note ? note.category : CATEGORIES[1]);

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() === "" && content.trim() === "") return;
    onSave({
      id: note && note.id,
      title: title.trim(),
      content: content.trim(),
      category
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{note ? "Edit Note" : "Add Note"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="modal-title"
            placeholder="Title"
            maxLength={60}
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
          <textarea
            className="modal-content"
            placeholder="Type your note here..."
            rows={6}
            maxLength={600}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <select
            className="modal-category"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {CATEGORIES.filter(o => o !== "All").map(cat =>
              <option value={cat} key={cat}>{cat}</option>
            )}
          </select>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn cancel-btn">Cancel</button>
            <button type="submit" className="btn save-btn">{note ? "Save" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MainContainer;
