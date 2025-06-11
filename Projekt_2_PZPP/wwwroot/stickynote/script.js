let noteId = 0;
let occupiedPositions = [];


document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first');
        window.location.href = '/login';
        return;
    }
    loadNotesFromServer();
});


async function createStickyNote() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first');
        return;
    }

  
    const randomX = Math.floor(Math.random() * (window.innerWidth - 300));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 200));

    const noteData = {
        content: "Click and type here!",
        backgroundColor: "#F4F4F4",
        positionX: randomX,
        positionY: randomY
    };

    try {
        const response = await fetch('/api/stickynotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(noteData)
        });

        if (response.status === 401) {
            alert('Session expired. Please log in again.');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to create note');
        }

        const newNote = await response.json();
        createNoteElement(newNote);
    } catch (error) {
        console.error('Error creating note:', error);
        alert('Failed to create note');
    }
}


function createNoteElement(noteData) {
    const container = document.getElementById("container");
    const note = document.createElement("div");
    note.className = "note";
    note.id = "note_" + noteData.id;
    note.innerHTML = `
        <div class="header">
            <span class="delete" onclick="deleteStickyNote('${noteData.id}')">Delete</span>
        </div>
        <div class="content" contenteditable="true" 
             oninput="saveNoteContent('${noteData.id}', this.innerText)"
             onclick="hidePlaceholder(this)">${noteData.content}</div>
        <input type="color" class="color-picker" 
               onchange="changeNoteColor('${noteData.id}', this.value)" 
               value="${noteData.backgroundColor}">
    `;

    note.style.left = noteData.positionX + "px";
    note.style.top = noteData.positionY + "px";
    note.style.backgroundColor = noteData.backgroundColor;

    note.addEventListener("mousedown", (event) => startDrag(event, noteData.id));
    container.appendChild(note);
}


function hidePlaceholder(element) {
    if (element.innerText === "Click and type here!") {
        element.innerText = "";
    }
}


async function saveNoteContent(noteId, content) {
    await updateNoteOnServer(noteId, { content });
}


function startDrag(event, noteId) {
    if (event.target.classList.contains('delete') ||
        event.target.classList.contains('color-picker')) {
        return;
    }

    const note = event.currentTarget;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const noteX = note.offsetLeft;
    const noteY = note.offsetTop;
    const offsetX = mouseX - noteX;
    const offsetY = mouseY - noteY;

    document.addEventListener("mousemove", dragNote);
    document.addEventListener("mouseup", stopDrag);

    function dragNote(event) {
        if (event.target.tagName.toLowerCase() === 'input' ||
            event.target.tagName.toLowerCase() === 'textarea' ||
            event.target.contentEditable === 'true') {
            return;
        }
        event.preventDefault();
        const newNoteX = Math.max(0, event.clientX - offsetX);
        const newNoteY = Math.max(0, event.clientY - offsetY);
        note.style.left = newNoteX + "px";
        note.style.top = newNoteY + "px";
    }

    async function stopDrag() {
        document.removeEventListener("mousemove", dragNote);
        document.removeEventListener("mouseup", stopDrag);

       
        const newX = parseInt(note.style.left);
        const newY = parseInt(note.style.top);
        await updateNoteOnServer(noteId, {
            positionX: newX,
            positionY: newY
        });
    }
}


async function deleteStickyNote(noteId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first');
        return;
    }

    try {
        const response = await fetch(`/api/stickynotes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.status === 401) {
            alert('Session expired. Please log in again.');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to delete note');
        }


        const noteElement = document.getElementById("note_" + noteId);
        if (noteElement) {
            noteElement.remove();
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note');
    }
}


async function changeNoteColor(noteId, color) {
    const note = document.getElementById("note_" + noteId);
    note.style.backgroundColor = color;

    await updateNoteOnServer(noteId, { backgroundColor: color });
}


async function resetNotes() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first');
        return;
    }

    if (!confirm('Are you sure you want to delete all notes?')) {
        return;
    }

    try {
        const response = await fetch('/api/stickynotes', {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.status === 401) {
            alert('Session expired. Please log in again.');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to reset notes');
        }

   
        const container = document.getElementById("container");
        container.innerHTML = "";
        noteId = 0;
        occupiedPositions = [];
    } catch (error) {
        console.error('Error resetting notes:', error);
        alert('Failed to reset notes');
    }
}


async function loadNotesFromServer() {
    const token = localStorage.getItem('token');
    if (!token) {
        return;
    }

    try {
        const response = await fetch('/api/stickynotes', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.status === 401) {
            alert('Session expired. Please log in again.');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to load notes');
        }

        const notes = await response.json();

       
        const container = document.getElementById("container");
        container.innerHTML = "";

    
        notes.forEach(note => {
            createNoteElement(note);
        });
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}


async function updateNoteOnServer(noteId, updates) {
    const token = localStorage.getItem('token');
    if (!token) {
        return;
    }

    const noteElement = document.getElementById("note_" + noteId);
    if (!noteElement) return;

    const contentElement = noteElement.querySelector('.content');
    const colorPicker = noteElement.querySelector('.color-picker');

    const updateData = {
        content: updates.content || contentElement.innerText,
        backgroundColor: updates.backgroundColor || colorPicker.value,
        positionX: updates.positionX !== undefined ? updates.positionX : parseInt(noteElement.style.left),
        positionY: updates.positionY !== undefined ? updates.positionY : parseInt(noteElement.style.top)
    };

    try {
        const response = await fetch(`/api/stickynotes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(updateData)
        });

        if (response.status === 401) {
            alert('Session expired. Please log in again.');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to update note');
        }
    } catch (error) {
        console.error('Error updating note:', error);
    }
}