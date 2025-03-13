document.addEventListener('DOMContentLoaded', () => {
    const newNoteBtn = document.getElementById('new-note-btn');
    const notesList = document.getElementById('notes-list');
    const noteContent = document.getElementById('note-content');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentNoteIndex = null;

    function renderNotes() {
        notesList.innerHTML = '';
        notes.forEach((note, index) => {
            const li = document.createElement('li');
            li.textContent = note.title || `Note ${index + 1}`;
            li.addEventListener('click', () => {
                currentNoteIndex = index;
                noteContent.value = note.content;
            });
            notesList.appendChild(li);
        });
    }

    newNoteBtn.addEventListener('click', () => {
        const newNote = { title: `Note ${notes.length + 1}`, content: '' };
        notes.push(newNote);
        currentNoteIndex = notes.length - 1;
        noteContent.value = '';
        renderNotes();
        localStorage.setItem('notes', JSON.stringify(notes));
    });

    noteContent.addEventListener('input', () => {
        if (currentNoteIndex !== null) {
            notes[currentNoteIndex].content = noteContent.value;
            localStorage.setItem('notes', JSON.stringify(notes));
        }
    });

    exportBtn.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notes.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    importBtn.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            notes = JSON.parse(e.target.result);
            localStorage.setItem('notes', JSON.stringify(notes));
            renderNotes();
        };
        reader.readAsText(file);
    });

    renderNotes();
});
