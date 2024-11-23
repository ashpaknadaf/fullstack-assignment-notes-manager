import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Others' });
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchNotes = async () => {
    let url = `http://localhost:5000/notes?search=${search}`;
    const res = await fetch(url);
    const data = await res.json();
    setNotes(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:5000/notes/${editId}` : `http://localhost:5000/notes`;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData({ title: '', description: '', category: 'Others' });
    setEditId(null);
    fetchNotes();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/notes/${id}`, { method: 'DELETE' });
    fetchNotes();
  };

  const handleEdit = (note) => {
    setFormData(note);
    setEditId(note.id);
  };

  useEffect(() => {
    fetchNotes();
  }, [search]);

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <h1 className="app-title">Personal Notes Manager</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="note-form-container">
          <form onSubmit={handleSubmit}>
            <input
              className="form-input"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              className="form-textarea"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            ></textarea>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Others">Others</option>
            </select>
            <button className="form-button" type="submit">
              {editId ? 'Update Note' : 'Add Note'}
            </button>
          </form>
        </div>
        <div className="notes-list-container">
          {notes.map((note) => (
            <div className="note-card" key={note.id}>
              <h2 className="note-title">{note.title}</h2>
              <p className="note-description">{note.description}</p>
              <small className="note-date">Created: {new Date(note.created_at).toLocaleString()}</small>
              <div className="note-actions">
                <button className="action-button action-edit" onClick={() => handleEdit(note)}>
                  Edit
                </button>
                <button className="action-button action-delete" onClick={() => handleDelete(note.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
