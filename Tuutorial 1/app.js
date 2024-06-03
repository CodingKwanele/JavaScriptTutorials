let currentSection = '';

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
    }
    if (username) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'flex';
        displaySessionTodos();
        displayLocalTodos();
    } else {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('app-section').style.display = 'none';
    }
});

function login() {
    const username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('username', username);
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'flex';
        alert(`Logged in as ${username}`);
        displaySessionTodos();
        displayLocalTodos();
    } else {
        alert('Please enter a username.');
    }
}

function logout() {
    localStorage.removeItem('username');
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('app-section').style.display = 'none';
}

function validateTaskInput(task) {
    if (!task.text) {
        alert("Task text is required.");
        return false;
    }
    if (!task.dueDate) {
        alert("Due date is required.");
        return false;
    }
    if (new Date(task.dueDate) < new Date()) {
        alert("Due date cannot be in the past.");
        return false;
    }
    return true;
}

function addSessionTodo() {
    const input = document.getElementById('session-todo-input');
    const category = document.getElementById('session-category').value;
    const priority = document.getElementById('session-priority').value;
    const dueDate = document.getElementById('session-due-date').value;
    const description = document.getElementById('session-description').value;
    const task = {
        text: input.value,
        category,
        priority,
        dueDate,
        description,
        completed: false
    };
    if (validateTaskInput(task)) {
        let tasks = JSON.parse(sessionStorage.getItem('sessionTodos')) || [];
        tasks.push(task);
        sessionStorage.setItem('sessionTodos', JSON.stringify(tasks));
        displaySessionTodos();
        input.value = '';
        document.getElementById('session-due-date').value = '';
        document.getElementById('session-description').value = '';
    }
}

function addLocalTodo() {
    const input = document.getElementById('local-todo-input');
    const category = document.getElementById('local-category').value;
    const priority = document.getElementById('local-priority').value;
    const dueDate = document.getElementById('local-due-date').value;
    const description = document.getElementById('local-description').value;
    const task = {
        text: input.value,
        category,
        priority,
        dueDate,
        description,
        completed: false
    };
    if (validateTaskInput(task)) {
        let tasks = JSON.parse(localStorage.getItem('localTodos')) || [];
        tasks.push(task);
        localStorage.setItem('localTodos', JSON.stringify(tasks));
        displayLocalTodos();
        input.value = '';
        document.getElementById('local-due-date').value = '';
        document.getElementById('local-description').value = '';
    }
}

