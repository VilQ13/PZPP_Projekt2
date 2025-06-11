const API_BASE = 'http://localhost:5292/api/links';
const token = localStorage.getItem('token');
const linkList = document.getElementById('linkList');
const linkInput = document.getElementById('linkInput');
const addBtn = document.getElementById('addBtn');

const iconMap = [
    { match: 'youtube.com', icon: 'bi-youtube' },
    { match: 'facebook.com', icon: 'bi-facebook' },
    { match: 'twitter.com', icon: 'bi-twitter' },

];

async function authFetch(url, options = {}) {
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, options);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Błąd serwera');
    }

  
    if (response.status === 204) {
        return null;
    }

    return response.json();  
}


function getUserIdFromToken() {
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload?.nameid || payload?.sub || null;
    } catch {
        return null;
    }
}

async function loadLinks() {

    console.log('Token:', token); 
    console.log('LocalStorage token:', localStorage.getItem('token'));
    const userId = getUserIdFromToken();
    if (!userId) {
        alert('Nie jesteś zalogowany.');
        return;
    }

    try {
        const links = await authFetch(`${API_BASE}/user/${userId}`);
        linkList.innerHTML = '';

        links.forEach((link, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';

            const matched = iconMap.find(({ match }) => link.url.includes(match));
            const iconHTML = matched ? `<i class="bi ${matched.icon} me-2"></i>` : '<i class="bi bi-link-45deg me-2"></i>';

            li.innerHTML = `
                <div class="d-flex align-items-center flex-grow-1">
                    <span class="me-2 text-secondary">${index + 1}.</span>
                    ${iconHTML}
                    <a href="${link.url}" target="_blank" class="link-text flex-grow-1 text-truncate">${link.name}</a>
                </div>
                <div>
                    <button class="btn btn-warning btn-sm me-2 edit-btn"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-danger btn-sm remove-btn"><i class="bi bi-trash"></i></button>
                </div>
            `;

            li.querySelector('.edit-btn').addEventListener('click', async () => {
                const input = prompt("Nowa nazwa:", link.name);
                if (input) {
                    try {
                        await authFetch(`${API_BASE}/${link.id}`, {
                            method: 'PUT',
                            body: JSON.stringify({ ...link, name: input }),
                        });
                        await loadLinks();
                    } catch (error) {
                        alert('Błąd aktualizacji: ' + error.message);
                    }
                }
            });

            li.querySelector('.remove-btn').addEventListener('click', async () => {
                if (confirm(`Czy na pewno chcesz usunąć link "${link.name}"?`)) {
                    try {
                        await authFetch(`${API_BASE}/${link.id}`, { method: 'DELETE' });
                        await loadLinks();
                    } catch (error) {
                        alert('Błąd usuwania: ' + error.message);
                    }
                }
            });

            linkList.appendChild(li);
        });
    } catch (error) {
        alert('Błąd ładowania linków: ' + error.message);
    }
}

async function addLink() {
    try {
        const url = linkInput.value.trim();
        if (!url) return alert('Wpisz link!');

        const userId = getUserIdFromToken();
        if (!userId) {
            alert('Nie jesteś zalogowany.');
            return;
        }

        await authFetch(API_BASE, {
            method: 'POST',
            body: JSON.stringify({ url, name: url, userId }),
        });

        linkInput.value = '';
        loadLinks();

    } catch (error) {
        alert('Błąd dodawania linku: ' + error.message);
    }
}

addBtn.addEventListener('click', addLink);
window.addEventListener('load', loadLinks);
    