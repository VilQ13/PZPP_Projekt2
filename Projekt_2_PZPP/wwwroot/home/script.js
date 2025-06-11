const userIcon = document.getElementById('userIcon');
const dropdownMenu = document.getElementById('dropdownMenu');
const logoutBtn = document.getElementById('logoutBtn');



const savedDropdown = localStorage.getItem('dropdownMenuVisible');
dropdownMenu.style.display = savedDropdown === 'true' ? 'block' : 'none';

userIcon.addEventListener('click', () => {
    const isVisible = dropdownMenu.style.display === 'block';
    dropdownMenu.style.display = isVisible ? 'none' : 'block';
    localStorage.setItem('dropdownMenuVisible', !isVisible);
});

window.addEventListener('click', (e) => {
    if (!userIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.style.display = 'none';
        localStorage.setItem('dropdownMenuVisible', false);
    }
});

logoutBtn.addEventListener('click', () => {
    window.location.href = '/auth/index.html';
});


const componentMap = {
    toggleCalculator: 'componentCalculator',
    toggleCurrency: 'componentCurrency',
    toggleQuote: 'componentQuote',
    toggleTodo: 'componentTodo',
    toggleTimer: 'componentTimer'
};

Object.keys(componentMap).forEach(id => {
    const checkbox = document.getElementById(id);
    const component = document.getElementById(componentMap[id]);

    if (checkbox && component) {
        
        const saved = localStorage.getItem(id);
        if (saved !== null) {
            checkbox.checked = saved === 'true';
        }

        function updateVisibility() {
            component.style.display = checkbox.checked ? 'block' : 'none';
            localStorage.setItem(id, checkbox.checked); 
        }

        checkbox.addEventListener('change', updateVisibility);
        updateVisibility();
    }
});


document.querySelectorAll('.toggle-item').forEach(item => {
    const targetId = item.dataset.target;
    const targetComponent = document.getElementById(targetId);

    
    const savedVisible = localStorage.getItem(targetId);
    if (savedVisible !== null) {
        targetComponent.style.display = savedVisible === 'true' ? 'block' : 'none';
    } else {
        targetComponent.style.display = 'block'; 
    }

    function updateStyle() {
        const isVisible = targetComponent.style.display !== 'none';
        item.classList.toggle('strikethrough', !isVisible);
        localStorage.setItem(targetId, isVisible);  
    }

    updateStyle();

    item.addEventListener('click', () => {
        const isVisible = targetComponent.style.display !== 'none';
        targetComponent.style.display = isVisible ? 'none' : 'block';
        updateStyle();
    });
});


const sidebarDate = document.getElementById('sidebarDate');
if (sidebarDate) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('en-US', options);
    sidebarDate.textContent = currentDate;
}