function displaySessionTodos() {
    const tasks = JSON.parse(sessionStorage.getItem('sessionTodos')) || [];
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const list = document.getElementById('session-todo-list');
    list.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <span>${task.text} (${task.category}, ${task.priority}) - ${task.dueDate} - ${task.description}</span>
            <div>
                <button onclick="editSessionTask(${index})">Edit</button>
                <button onclick="toggleSessionTask(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button onclick="deleteSessionTask(${index})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

function displayLocalTodos() {
    const tasks = JSON.parse(localStorage.getItem('localTodos')) || [];
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const list = document.getElementById('local-todo-list');
    list.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <span>${task.text} (${task.category}, ${task.priority}) - ${task.dueDate} - ${task.description}</span>
            <div>
                <button onclick="editLocalTask(${index})">Edit</button>
                <button onclick="toggleLocalTask(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button onclick="deleteLocalTask(${index})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

function displayCompletedTasks() {
    const sessionTasks = JSON.parse(sessionStorage.getItem('sessionTodos')) || [];
    const localTasks = JSON.parse(localStorage.getItem('localTodos')) || [];
    const completedTasks = [...sessionTasks, ...localTasks].filter(task => task.completed);
    const list = document.getElementById('completed-tasks-list');
    list.innerHTML = '';
    completedTasks.forEach((task) => {
        const li = document.createElement('li');
        li.innerHTML = `${task.text} (${task.category}, ${task.priority}) - ${task.dueDate} - ${task.description}`;
        list.appendChild(li);
    });
}

function displayUncompletedTasks() {
    const sessionTasks = JSON.parse(sessionStorage.getItem('sessionTodos')) || [];
    const localTasks = JSON.parse(localStorage.getItem('localTodos')) || [];
    const uncompletedTasks = [...sessionTasks, ...localTasks].filter(task => !task.completed);
    const list = document.getElementById('uncompleted-tasks-list');
    list.innerHTML = '';
    uncompletedTasks.forEach((task) => {
        const li = document.createElement('li');
        li.innerHTML = `${task.text} (${task.category}, ${task.priority}) - ${task.dueDate} - ${task.description}`;
        list.appendChild(li);
    });
}

function editSessionTask(index) {
    let tasks = JSON.parse(sessionStorage.getItem('sessionTodos'));
    const task = tasks[index];
    const newText = prompt("Edit task text:", task.text);
    const newCategory = prompt("Edit task category (Work, Personal Life, Entertainment):", task.category);
    const newPriority = prompt("Edit task priority (High, Medium, Low):", task.priority);
    const newDueDate = prompt("Edit task due date (YYYY-MM-DD):", task.dueDate);
    const newDescription = prompt("Edit task description:", task.description);
    if (newText && newCategory && newDueDate && newDescription && newPriority) {
        task.text = newText;
        task.category = newCategory;
        task.priority = newPriority;
        task.dueDate = newDueDate;
        task.description = newDescription;
        tasks[index] = task;
        sessionStorage.setItem('sessionTodos', JSON.stringify(tasks));
        displaySessionTodos();
    }
}

function editLocalTask(index) {
    let tasks = JSON.parse(localStorage.getItem('localTodos'));
    const task = tasks[index];
    const newText = prompt("Edit task text:", task.text);
    const newCategory = prompt("Edit task category (Work, Personal Life, Entertainment):", task.category);
    const newPriority = prompt("Edit task priority (High, Medium, Low):", task.priority);
    const newDueDate = prompt("Edit task due date (YYYY-MM-DD):", task.dueDate);
    const newDescription = prompt("Edit task description:", task.description);
    if (newText && newCategory && newDueDate && newDescription && newPriority) {
        task.text = newText;
        task.category = newCategory;
        task.priority = newPriority;
        task.dueDate = newDueDate;
        task.description = newDescription;
        tasks[index] = task;
        localStorage.setItem('localTodos', JSON.stringify(tasks));
        displayLocalTodos();
    }
}

function toggleSessionTask(index) {
    let tasks = JSON.parse(sessionStorage.getItem('sessionTodos'));
    tasks[index].completed = !tasks[index].completed;
    sessionStorage.setItem('sessionTodos', JSON.stringify(tasks));
    displaySessionTodos();
}

function toggleLocalTask(index) {
    let tasks = JSON.parse(localStorage.getItem('localTodos'));
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('localTodos', JSON.stringify(tasks));
    displayLocalTodos();
}

function deleteSessionTask(index) {
    let tasks = JSON.parse(sessionStorage.getItem('sessionTodos'));
    tasks.splice(index, 1);
    sessionStorage.setItem('sessionTodos', JSON.stringify(tasks));
    displaySessionTodos();
}

function deleteLocalTask(index) {
    let tasks = JSON.parse(localStorage.getItem('localTodos'));
    tasks.splice(index, 1);
    localStorage.setItem('localTodos', JSON.stringify(tasks));
    displayLocalTodos();
}

function showSection(sectionId) {
    currentSection = sectionId;
    document.querySelectorAll('.todo-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
    if (sectionId === 'completed-tasks') {
        displayCompletedTasks();
    } else if (sectionId === 'uncompleted-tasks') {
        displayUncompletedTasks();
    }
}

function goBack() {
    document.getElementById(currentSection).style.display = 'none';
    document.querySelectorAll('.todo-section').forEach(section => {
        section.style.display = 'none';
    });
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
}
