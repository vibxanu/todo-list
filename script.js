const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const dueDateInput = document.getElementById('due-date');
const priorityInput = document.getElementById('priority');
const clearBtn = document.getElementById('clear-btn');
const filterBtns = document.querySelectorAll('.filters button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.forEach(task => addTaskToDOM(task));

addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    const due = dueDateInput.value;
    const priority = priorityInput.value;

    if (!text) return;

    const task = { text, completed: false, due, priority };
    tasks.push(task);
    addTaskToDOM(task);
    updateLocalStorage();

    taskInput.value = '';
    dueDateInput.value = '';
    priorityInput.value = 'Low';
});

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.classList.add(`priority-${task.priority.toLowerCase()}`);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'task-info';
    infoDiv.innerHTML = `<strong>${task.text}</strong>${task.due ? ` <small>Due: ${task.due}</small>` : ''}`;

    li.appendChild(infoDiv);

    if (task.completed) li.classList.add('completed');

    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        task.completed = !task.completed;
        updateLocalStorage();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', e => {
        e.stopPropagation();
        li.remove();
        tasks = tasks.filter(t => t !== task);
        updateLocalStorage();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.id);
    });
});

function applyFilter(filterId) {
    taskList.innerHTML = '';
    let filtered = tasks;
    if (filterId === 'completed-btn') filtered = tasks.filter(t => t.completed);
    if (filterId === 'pending-btn') filtered = tasks.filter(t => !t.completed);
    if (filterId === 'high-btn') filtered = tasks.filter(t => t.priority === 'High');
    if (filterId === 'medium-btn') filtered = tasks.filter(t => t.priority === 'Medium');
    if (filterId === 'low-btn') filtered = tasks.filter(t => t.priority === 'Low');
    filtered.forEach(task => addTaskToDOM(task));
}

clearBtn.addEventListener('click', () => {
    tasks = [];
    taskList.innerHTML = '';
    updateLocalStorage();
});

function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
