import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  FileText,
  Download,
  Upload,
  Plus,
  X,
  Image,
  Link as LinkIcon,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CourseNotes = ({ courseId }) => {
  const { user } = useSelector((state) => state.auth);
  const [notes, setNotes] = useState([]);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    description: '',
    type: 'pdf', // pdf, image, link
    content: '',
    file: null,
  });

  useEffect(() => {
    loadNotes();
  }, [courseId]);

  const loadNotes = () => {
    const allNotes = JSON.parse(localStorage.getItem('courseNotes') || '{}');
    const courseNotes = allNotes[courseId] || [];
    setNotes(courseNotes);
  };

  const handleCreateNote = () => {
    if (!newNote.title || (!newNote.file && !newNote.content)) {
      toast.error('Please fill in all required fields');
      return;
    }

    const noteData = {
      id: Date.now(),
      ...newNote,
      courseId,
      createdBy: user?.id,
      createdByName: user?.name,
      createdAt: new Date().toISOString(),
      downloads: 0,
    };

    // Save to localStorage
    const allNotes = JSON.parse(localStorage.getItem('courseNotes') || '{}');
    if (!allNotes[courseId]) {
      allNotes[courseId] = [];
    }
    allNotes[courseId].push(noteData);
    localStorage.setItem('courseNotes', JSON.stringify(allNotes));

    setNotes(prev => [...prev, noteData]);
    setNewNote({
      title: '',
      description: '',
      type: 'pdf',
      content: '',
      file: null,
    });
    setShowCreateNote(false);
    toast.success('Note created successfully!');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulate file upload
      setNewNote(prev => ({
        ...prev,
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file), // In real app, this would be uploaded to server
        }
      }));
      toast.success('File uploaded successfully!');
    }
  };

  const handleDownload = (note) => {
    // Simulate download
    const updatedNotes = notes.map(n => 
      n.id === note.id ? { ...n, downloads: n.downloads + 1 } : n
    );
    setNotes(updatedNotes);

    // Update localStorage
    const allNotes = JSON.parse(localStorage.getItem('courseNotes') || '{}');
    allNotes[courseId] = updatedNotes;
    localStorage.setItem('courseNotes', JSON.stringify(allNotes));

    toast.success(`Downloading ${note.title}...`);
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      setNotes(updatedNotes);

      // Update localStorage
      const allNotes = JSON.parse(localStorage.getItem('courseNotes') || '{}');
      allNotes[courseId] = updatedNotes;
      localStorage.setItem('courseNotes', JSON.stringify(allNotes));

      toast.success('Note deleted successfully!');
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image className="h-5 w-5 text-green-600" />;
      case 'link':
        return <LinkIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <FileText className="h-5 w-5 text-red-600" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-secondary-900">Course Notes</h3>
        {user?.role === 'instructor' && (
          <button
            onClick={() => setShowCreateNote(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Note</span>
          </button>
        )}
      </div>

      {/* Create Note Modal */}
      {showCreateNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-secondary-900">Create New Note</h3>
                <button
                  onClick={() => setShowCreateNote(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Note Title *
                </label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  placeholder="Enter note title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newNote.description}
                  onChange={(e) => setNewNote(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field h-24 resize-none"
                  placeholder="Brief description of the note"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Note Type
                </label>
                <select
                  value={newNote.type}
                  onChange={(e) => setNewNote(prev => ({ ...prev, type: e.target.value }))}
                  className="input-field"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="image">Image</option>
                  <option value="link">External Link</option>
                </select>
              </div>

              {newNote.type === 'link' ? (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Link URL *
                  </label>
                  <input
                    type="url"
                    value={newNote.content}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    className="input-field"
                    placeholder="https://example.com"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Upload File *
                  </label>
                  <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                    {newNote.file ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          {getFileIcon(newNote.type)}
                          <span className="text-sm font-medium text-secondary-900">
                            {newNote.file.name}
                          </span>
                        </div>
                        <div className="text-xs text-secondary-500">
                          {formatFileSize(newNote.file.size)}
                        </div>
                        <button
                          onClick={() => setNewNote(prev => ({ ...prev, file: null }))}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove File
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-secondary-400 mx-auto mb-2" />
                        <p className="text-sm text-secondary-600 mb-2">
                          Upload {newNote.type === 'image' ? 'an image' : 'a PDF document'}
                        </p>
                        <input
                          type="file"
                          accept={newNote.type === 'image' ? 'image/*' : '.pdf'}
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="btn-primary cursor-pointer"
                        >
                          Choose File
                        </label>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 px-6 py-4 border-t border-secondary-200">
              <button
                onClick={() => setShowCreateNote(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNote}
                className="btn-primary"
              >
                Create Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getFileIcon(note.type)}
                  <h4 className="text-lg font-semibold text-secondary-900">{note.title}</h4>
                  <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full text-xs font-medium capitalize">
                    {note.type}
                  </span>
                </div>

                {note.description && (
                  <p className="text-secondary-600 mb-3">{note.description}</p>
                )}

                <div className="flex items-center space-x-4 text-sm text-secondary-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{note.createdByName}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    <span>{note.downloads} downloads</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {note.type === 'link' ? (
                  <a
                    href={note.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center space-x-1"
                    onClick={() => handleDownload(note)}
                  >
                    <Eye className="h-4 w-4" />
                    <span>Open Link</span>
                  </a>
                ) : (
                  <button
                    onClick={() => handleDownload(note)}
                    className="btn-primary flex items-center space-x-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                )}

                {user?.role === 'instructor' && note.createdBy === user?.id && (
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No notes available</h3>
          <p className="text-secondary-600">
            {user?.role === 'instructor' 
              ? 'Create your first note to share with students.'
              : 'Your instructor hasn\'t shared any notes yet.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseNotes;
