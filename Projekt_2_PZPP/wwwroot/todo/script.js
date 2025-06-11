const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

if (!token || !userId) {
   
    alert("Please log in first.");
    window.location.href = "/auth/index.html";
}


toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));


let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(savedTheme);


async function getTodos() {
    const response = await fetch(`/api/todos/user/${userId}`);
    const todos = await response.json();

    todos.forEach(todo => {
        renderTodo(todo);
    });
}

async function addToDo(event) {
    event.preventDefault();
    const text = toDoInput.value.trim();
    if (!text) return alert("You must write something!");

    const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, userId })
    });

    const newTodo = await response.json();
    renderTodo(newTodo);
    toDoInput.value = '';
}

function renderTodo(todo) {
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todo", `${savedTheme}-todo`);
    if (todo.isCompleted) toDoDiv.classList.add("completed");
    toDoDiv.setAttribute("data-id", todo.id);

    const newToDo = document.createElement('li');
    newToDo.innerText = todo.text;
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);

    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(checked);

    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);

    toDoList.appendChild(toDoDiv);
}

async function deletecheck(event) {
    const item = event.target;
    const parent = item.closest(".todo");
    const todoId = parent.getAttribute("data-id");

    if (item.classList.contains('delete-btn')) {
        parent.classList.add("fall");
        await fetch(`/api/todos/${todoId}`, { method: 'DELETE' });

        parent.addEventListener('transitionend', () => parent.remove());
    }

    if (item.classList.contains('check-btn')) {
        parent.classList.toggle("completed");

        const isCompleted = parent.classList.contains("completed");
        const text = parent.querySelector('li').innerText;

        await fetch(`/api/todos/${todoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, isCompleted })
        });
    }
}


function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = color;

    document.body.className = color;
    document.getElementById('title').classList.toggle('darker-title', color === 'darker');
    document.querySelector('input').className = `${color}-input`;

    document.querySelectorAll('.todo').forEach(todo => {
        todo.className = `todo ${color}-todo${todo.classList.contains('completed') ? ' completed' : ''}`;
    });

    document.querySelectorAll('button').forEach(button => {
        if (button.classList.contains('check-btn')) {
            button.className = `check-btn ${color}-button`;
        } else if (button.classList.contains('delete-btn')) {
            button.className = `delete-btn ${color}-button`;
        } else if (button.classList.contains('todo-btn')) {
            button.className = `todo-btn ${color}-button`;
        }
    });
}
