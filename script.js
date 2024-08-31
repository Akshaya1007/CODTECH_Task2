document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const notification = document.getElementById('notification');

    // Load tasks from local storage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToList(task.text));
    };

    // Save tasks to local storage
    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Add a task to the list
    const addTaskToList = (text) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${text}</span>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
            <button class="save-to-file">Save to File</button>
        `;
        todoList.appendChild(li);

        li.querySelector('.delete').addEventListener('click', () => {
            li.remove();
            updateLocalStorage();
            showNotification('Task deleted');
        });

        li.querySelector('.edit').addEventListener('click', () => {
            editTask(li, text);
        });

        li.querySelector('.save-to-file').addEventListener('click', () => {
            saveTaskToFile(text);
        });
    };

    // Edit a task
    const editTask = (li, oldText) => {
        const span = li.querySelector('span');
        const editButton = li.querySelector('.edit');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = oldText;
        input.classList.add('edit-input');

        span.replaceWith(input);
        editButton.textContent = 'Save';
        editButton.classList.add('save');
        editButton.classList.remove('edit');
        editButton.addEventListener('click', () => {
            saveTask(li, input);
        });
    };

    // Save a task
    const saveTask = (li, input) => {
        const newText = input.value.trim();
        if (newText) {
            const span = document.createElement('span');
            span.textContent = newText;
            span.classList.add('task-text');

            input.replaceWith(span);
            li.querySelector('.save').textContent = 'Edit';
            li.querySelector('.save').classList.add('edit');
            li.querySelector('.save').classList.remove('save');
            updateLocalStorage();
            showNotification('Task updated');
        }
    };

    // Save task to file
    const saveTaskToFile = async (text) => {
        try {
            const options = {
                suggestedName: `${text.slice(0, 10)}.txt`, // Suggest the first 10 characters of the task as the filename
                types: [
                    {
                        description: 'Text Files',
                        accept: { 'text/plain': ['.txt'] },
                    },
                ],
            };
            const fileHandle = await window.showSaveFilePicker(options);
            const writableStream = await fileHandle.createWritable();
            await writableStream.write(text);
            await writableStream.close();
            showNotification('Task saved to file');
        } catch (error) {
            console.error('Error saving task to file:', error);
            showNotification('Failed to save task');
        }
    };

    // Update local storage
    const updateLocalStorage = () => {
        const tasks = Array.from(todoList.children).map(li => {
            return {
                text: li.querySelector('span.task-text') ? li.querySelector('span.task-text').textContent : li.querySelector('.edit-input').value
            };
        });
        saveTasks(tasks);
    };

    // Show notification
    const showNotification = (message) => {
        notification.textContent = message;
        setTimeout(() => {
            notification.textContent = '';
        }, 2000);
    };

    // Handle form submission
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = todoInput.value.trim();
        if (taskText) {
            addTaskToList(taskText);
            todoInput.value = '';
            updateLocalStorage();
            showNotification('Task added');
        }
    });

    // Initial load
    loadTasks();
});
